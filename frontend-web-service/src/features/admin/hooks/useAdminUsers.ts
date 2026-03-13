/**
 * useAdminUsers
 * ─────────────────────────────────────────────
 * 管理ユーザー一覧を取得するカスタムフック。
 * モックデータをフォールバックとして返す。
 */

import { useQuery } from '@tanstack/react-query';
import type { AdminUser, AdminUsersResponse } from '../types/admin';

// モックユーザーデータ
const MOCK_USERS: AdminUser[] = [
  { id: 'u001', username: 'tanaka_taro', displayName: '田中 太郎', email: 'tanaka@example.com', realm: 'default', role: 'user', status: 'active', createdAt: '2024-01-15T09:00:00Z', lastLoginAt: '2026-03-13T08:30:00Z' },
  { id: 'u002', username: 'yamada_hanako', displayName: '山田 花子', email: 'yamada@example.com', realm: 'default', role: 'user', status: 'active', createdAt: '2024-02-20T10:00:00Z', lastLoginAt: '2026-03-12T14:20:00Z' },
  { id: 'u003', username: 'suzuki_kenji', displayName: '鈴木 健二', email: 'suzuki@example.com', realm: 'default', role: 'admin', status: 'active', createdAt: '2024-03-01T11:00:00Z', lastLoginAt: '2026-03-13T07:15:00Z' },
  { id: 'u004', username: 'sato_yuki', displayName: '佐藤 雪', email: 'sato@example.com', realm: 'default', role: 'user', status: 'suspended', createdAt: '2024-04-10T09:30:00Z', lastLoginAt: '2026-02-28T16:00:00Z' },
  { id: 'u005', username: 'ito_ryota', displayName: '伊藤 亮太', email: 'ito@example.com', realm: 'default', role: 'user', status: 'active', createdAt: '2024-05-05T08:00:00Z', lastLoginAt: '2026-03-11T12:45:00Z' },
  { id: 'u006', username: 'watanabe_mai', displayName: '渡辺 舞', email: 'watanabe@example.com', realm: 'corp', role: 'user', status: 'active', createdAt: '2024-06-15T13:00:00Z', lastLoginAt: '2026-03-10T09:30:00Z' },
  { id: 'u007', username: 'kobayashi_shun', displayName: '小林 俊', email: 'kobayashi@example.com', realm: 'corp', role: 'admin', status: 'active', createdAt: '2024-07-20T10:30:00Z', lastLoginAt: '2026-03-13T06:00:00Z' },
  { id: 'u008', username: 'kato_eri', displayName: '加藤 恵理', email: 'kato@example.com', realm: 'default', role: 'user', status: 'pending', createdAt: '2024-08-01T14:00:00Z', lastLoginAt: null },
  { id: 'u009', username: 'yoshida_daisuke', displayName: '吉田 大輔', email: 'yoshida@example.com', realm: 'default', role: 'user', status: 'active', createdAt: '2024-09-10T09:00:00Z', lastLoginAt: '2026-03-12T18:00:00Z' },
  { id: 'u010', username: 'nakamura_akane', displayName: '中村 朱音', email: 'nakamura@example.com', realm: 'corp', role: 'user', status: 'active', createdAt: '2024-10-05T11:00:00Z', lastLoginAt: '2026-03-13T05:30:00Z' },
];

export interface UseAdminUsersOptions {
  page?: number;
  search?: string;
  status?: string;
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const { page = 1, search = '', status = '' } = options;

  return useQuery<AdminUsersResponse>({
    queryKey: ['admin', 'users', { page, search, status }],
    queryFn: async (): Promise<AdminUsersResponse> => {
      // TODO: adminApi.getUsers() に差し替え
      await new Promise((r) => setTimeout(r, 300));
      let filtered = MOCK_USERS;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.displayName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        );
      }
      if (status) {
        filtered = filtered.filter((u) => u.status === status);
      }
      return { items: filtered, total: filtered.length, page, perPage: 10 };
    },
    staleTime: 30_000,
  });
}
