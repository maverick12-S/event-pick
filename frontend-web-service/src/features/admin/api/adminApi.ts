/**
 * Admin API
 * ─────────────────────────────────────────────
 * 運営管理画面向け API クライアント。
 * endpoints.admin.* を使用してバックエンドと通信する。
 */

import { apiClient as http } from '../../../api/http';
import endpoints from '../../../api/endpoints';
import type {
  AdminUsersResponse,
  AdminUser,
  AdminStats,
  AuthLogsResponse,
  UpdateUserStatusRequest,
} from '../types/admin';

/** クエリパラメータ */
export interface AdminUsersQuery {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  role?: string;
}

export interface AuthLogsQuery {
  page?: number;
  perPage?: number;
  status?: string;
  authMethod?: string;
  from?: string;
  to?: string;
}

export const adminApi = {
  /** ダッシュボード統計取得 */
  getStats(): Promise<AdminStats> {
    return http.get<AdminStats>(endpoints.admin.reportsOverview).then(r => r.data);
  },

  /** ユーザー一覧取得 */
  getUsers(query: AdminUsersQuery = {}): Promise<AdminUsersResponse> {
    return http.get<AdminUsersResponse>(endpoints.admin.users, { params: query }).then(r => r.data);
  },

  /** ユーザー詳細取得 */
  getUser(userId: string): Promise<AdminUser> {
    return http.get<AdminUser>(endpoints.admin.user(userId)).then(r => r.data);
  },

  /** ユーザー停止/復元 */
  updateUserStatus(userId: string, body: UpdateUserStatusRequest): Promise<AdminUser> {
    return http.patch<AdminUser>(endpoints.admin.userSuspend(userId), body).then(r => r.data);
  },

  /** ユーザー削除 */
  deleteUser(userId: string): Promise<void> {
    return http.delete<void>(endpoints.admin.userDelete(userId)).then(() => undefined);
  },

  /** 認証ログ取得 */
  getAuthLogs(query: AuthLogsQuery = {}): Promise<AuthLogsResponse> {
    return http.get<AuthLogsResponse>(endpoints.auditLogs, { params: query }).then(r => r.data);
  },
};

export default adminApi;
