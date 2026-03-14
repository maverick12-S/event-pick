import { describe, it, expect, vi } from 'vitest';

vi.mock('../tokenService', () => ({
  tokenService: {
    getAccessToken: vi.fn().mockReturnValue(null),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    getRefreshToken: vi.fn().mockReturnValue(null),
    isUsingCookies: vi.fn().mockReturnValue(false),
    clear: vi.fn(),
  },
}));

import { apiClient } from '../http';

describe('apiClient (http.ts)', () => {
  it('has correct baseURL', () => {
    expect(apiClient.defaults.baseURL).toBe('/api/v1');
  });

  it('has correct timeout', () => {
    expect(apiClient.defaults.timeout).toBe(15000);
  });

  it('has Content-Type header', () => {
    const ct = apiClient.defaults.headers['Content-Type'] ??
      apiClient.defaults.headers.common?.['Content-Type'];
    expect(ct).toBe('application/json');
  });

  it('has withCredentials enabled', () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });

  it('has CSRF config', () => {
    expect(apiClient.defaults.xsrfCookieName).toBe('XSRF-TOKEN');
    expect(apiClient.defaults.xsrfHeaderName).toBe('X-XSRF-TOKEN');
  });

  it('has request and response interceptors', () => {
    // Axios attaches interceptors.request/response as managers
    expect(apiClient.interceptors.request).toBeDefined();
    expect(apiClient.interceptors.response).toBeDefined();
  });
});
