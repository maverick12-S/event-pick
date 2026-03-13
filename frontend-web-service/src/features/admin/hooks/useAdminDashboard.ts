/**
 * useAdminDashboard
 * ─────────────────────────────────────────────
 * ダッシュボード統計データ＋期間別トレンドを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query';
import type { AdminStats, TrendDataPoint, TrendPeriod } from '../types/admin';

// モックKPIデータ
const MOCK_STATS: AdminStats = {
  corporateCount: 385,
  corporateCountDelta: 4.2,
  locationAccountCount: 1247,
  locationAccountCountDelta: 6.8,
  consumerCount: 28493,
  consumerCountDelta: 3.5,
  lightPlanCount: 198,
  lightPlanCountDelta: 2.1,
  standardPlanCount: 134,
  standardPlanCountDelta: 8.5,
  premiumPlanCount: 53,
  premiumPlanCountDelta: 12.3,
  adFreeCount: 4217,
  adFreeCountDelta: 5.8,
};

// 期間別モックトレンドデータ
const TREND_DATA: Record<TrendPeriod, TrendDataPoint[]> = {
  '1y': Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return { label: `${m}月`, corporateCount: 280 + m * 9, locationAccountCount: 800 + m * 37, consumerCount: 18000 + m * 875, lightPlanCount: 120 + m * 6, standardPlanCount: 60 + m * 6, premiumPlanCount: 15 + m * 3, adFreeCount: 2000 + m * 185 };
  }),
  '6m': Array.from({ length: 6 }, (_, i) => {
    const m = i + 7;
    return { label: `${m}月`, corporateCount: 330 + i * 11, locationAccountCount: 1050 + i * 40, consumerCount: 23000 + i * 1100, lightPlanCount: 170 + i * 6, standardPlanCount: 108 + i * 5, premiumPlanCount: 38 + i * 3, adFreeCount: 3300 + i * 180 };
  }),
  '3m': [
    { label: '1月', corporateCount: 360, locationAccountCount: 1160, consumerCount: 26200, lightPlanCount: 185, standardPlanCount: 124, premiumPlanCount: 46, adFreeCount: 3850 },
    { label: '2月', corporateCount: 372, locationAccountCount: 1200, consumerCount: 27400, lightPlanCount: 192, standardPlanCount: 129, premiumPlanCount: 50, adFreeCount: 4030 },
    { label: '3月', corporateCount: 385, locationAccountCount: 1247, consumerCount: 28493, lightPlanCount: 198, standardPlanCount: 134, premiumPlanCount: 53, adFreeCount: 4217 },
  ],
  '1m': Array.from({ length: 4 }, (_, i) => ({
    label: `第${i + 1}週`,
    corporateCount: 372 + i * 4,
    locationAccountCount: 1210 + i * 12,
    consumerCount: 27600 + i * 300,
    lightPlanCount: 192 + i * 2,
    standardPlanCount: 129 + i * 2,
    premiumPlanCount: 50 + i,
    adFreeCount: 4050 + i * 55,
  })),
  '1w': Array.from({ length: 7 }, (_, i) => {
    const d = 7 + i;
    return { label: `3/${d}`, corporateCount: 380 + i, locationAccountCount: 1235 + i * 2, consumerCount: 28100 + i * 56, lightPlanCount: 196 + Math.round(i * 0.3), standardPlanCount: 133 + Math.round(i * 0.2), premiumPlanCount: 52 + Math.round(i * 0.1), adFreeCount: 4170 + i * 7 };
  }),
  daily: Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    corporateCount: 385,
    locationAccountCount: 1247,
    consumerCount: 28400 + Math.round(Math.sin(i / 3) * 50),
    lightPlanCount: 198,
    standardPlanCount: 134,
    premiumPlanCount: 53,
    adFreeCount: 4217,
  })),
};

export function useAdminDashboard() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async (): Promise<AdminStats> => {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_STATS;
    },
    staleTime: 60_000,
  });
}

export function useAdminTrend(period: TrendPeriod) {
  return useQuery<TrendDataPoint[]>({
    queryKey: ['admin', 'dashboard', 'trend', period],
    queryFn: async (): Promise<TrendDataPoint[]> => {
      await new Promise((r) => setTimeout(r, 300));
      return TREND_DATA[period];
    },
    staleTime: 60_000,
  });
}
