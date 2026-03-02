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
}