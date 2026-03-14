/**
 * AdminDashboardScreen
 * ─────────────────────────────────────────────
 * 運営管理ダッシュボード。
 * - KPIカード（登録法人企業数 / 拠点アカウント数 / 一般消費者数）
 * - 期間切替トレンドチャート（1年/半年/3カ月/1カ月/1週間/日時）
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  FiBriefcase,
  FiHome,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiFeather,
  FiLayers,
  FiAward,
  FiEyeOff,
  FiDollarSign,
} from 'react-icons/fi';
import { useAdminDashboard, useAdminTrend } from '../hooks/useAdminDashboard';
import type { TrendPeriod } from '../types/admin';
import styles from './AdminDashboardScreen.module.css';

// ──────── 期間セレクタ定義 ────────
const PERIOD_OPTIONS: { value: TrendPeriod; label: string }[] = [
  { value: '1y', label: '1年' },
  { value: '6m', label: '半年' },
  { value: '3m', label: '3カ月' },
  { value: '1m', label: '1カ月' },
  { value: '1w', label: '1週間' },
  { value: 'daily', label: '日時' },
];

// ──────── デルタ表示ヘルパー ────────
const DeltaBadge: React.FC<{ value: number }> = ({ value }) => {
  if (value === 0) {
    return (
      <span className={`${styles.deltaBadge} ${styles.deltaNeutral}`}>
        <FiMinus /> 0%
      </span>
    );
  }
  const isPositive = value > 0;
  return (
    <span className={`${styles.deltaBadge} ${isPositive ? styles.deltaPositive : styles.deltaNegative}`}>
      {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
      {Math.abs(value)}%
    </span>
  );
};

// ──────── プラン料金定義 ────────
const PLAN_PRICES = {
  light: 2980,
  standard: 8600,
  premium: 27800,
  adFree: 110,
} as const;

const AdminDashboardScreen: React.FC = () => {
  const { data: stats, isLoading } = useAdminDashboard();
  const [period, setPeriod] = useState<TrendPeriod>('3m');
  const { data: trendData } = useAdminTrend(period);

  // 収益計算
  const revenue = useMemo(() => {
    if (!stats) return null;
    const lightRevenue = stats.lightPlanCount * PLAN_PRICES.light;
    const standardRevenue = stats.standardPlanCount * PLAN_PRICES.standard;
    const premiumRevenue = stats.premiumPlanCount * PLAN_PRICES.premium;
    const adFreeRevenue = stats.adFreeCount * PLAN_PRICES.adFree;
    const total = lightRevenue + standardRevenue + premiumRevenue + adFreeRevenue;
    return {
      items: [
        { name: 'ライト', count: stats.lightPlanCount, price: PLAN_PRICES.light, revenue: lightRevenue, color: '#38bdf8' },
        { name: 'スタンダード', count: stats.standardPlanCount, price: PLAN_PRICES.standard, revenue: standardRevenue, color: '#34d399' },
        { name: 'プレミアム', count: stats.premiumPlanCount, price: PLAN_PRICES.premium, revenue: premiumRevenue, color: '#a78bfa' },
        { name: '広告削除', count: stats.adFreeCount, price: PLAN_PRICES.adFree, revenue: adFreeRevenue, color: '#f87171' },
      ],
      total,
    };
  }, [stats]);

  return (
    <div className={styles.page}>
      {/* ── KPI カード ── */}
      <section className={styles.kpiStack}>
        <div className={styles.kpiTopRow}>
          <KpiCard
            label="一般消費者数"
            value={stats?.consumerCount.toLocaleString() ?? '−'}
            delta={stats?.consumerCountDelta ?? 0}
            icon={<FiUser />}
            color="purple"
            loading={isLoading}
          />
          <KpiCard
            label="広告削除モード利用者"
            value={stats?.adFreeCount.toLocaleString() ?? '−'}
            delta={stats?.adFreeCountDelta ?? 0}
            icon={<FiEyeOff />}
            color="red"
            loading={isLoading}
          />
        </div>

        <div className={styles.kpiBottomRow}>
          <KpiCard
            label="登録法人企業数"
            value={stats?.corporateCount.toLocaleString() ?? '−'}
            delta={stats?.corporateCountDelta ?? 0}
            icon={<FiBriefcase />}
            color="blue"
            loading={isLoading}
          />
          <KpiCard
            label="拠点アカウント数"
            value={stats?.locationAccountCount.toLocaleString() ?? '−'}
            delta={stats?.locationAccountCountDelta ?? 0}
            icon={<FiHome />}
            color="green"
            loading={isLoading}
          />
        </div>
      </section>

      {/* ── プラン登録数 KPI ── */}
      <section className={styles.kpiGrid}>
        <KpiCard
          label="ライトプラン"
          value={stats?.lightPlanCount.toLocaleString() ?? '−'}
          delta={stats?.lightPlanCountDelta ?? 0}
          icon={<FiFeather />}
          color="blue"
          loading={isLoading}
        />
        <KpiCard
          label="スタンダードプラン"
          value={stats?.standardPlanCount.toLocaleString() ?? '−'}
          delta={stats?.standardPlanCountDelta ?? 0}
          icon={<FiLayers />}
          color="green"
          loading={isLoading}
        />
        <KpiCard
          label="プレミアムプラン"
          value={stats?.premiumPlanCount.toLocaleString() ?? '−'}
          delta={stats?.premiumPlanCountDelta ?? 0}
          icon={<FiAward />}
          color="purple"
          loading={isLoading}
        />
      </section>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>登録数の推移</h2>
          <div className={styles.periodSelector}>
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.periodBtn} ${period === opt.value ? styles.periodBtnActive : ''}`}
                onClick={() => setPeriod(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData ?? []} margin={{ top: 8, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(7,16,32,0.95)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  color: '#fff',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}
              />
              <Line type="monotone" dataKey="corporateCount" stroke="#60a5fa" strokeWidth={2} dot={false} name="法人企業数" />
              <Line type="monotone" dataKey="locationAccountCount" stroke="#4ade80" strokeWidth={2} dot={false} name="拠点アカウント数" />
              <Line type="monotone" dataKey="consumerCount" stroke="#c084fc" strokeWidth={2} dot={false} name="一般消費者数" />
              <Line type="monotone" dataKey="lightPlanCount" stroke="#38bdf8" strokeWidth={2} dot={false} name="ライト" strokeDasharray="6 3" />
              <Line type="monotone" dataKey="standardPlanCount" stroke="#34d399" strokeWidth={2} dot={false} name="スタンダード" strokeDasharray="6 3" />
              <Line type="monotone" dataKey="premiumPlanCount" stroke="#a78bfa" strokeWidth={2} dot={false} name="プレミアム" strokeDasharray="6 3" />
              <Line type="monotone" dataKey="adFreeCount" stroke="#f87171" strokeWidth={2} dot={false} name="広告削除" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── 収益サマリー ── */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <FiDollarSign style={{ marginRight: 6, verticalAlign: 'middle' }} />
            収益サマリー（月額）
          </h2>
        </div>
        {revenue && (
          <>
            <div className={styles.revenueTotal}>
              <span className={styles.revenueTotalLabel}>合計収益</span>
              <span className={styles.revenueTotalValue}>¥{revenue.total.toLocaleString()}</span>
            </div>
            <div className={styles.revenueGrid}>
              {revenue.items.map((item) => (
                <div key={item.name} className={styles.revenueItem}>
                  <div className={styles.revenueItemHeader}>
                    <span className={styles.revenueItemDot} style={{ background: item.color }} />
                    <span className={styles.revenueItemName}>{item.name}</span>
                  </div>
                  <div className={styles.revenueItemPrice}>¥{item.price.toLocaleString()}/月 × {item.count.toLocaleString()}件</div>
                  <div className={styles.revenueItemTotal}>¥{item.revenue.toLocaleString()}</div>
                  <div className={styles.revenueItemBar}>
                    <div
                      className={styles.revenueItemBarFill}
                      style={{ width: `${(item.revenue / revenue.total) * 100}%`, background: item.color }}
                    />
                  </div>
                  <div className={styles.revenueItemPct}>{((item.revenue / revenue.total) * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenue.items} margin={{ top: 8, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(7,16,32,0.95)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#fff',
                    }}
                    formatter={(value: unknown) => [`¥${Number(value).toLocaleString()}`, '収益']}
                  />
                  <Bar dataKey="revenue" name="収益" radius={[6, 6, 0, 0]}>
                    {revenue.items.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

// ──────── KPI カードコンポーネント ────────
interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red';
  loading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, icon, color, loading }) => (
  <div className={`${styles.kpiCard} ${styles[`kpiCard_${color}`]}`}>
    <div className={styles.kpiTop}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={`${styles.kpiIcon} ${styles[`kpiIcon_${color}`]}`}>{icon}</span>
    </div>
    <div className={styles.kpiValue}>{loading ? '…' : value}</div>
    <DeltaBadge value={delta} />
  </div>
);

export default AdminDashboardScreen;
