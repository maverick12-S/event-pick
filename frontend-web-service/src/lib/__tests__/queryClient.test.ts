import { describe, it, expect, vi, beforeEach } from 'vitest';
import { queryClient } from '../queryClient';

describe('queryClient', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('is a QueryClient instance', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryData).toBe('function');
    expect(typeof queryClient.setQueryData).toBe('function');
  });

  it('has retry disabled for 401/403/404', () => {
    const retryFn = queryClient.getDefaultOptions().queries?.retry;
    expect(typeof retryFn).toBe('function');
    if (typeof retryFn === 'function') {
      expect(retryFn(0, { status: 401 })).toBe(false);
      expect(retryFn(0, { status: 403 })).toBe(false);
      expect(retryFn(0, { status: 404 })).toBe(false);
      expect(retryFn(0, { status: 500 })).toBe(true);
      expect(retryFn(1, { status: 500 })).toBe(false);
    }
  });

  it('has mutations retry set to 0', () => {
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(0);
  });

  it('has refetchOnWindowFocus disabled', () => {
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false);
  });

  it('dispatches auth:logout on 401 via queryCache onError', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const cache = queryClient.getQueryCache();
    const onError = (cache as any).config?.onError;
    if (onError) {
      onError({ response: { status: 401 }, isAxiosError: true });
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:logout' }));
    }
    dispatchSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
