import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock import.meta.env before importing tokenService
vi.stubGlobal('import', { meta: { env: { VITE_AUTH_USE_COOKIES: 'false', VITE_MOCK_AUTH: 'false' } } });

describe('tokenService', () => {
  let tokenService: typeof import('../tokenService').tokenService;

  beforeEach(async () => {
    localStorage.clear();
    // Dynamic import to pick up fresh module
    vi.resetModules();
    const mod = await import('../tokenService');
    tokenService = mod.tokenService;
  });

  it('getAccessToken returns null when no token', () => {
    expect(tokenService.getAccessToken()).toBeNull();
  });

  it('setAccessToken / getAccessToken roundtrip', () => {
    tokenService.setAccessToken('test-token');
    expect(tokenService.getAccessToken()).toBe('test-token');
  });

  it('setAccessToken(null) removes token', () => {
    tokenService.setAccessToken('test-token');
    tokenService.setAccessToken(null);
    expect(tokenService.getAccessToken()).toBeNull();
  });

  it('getRefreshToken returns null when no token', () => {
    expect(tokenService.getRefreshToken()).toBeNull();
  });

  it('setRefreshToken / getRefreshToken roundtrip', () => {
    tokenService.setRefreshToken('refresh-token');
    expect(tokenService.getRefreshToken()).toBe('refresh-token');
  });

  it('clear removes both tokens', () => {
    tokenService.setAccessToken('at');
    tokenService.setRefreshToken('rt');
    tokenService.clear();
    expect(tokenService.getAccessToken()).toBeNull();
    expect(tokenService.getRefreshToken()).toBeNull();
  });

  it('isUsingCookies returns false by default', () => {
    expect(tokenService.isUsingCookies()).toBe(false);
  });
});
