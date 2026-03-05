import { apiClient } from '../../../api/client'; 
import type { LoginRequest, LoginResponse } from '../../../types/auth';

// 開発中はモック認証を固定（ログイン導線を安定させる）
const USE_MOCK_AUTH = true;

export const authApi = {
      /**
   * ログイン
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // モックモード: ダミーレスポンスを返す
    if (USE_MOCK_AUTH) {
      console.log('🎭 authApi: Mock auth enabled, returning mock response');
      await new Promise((res) => setTimeout(res, 300));
      return {
        access_token: 'mock-access-token-' + Date.now(),
        expires_in: 3600,
        refresh_expires_in: 604800,
        refresh_token: 'mock-refresh-token-' + Date.now(),
        token_type: 'Bearer',
        session_state: 'mock-session-state',
        scope: 'openid profile email',
      };
    }
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
    /**
   * パスワードリセットメール送信
   * POST /auth/password-reset
   */
  requestPasswordReset: async (username: string, realm: string): Promise<void> => {
    await apiClient.post('/auth/password-reset', { username, realm });
  },
  /**
   * 現在のログインユーザー情報を取得
   * GET /auth/me
   */
  getMe: async (): Promise<import('../../../types/auth').AuthUser> => {
    if (USE_MOCK_AUTH) {
      await new Promise((res) => setTimeout(res, 120));
      return {
        id: 'mock-user-1',
        username: 'mock.user',
        realm: 'mock-realm',
        displayName: 'モックユーザー',
      };
    }
    const response = await apiClient.get<import('../../../types/auth').AuthUser>('/auth/me');
    return response.data;
  },
}