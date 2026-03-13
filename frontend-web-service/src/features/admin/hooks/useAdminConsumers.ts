/**
 * useAdminConsumers
 * ─────────────────────────────────────────────
 * 一般消費者アカウント一覧を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query';
import type { ConsumerAccount, ConsumersResponse } from '../types/admin';

const MOCK_CONSUMERS: ConsumerAccount[] = [
  { id: 'c001', username: 'tanaka_taro', displayName: '田中 太郎', email: 'tanaka@example.com', phone: '090-1234-5678', status: 'active', createdAt: '2024-01-15T09:00:00Z', lastLoginAt: '2026-03-13T08:30:00Z' },
  { id: 'c002', username: 'yamada_hanako', displayName: '山田 花子', email: 'yamada@example.com', phone: '090-2345-6789', status: 'active', createdAt: '2024-02-20T10:00:00Z', lastLoginAt: '2026-03-12T14:20:00Z' },
  { id: 'c003', username: 'sato_yuki', displayName: '佐藤 雪', email: 'sato@example.com', phone: '080-3456-7890', status: 'suspended', createdAt: '2024-04-10T09:30:00Z', lastLoginAt: '2026-02-28T16:00:00Z' },
  { id: 'c004', username: 'ito_ryota', displayName: '伊藤 亮太', email: 'ito@example.com', phone: '090-4567-8901', status: 'active', createdAt: '2024-05-05T08:00:00Z', lastLoginAt: '2026-03-11T12:45:00Z' },
  { id: 'c005', username: 'watanabe_mai', displayName: '渡辺 舞', email: 'watanabe@example.com', phone: '070-5678-9012', status: 'active', createdAt: '2024-06-15T13:00:00Z', lastLoginAt: '2026-03-10T09:30:00Z' },
  { id: 'c006', username: 'kato_eri', displayName: '加藤 恵理', email: 'kato@example.com', phone: '090-6789-0123', status: 'delete_scheduled', createdAt: '2024-08-01T14:00:00Z', lastLoginAt: '2026-01-15T10:00:00Z', deleteScheduledAt: '2026-04-01T00:00:00Z' },
  { id: 'c007', username: 'yoshida_daisuke', displayName: '吉田 大輔', email: 'yoshida@example.com', phone: '080-7890-1234', status: 'active', createdAt: '2024-09-10T09:00:00Z', lastLoginAt: '2026-03-12T18:00:00Z' },
  { id: 'c008', username: 'nakamura_akane', displayName: '中村 朱音', email: 'nakamura@example.com', phone: '090-8901-2345', status: 'active', createdAt: '2024-10-05T11:00:00Z', lastLoginAt: '2026-03-13T05:30:00Z' },
  { id: 'c009', username: 'takahashi_ken', displayName: '高橋 健', email: 'takahashi@example.com', phone: '070-9012-3456', status: 'suspended', createdAt: '2024-11-20T10:00:00Z', lastLoginAt: '2026-02-10T09:00:00Z' },
  { id: 'c010', username: 'matsumoto_yui', displayName: '松本 結衣', email: 'matsumoto@example.com', phone: '090-0123-4567', status: 'active', createdAt: '2025-01-08T08:30:00Z', lastLoginAt: '2026-03-13T07:00:00Z' },
];

export interface UseAdminConsumersOptions {
  search?: string;
  enabled?: boolean;
}

export function useAdminConsumers(options: UseAdminConsumersOptions = {}) {
  const { search = '', enabled = false } = options;

  return useQuery<ConsumersResponse>({
    queryKey: ['admin', 'consumers', { search }],
    queryFn: async (): Promise<ConsumersResponse> => {
      await new Promise((r) => setTimeout(r, 300));
      let filtered = MOCK_CONSUMERS;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.displayName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q),
        );
      }
      return { items: filtered, total: filtered.length, page: 1, perPage: 50 };
    },
    enabled,
    staleTime: 30_000,
  });
}
