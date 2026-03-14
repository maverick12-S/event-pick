import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../api/tokenService', () => ({
  tokenService: {
    getAccessToken: vi.fn().mockReturnValue(null),
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    getRefreshToken: vi.fn().mockReturnValue(null),
    isUsingCookies: vi.fn().mockReturnValue(false),
    clear: vi.fn(),
  },
}));

vi.mock('../../../../api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { authApi } from '../authApi';
import { tokenService } from '../../../../api/tokenService';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('returns mock response with access_token', async () => {
      const result = await authApi.login({
        realm: 'test',
        username: 'user',
        password: 'pass',
      });
      expect(result.access_token).toBeDefined();
      expect(result.token_type).toBe('Bearer');
      expect(result.expires_in).toBe(3600);
    });

    it('returns operator token for operator credentials', async () => {
      const result = await authApi.login({
        realm: '08001234',
        username: 'test',
        password: '12345678',
      });
      expect(result.access_token).toMatch(/^mock-ops-access-token-/);
      expect(result.scope).toContain('eventpick:ops');
    });

    it('returns user token for non-operator credentials', async () => {
      const result = await authApi.login({
        realm: 'default',
        username: 'normal',
        password: 'pass123',
      });
      expect(result.access_token).toMatch(/^mock-access-token-/);
      expect(result.scope).not.toContain('eventpick:ops');
    });
  });

  describe('getMe', () => {
    it('returns operator user when operator token', async () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue('mock-ops-access-token-12345');
      const user = await authApi.getMe();
      expect(user.id).toBe('operator-root');
      expect(user.username).toBe('test');
    });

    it('returns mock user when regular token', async () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue('mock-access-token-12345');
      const user = await authApi.getMe();
      expect(user.id).toBe('mock-user-1');
      expect(user.username).toBe('mock.user');
    });
  });
});
