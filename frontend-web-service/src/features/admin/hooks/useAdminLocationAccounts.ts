/**
 * useAdminLocationAccounts
 * ─────────────────────────────────────────────
 * 拠点アカウント一覧を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query';
import type { LocationAccount, LocationAccountsResponse } from '../types/admin';

const MOCK_LOCATION_ACCOUNTS: LocationAccount[] = [
  { id: 'la001', corporateName: '株式会社イベントプロ', locationName: '東京本社', managerName: '田中 一郎', email: 'tanaka@eventpro.co.jp', phone: '03-1234-5678', realm: 'eventpro', status: 'active', createdAt: '2024-01-10T09:00:00Z', lastLoginAt: '2026-03-13T09:15:00Z' },
  { id: 'la002', corporateName: '株式会社イベントプロ', locationName: '大阪支社', managerName: '山本 直樹', email: 'yamamoto@eventpro.co.jp', phone: '06-2345-6789', realm: 'eventpro', status: 'active', createdAt: '2024-02-15T10:00:00Z', lastLoginAt: '2026-03-12T14:30:00Z' },
  { id: 'la003', corporateName: '合同会社フェスタ', locationName: '名古屋店', managerName: '佐々木 美咲', email: 'sasaki@festa.jp', phone: '052-3456-7890', realm: 'festa', status: 'active', createdAt: '2024-03-20T11:00:00Z', lastLoginAt: '2026-03-11T16:00:00Z' },
  { id: 'la004', corporateName: '株式会社パーティタイム', locationName: '福岡拠点', managerName: '小川 翔太', email: 'ogawa@partytime.co.jp', phone: '092-4567-8901', realm: 'partytime', status: 'suspended', createdAt: '2024-04-01T08:30:00Z', lastLoginAt: '2026-02-20T10:00:00Z' },
  { id: 'la005', corporateName: '合同会社フェスタ', locationName: '札幌店', managerName: '高田 恵', email: 'takada@festa.jp', phone: '011-5678-9012', realm: 'festa', status: 'active', createdAt: '2024-05-10T09:00:00Z', lastLoginAt: '2026-03-10T11:45:00Z' },
  { id: 'la006', corporateName: '株式会社セレブレーション', locationName: '横浜本店', managerName: '松田 裕子', email: 'matsuda@celebration.co.jp', phone: '045-6789-0123', realm: 'celebration', status: 'delete_scheduled', createdAt: '2024-06-20T10:30:00Z', lastLoginAt: '2026-01-30T09:00:00Z', deleteScheduledAt: '2026-04-15T00:00:00Z' },
  { id: 'la007', corporateName: '株式会社パーティタイム', locationName: '仙台拠点', managerName: '井上 隆', email: 'inoue@partytime.co.jp', phone: '022-7890-1234', realm: 'partytime', status: 'active', createdAt: '2024-07-15T13:00:00Z', lastLoginAt: '2026-03-12T08:30:00Z' },
  { id: 'la008', corporateName: '株式会社グランドイベント', locationName: '広島営業所', managerName: '渡部 真紀', email: 'watabe@grandevent.co.jp', phone: '082-8901-2345', realm: 'grandevent', status: 'active', createdAt: '2024-08-01T14:00:00Z', lastLoginAt: '2026-03-13T07:00:00Z' },
];

export interface UseAdminLocationAccountsOptions {
  search?: string;
  enabled?: boolean;
}

export function useAdminLocationAccounts(options: UseAdminLocationAccountsOptions = {}) {
  const { search = '', enabled = false } = options;

  return useQuery<LocationAccountsResponse>({
    queryKey: ['admin', 'locationAccounts', { search }],
    queryFn: async (): Promise<LocationAccountsResponse> => {
      await new Promise((r) => setTimeout(r, 300));
      let filtered = MOCK_LOCATION_ACCOUNTS;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.corporateName.toLowerCase().includes(q) ||
            a.locationName.toLowerCase().includes(q) ||
            a.managerName.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.phone.includes(q) ||
            a.realm.toLowerCase().includes(q),
        );
      }
      return { items: filtered, total: filtered.length, page: 1, perPage: 50 };
    },
    enabled,
    staleTime: 30_000,
  });
}
