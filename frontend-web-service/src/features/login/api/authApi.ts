import { apiClient } from '../../../api/client'; 
import type { LoginRequest, LoginResponse } from '../../../types/auth';

export const authApi = {
      /**
   * ログイン
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
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
    const response = await apiClient.get<import('../../../types/auth').AuthUser>('/auth/me');
    return response.data;
  },
}