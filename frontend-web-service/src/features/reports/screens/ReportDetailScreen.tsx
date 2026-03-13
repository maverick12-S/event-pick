import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEye,
  FiHeart,
  FiMapPin,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useReportDetailMock from '../hooks/useReportDetailMock';
import type { DemographicAccountBlock, ReportMetricKey } from '../../../types/models/reportDetail';

const PALETTE = {
  bg: 'linear-gradient(135deg, #0f1923 0%, #0f2236 50%, #0a1a2e 100%)',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.09)',
  glass: 'rgba(255,255,255,0.07)',
  text: '#e8f0fe',
  subtext: '#8ca4c0',
  accent: '#4f8ef7',
  views: '#4f8ef7',
  likes: '#f0507a',
  favorites: '#34d399',
  male: '#4f8ef7',
  female: '#f472b6',
  other: '#a78bfa',
  funnel: ['#4f8ef7', '#60a5fa', '#f0507a', '#34d399'],
};

const metricLabel: Record<ReportMetricKey, string> = {
  views: '閲覧',
  likes: 'いいね',
  favorites: 'お気に入り',
};

const metricColor: Record<ReportMetricKey, string> = {
  views: PALETTE.views,
  likes: PALETTE.likes,
  favorites: PALETTE.favorites,
};

const genderColor: Record<string, string> = {
  男性: PALETTE.male,
  女性: PALETTE.female,
  その他: PALETTE.other,
};

const genderOrder = ['男性', '女性', 'その他'] as const;
const REPORT_DETAIL_IMAGE_MAX_WIDTH = { xs: '100%', sm: 420, md: 460, lg: 500 } as const;

const toAgeLabel = (bin: string) => (bin.includes('以上') ? bin : `${bin}歳`);

const formatCountTick = (value: number) => {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        background: 'rgba(15,25,40,0.96)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 1.5,
        p: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      }}
    >
      {label && (
        <Typography sx={{ color: PALETTE.subtext, fontSize: '0.75rem', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      {payload.map((entry: any) => (
        <Stack key={entry.dataKey} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
          <Typography sx={{ color: PALETTE.text, fontSize: '0.82rem', fontWeight: 700 }}>
            {entry.name}: {Number(entry.value).toLocaleString('ja-JP')}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

const KpiCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}> = ({ label, value, icon, color, sub }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 180,
      borderRadius: 2.5,
      border: `1px solid ${color}33`,
      background: `linear-gradient(135deg, ${color}18 0%, rgba(255,255,255,0.03) 100%)`,
      p: '18px 22px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: -24,
        right: -24,
        width: 88,
        height: 88,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
      }}
    />
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography sx={{ color: PALETTE.subtext, fontSize: '0.78rem', fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ color: PALETTE.text, fontSize: '2rem', fontWeight: 800, lineHeight: 1.15 }}>
          {value.toLocaleString('ja-JP')}
        </Typography>
        {sub && <Typography sx={{ color, fontSize: '0.75rem', fontWeight: 700, mt: 0.4 }}>{sub}</Typography>}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          backgroundColor: `${color}22`,
          display: 'grid',
          placeItems: 'center',
          color,
          fontSize: '1.2rem',
        }}
      >
        {icon}
      </Box>
    </Stack>
  </Box>
);

const Section: React.FC<{ title?: string; badge?: string; children: React.ReactNode }> = ({
  title,
  badge,
  children,
}) => (
  <Box
    sx={{
      borderRadius: 2.5,
      border: `1px solid ${PALETTE.cardBorder}`,
      background: PALETTE.card,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      p: { xs: '16px', md: '24px' },
      boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
    }}
  >
    {(title || badge) && (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {title && (
          <Typography sx={{ color: PALETTE.text, fontWeight: 800, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
            {title}
          </Typography>
        )}
        {badge && (
          <Box
            sx={{
              px: 1,
              py: '2px',
              borderRadius: 99,
              background: `${PALETTE.accent}28`,
              border: `1px solid ${PALETTE.accent}55`,
            }}
          >
            <Typography sx={{ color: PALETTE.accent, fontSize: '0.7rem', fontWeight: 800 }}>{badge}</Typography>
          </Box>
        )}
      </Stack>
    )}
    {children}
  </Box>
);

const ReportDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { reportId = '' } = useParams();
  const [selectedMetric, setSelectedMetric] = useState<ReportMetricKey>('views');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const detailQuery = useReportDetailMock(reportId);
  const detail = detailQuery.data;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [detail?.id]);

  const metricAccounts = useMemo<DemographicAccountBlock[]>(() => {
    if (!detail) return [];
    return detail.demographics[selectedMetric];
  }, [detail, selectedMetric]);

  const resolvedAccountId = useMemo(() => {
    if (!metricAccounts.length) return '';
    return metricAccounts[0].accountId;
  }, [metricAccounts]);

  const selectedAccount = useMemo(
    () => metricAccounts.find((a) => a.accountId === resolvedAccountId) ?? metricAccounts[0] ?? null,
    [metricAccounts, resolvedAccountId],
  );

  const impressions = useMemo(() => {
    if (!detail) return 0;
    // Temporary assumption until backend provides impressions.
    return detail.views * 2;
  }, [detail]);

  const ageChartData = useMemo(() => {
    if (!detail || !resolvedAccountId) return [];

    const get = (metric: ReportMetricKey) => {
      const accs = detail.demographics[metric];
      return accs.find((a) => a.accountId === resolvedAccountId) ?? accs[0];
    };

    const va = get('views');
    const la = get('likes');
    const fa = get('favorites');

    return detail.demographics.ageBins.map((age, idx) => ({
      age: toAgeLabel(age),
      閲覧: va.rows.reduce((s, r) => s + (r.values[idx] ?? 0), 0),
      いいね: la.rows.reduce((s, r) => s + (r.values[idx] ?? 0), 0),
      お気に入り: fa.rows.reduce((s, r) => s + (r.values[idx] ?? 0), 0),
    }));
  }, [detail, resolvedAccountId]);

  const genderChartData = useMemo(() => {
    if (!detail || !selectedAccount) return [];

    return detail.demographics.ageBins.map((age, idx) => {
      const row: Record<string, any> = { age: toAgeLabel(age) };
      for (const r of selectedAccount.rows) row[r.gender] = r.values[idx] ?? 0;
      return row;
    });
  }, [detail, selectedAccount]);

  const genderTotals = useMemo(() => {
    if (!selectedAccount) return [] as Array<{ gender: string; total: number; pct: number }>;
    const items = selectedAccount.rows.map((r) => ({
      gender: r.gender,
      total: r.values.reduce((s, v) => s + v, 0),
    }));
    const grand = items.reduce((s, i) => s + i.total, 0) || 1;
    return items.map((i) => ({ ...i, pct: (i.total / grand) * 100 }));
  }, [selectedAccount]);

  const regionData = useMemo(
    () =>
      metricAccounts
        .map((account) => {
          const total = account.rows.reduce((s, r) => s + r.values.reduce((ss, v) => ss + v, 0), 0);
          return { name: account.accountId, total };
        })
        .sort((a, b) => b.total - a.total),
    [metricAccounts],
  );

  const funnelData = useMemo(() => {
    const views = detail?.views ?? 0;
    const likes = detail?.likes ?? 0;
    const fav = detail?.favoritesCount ?? 0;

    return [
      { name: 'Impressions', value: impressions, fill: PALETTE.funnel[0] },
      {
        name: 'Views',
        value: views,
        fill: PALETTE.funnel[1],
        rate: impressions > 0 ? ((views / impressions) * 100).toFixed(1) : '0.0',
      },
      {
        name: 'Likes',
        value: likes,
        fill: PALETTE.funnel[2],
        rate: views > 0 ? ((likes / views) * 100).toFixed(1) : '0.0',
      },
      {
        name: 'Favorites',
        value: fav,
        fill: PALETTE.funnel[3],
        rate: likes > 0 ? ((fav / likes) * 100).toFixed(1) : '0.0',
      },
    ];
  }, [detail, impressions]);

  const favoriteBaseAccount = useMemo(() => {
    if (!detail) return null;
    return detail.demographics.favorites.find((account) => account.accountId === detail.accountId) ?? detail.demographics.favorites[0] ?? null;
  }, [detail]);

  const favoriteAgeTotals = useMemo(() => {
    if (!detail || !favoriteBaseAccount) return [] as Array<{ age: string; total: number }>;
    return detail.demographics.ageBins.map((age, idx) => ({
      age,
      total: favoriteBaseAccount.rows.reduce((sum, row) => sum + (row.values[idx] ?? 0), 0),
    }));
  }, [detail, favoriteBaseAccount]);

  const favoriteTotalCount = useMemo(
    () => favoriteAgeTotals.reduce((sum, row) => sum + row.total, 0),
    [favoriteAgeTotals],
  );

  const favoriteTopAge = useMemo(
    () => favoriteAgeTotals.slice().sort((a, b) => b.total - a.total)[0] ?? null,
    [favoriteAgeTotals],
  );

  const favoriteGenderData = useMemo(() => {
    if (!favoriteBaseAccount) return [] as Array<{ name: string; value: number }>;
    return favoriteBaseAccount.rows.map((row) => ({
      name: row.gender,
      value: row.values.reduce((sum, v) => sum + v, 0),
    }));
  }, [favoriteBaseAccount]);

  const favoriteRegionData = useMemo(() => {
    if (!detail) return [] as Array<{ name: string; total: number }>;
    return detail.demographics.favorites
      .map((account) => ({
        name: account.accountId,
        total: account.rows.reduce((sum, row) => sum + row.values.reduce((s, v) => s + v, 0), 0),
      }))
      .sort((a, b) => b.total - a.total);
  }, [detail]);

  const favoriteRegionChartHeight = useMemo(
    () => Math.max(230, favoriteRegionData.length * 44),
    [favoriteRegionData.length],
  );

  if (detailQuery.isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress sx={{ color: PALETTE.accent }} />
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: PALETTE.bg }}>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ color: PALETTE.text, fontSize: '1.1rem' }}>レポートが見つかりませんでした。</Typography>
          <ButtonBase onClick={() => navigate('/report')} sx={backBtnSx}>
            一覧へ戻る
          </ButtonBase>
        </Stack>
      </Box>
    );
  }

  const ctr = impressions > 0 ? (detail.views / impressions) * 100 : 0;
  const engagementRate = detail.views > 0 ? (detail.likes / detail.views) * 100 : 0;

  return (
    <Box sx={{ background: PALETTE.bg, minHeight: '100vh', px: { xs: 1.5, md: 3 }, pb: 6, pt: 2 }}>
      <Box sx={{ maxWidth: 1360, mx: 'auto' }}>
        <ButtonBase onClick={() => navigate('/report')} sx={backBtnSx}>
          <FiArrowLeft />レポート一覧へ戻る
        </ButtonBase>

        <Stack spacing={2.5}>
          <Section title="投稿詳細">
            <Box sx={{ width: '100%', maxWidth: REPORT_DETAIL_IMAGE_MAX_WIDTH, mx: 'auto', mb: 1.5 }}>
              <Box
                component="img"
                src={detail.images[activeImageIndex] ?? detail.images[0]}
                alt={detail.title}
                sx={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 2, display: 'block' }}
              />
            </Box>

            {detail.images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ mb: 1.5, overflowX: 'auto', pb: 0.5, width: '100%', maxWidth: REPORT_DETAIL_IMAGE_MAX_WIDTH, mx: 'auto' }}>
                {detail.images.map((src, i) => (
                  <ButtonBase
                    key={`${src}-${i}`}
                    onClick={() => setActiveImageIndex(i)}
                    sx={{
                      borderRadius: 1.5,
                      border: i === activeImageIndex ? '2px solid rgba(100, 170, 255, 0.9)' : '2px solid transparent',
                      flex: '0 0 auto',
                      overflow: 'hidden',
                      opacity: i === activeImageIndex ? 1 : 0.75,
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`sub-${i}`}
                      sx={{ width: 72, aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }}
                    />
                  </ButtonBase>
                ))}
              </Stack>
            )}

            <Typography sx={{ color: PALETTE.text, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.55rem' }, mb: 0.5 }}>
              {detail.title}
            </Typography>
            <Typography sx={{ color: PALETTE.subtext, fontSize: '0.95rem', mb: 1.5 }}>{detail.summary}</Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
              {[
                { icon: <FiCalendar />, val: detail.postedAt.replaceAll('-', '.') },
                { icon: <FiClock />, val: detail.postedTimeRange },
                { icon: <FiMapPin />, val: detail.location },
              ].map(({ icon, val }) => (
                <Box
                  key={val}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.7,
                    px: 1.4,
                    py: 0.75,
                    borderRadius: 2,
                    border: `1px solid ${PALETTE.cardBorder}`,
                    background: PALETTE.glass,
                    color: PALETTE.subtext,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  <Box sx={{ color: PALETTE.accent }}>{icon}</Box>
                  {val}
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ rowGap: 0.8, mb: 1.5 }}>
              {detail.tags.map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  sx={{
                    background: `${PALETTE.accent}20`,
                    color: PALETTE.accent,
                    fontWeight: 700,
                    border: `1px solid ${PALETTE.accent}44`,
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ p: 1.5, borderRadius: 1.5, border: `1px solid ${PALETTE.cardBorder}`, background: PALETTE.glass }}>
              <Typography sx={{ color: PALETTE.accent, fontWeight: 700, fontSize: '0.82rem', mb: 0.5 }}>投稿概要</Typography>
              <Typography sx={{ color: PALETTE.subtext, lineHeight: 1.75, fontSize: '0.9rem' }}>
                {detail.summary || detail.overview}
              </Typography>
            </Box>
          </Section>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
            <KpiCard label="表示回数(仮)" value={impressions} icon={<FiEye />} color="#60a5fa" sub="Impressions" />
            <KpiCard label="投稿閲覧数" value={detail.views} icon={<FiEye />} color={PALETTE.views} sub="Total Views" />
            <KpiCard label="いいね数" value={detail.likes} icon={<FiHeart />} color={PALETTE.likes} sub="Total Likes" />
            <KpiCard label="お気に入り登録数" value={detail.favoritesCount} icon={<FiStar />} color={PALETTE.favorites} sub="Favorites" />
            <KpiCard
              label="CTR"
              value={Number.parseFloat(ctr.toFixed(2))}
              icon={<FiTrendingUp />}
              color="#60a5fa"
              sub="Click Through Rate (%)"
            />
            <KpiCard
              label="エンゲージメント率"
              value={Number.parseFloat(engagementRate.toFixed(2))}
              icon={<FiTrendingUp />}
              color="#f59e0b"
              sub="Engagement Rate (%)"
            />
          </Stack>

          <Section title="Analytics Dashboard" badge="LIVE">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
              sx={{
                mb: 2.5,
                p: '12px 16px',
                borderRadius: 2,
                border: `1px solid ${PALETTE.cardBorder}`,
                background: PALETTE.glass,
              }}
            >
              <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ rowGap: 0.8 }}>
                {(['views', 'likes', 'favorites'] as ReportMetricKey[]).map((key) => {
                  const active = selectedMetric === key;
                  return (
                    <ButtonBase
                      key={key}
                      onClick={() => setSelectedMetric(key)}
                      sx={{
                        px: 1.4,
                        py: 0.65,
                        borderRadius: 2,
                        border: `1px solid ${active ? metricColor[key] : PALETTE.cardBorder}`,
                        background: active ? `${metricColor[key]}25` : 'transparent',
                        color: active ? metricColor[key] : PALETTE.subtext,
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      {metricLabel[key]}
                    </ButtonBase>
                  );
                })}
              </Stack>
            </Stack>

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
              <Box sx={{ ...chartCardSx, gridColumn: { xs: '1', lg: '1 / -1' } }}>
                <ChartTitle number="1" text="年代分析 - Views / Likes / Favorites" />
                <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
                  {([
                    ['閲覧', PALETTE.views],
                    ['いいね', PALETTE.likes],
                    ['お気に入り', PALETTE.favorites],
                  ] as [string, string][]).map(([label, color]) => (
                    <Stack key={label} direction="row" spacing={0.5} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
                      <Typography sx={{ color: PALETTE.subtext, fontSize: '0.75rem', fontWeight: 700 }}>{label}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ageChartData} barCategoryGap="30%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="age" tick={{ fill: PALETTE.subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: PALETTE.subtext, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="閲覧" fill={PALETTE.views} radius={[4, 4, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="いいね" fill={PALETTE.likes} radius={[4, 4, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="お気に入り" fill={PALETTE.favorites} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={chartCardSx}>
                <ChartTitle number="2" text="性別分布 - Stacked Bar" />
                <Stack direction="row" spacing={1.2} sx={{ mb: 1.5, flexWrap: 'wrap', rowGap: 0.8 }}>
                  {genderTotals.map((g) => (
                    <Box
                      key={g.gender}
                      sx={{
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 99,
                        background: `${genderColor[g.gender]}22`,
                        border: `1px solid ${genderColor[g.gender]}55`,
                      }}
                    >
                      <Typography sx={{ color: genderColor[g.gender], fontSize: '0.77rem', fontWeight: 800 }}>
                        {g.gender} {g.pct.toFixed(1)}%
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={genderChartData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="age" tick={{ fill: PALETTE.subtext, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: PALETTE.subtext, fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    {genderOrder.map((gender) => (
                      <Bar
                        key={gender}
                        dataKey={gender}
                        stackId="a"
                        fill={genderColor[gender]}
                        radius={gender === 'その他' ? [4, 4, 0, 0] : undefined}
                        maxBarSize={24}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={chartCardSx}>
                <ChartTitle number="3" text="地域分布 - Top Regions" />
                <Stack spacing={1.1}>
                  {regionData.map((region, idx) => {
                    const pct = (region.total / (regionData[0]?.total || 1)) * 100;
                    const isTop = idx === 0;
                    return (
                      <Box key={region.name}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            {isTop && (
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 99,
                                  fontSize: '0.6rem',
                                  background: PALETTE.accent,
                                  color: '#fff',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontWeight: 800,
                                }}
                              >
                                1
                              </Box>
                            )}
                            <Typography sx={{ color: PALETTE.text, fontSize: '0.8rem', fontWeight: 700 }}>{region.name}</Typography>
                          </Stack>
                          <Typography sx={{ color: PALETTE.subtext, fontSize: '0.8rem', fontWeight: 700 }}>
                            {region.total.toLocaleString('ja-JP')}
                          </Typography>
                        </Stack>
                        <Box sx={{ height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                          <Box
                            sx={{
                              height: '100%',
                              borderRadius: 99,
                              width: `${pct}%`,
                              background: isTop
                                ? `linear-gradient(90deg, ${PALETTE.accent}, #818cf8)`
                                : `linear-gradient(90deg, ${PALETTE.accent}aa, ${PALETTE.favorites}aa)`,
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Box sx={{ ...chartCardSx, gridColumn: { xs: '1', lg: '1 / -1' } }}>
                <ChartTitle number="4" text="Engagement Funnel" />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <FunnelChart>
                        <Tooltip content={<DarkTooltip />} />
                        <Funnel dataKey="value" data={funnelData} isAnimationActive>
                          <LabelList
                            position="center"
                            fill="#fff"
                            style={{ fontSize: 13, fontWeight: 800 }}
                            formatter={(value) => Number(value ?? 0).toLocaleString('ja-JP')}
                          />
                          {funnelData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </Box>

                  <Stack spacing={1} sx={{ flex: 1, justifyContent: 'center' }}>
                    {funnelData.map((step, idx) => (
                      <Box
                        key={step.name}
                        sx={{
                          p: '12px 16px',
                          borderRadius: 2,
                          border: `1px solid ${step.fill}44`,
                          background: `${step.fill}12`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: 2, backgroundColor: step.fill }} />
                          <Typography sx={{ color: PALETTE.subtext, fontWeight: 700, fontSize: '0.82rem' }}>{step.name}</Typography>
                        </Stack>
                        <Stack alignItems="flex-end">
                          <Typography sx={{ color: PALETTE.text, fontWeight: 800, fontSize: '1.05rem' }}>
                            {step.value.toLocaleString('ja-JP')}
                          </Typography>
                          {idx > 0 && (
                            <Typography sx={{ color: step.fill, fontWeight: 700, fontSize: '0.72rem' }}>
                              転換率 {(step as any).rate}%
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Section>

          <Section title="フォロワー分析" badge="FAVORITES">
            <Stack spacing={1.8}>
              <Box
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${PALETTE.favorites}55`,
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.18), rgba(31, 88, 68, 0.24))',
                  p: { xs: '14px 16px', md: '16px 20px' },
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between">
                  <Typography sx={{ color: '#e8fff6', fontSize: '0.95rem', fontWeight: 700 }}>
                    拠点アカウント {favoriteBaseAccount?.accountId ?? '-'} に紐づく企業をフォローしているユーザー数
                  </Typography>
                  <Typography sx={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 900 }}>
                    {favoriteTotalCount.toLocaleString('ja-JP')} 人
                  </Typography>
                </Stack>
                <Typography sx={{ color: 'rgba(225, 255, 243, 0.86)', fontSize: '0.82rem', mt: 0.7, fontWeight: 700 }}>
                  最多年代: {favoriteTopAge ? toAgeLabel(favoriteTopAge.age) : '-'}
                </Typography>
                <Typography sx={{ color: 'rgba(225, 255, 243, 0.84)', fontSize: '0.8rem', mt: 0.3, fontWeight: 600 }}>
                  これらのユーザー層は投稿を素早く見つけることができます。
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
                <Box sx={chartCardSx}>
                  <ChartTitle number="A" text="性別分布（お気に入り）" />
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={favoriteGenderData} barCategoryGap="36%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#c8d9ef', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fill: '#c8d9ef', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                        domain={[0, 'auto']}
                        tickFormatter={(v) => formatCountTick(Number(v))}
                      />
                      <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {favoriteGenderData.map((entry) => (
                          <Cell key={entry.name} fill={genderColor[entry.name] ?? PALETTE.accent} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                <Box sx={chartCardSx}>
                  <ChartTitle number="B" text="地域分布（お気に入り）" />
                  <ResponsiveContainer width="100%" height={favoriteRegionChartHeight}>
                    <BarChart data={favoriteRegionData} layout="vertical" margin={{ left: 12, right: 6 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: '#c8d9ef', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 'auto']}
                        tickFormatter={(v) => formatCountTick(Number(v))}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={92}
                        tick={{ fill: '#c8d9ef', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                      <Bar dataKey="total" fill={PALETTE.favorites} radius={[0, 6, 6, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Stack>
          </Section>
        </Stack>
      </Box>
    </Box>
  );
};

const ChartTitle: React.FC<{ number: string; text: string }> = ({ number, text }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: 99,
        background: `${PALETTE.accent}30`,
        border: `1px solid ${PALETTE.accent}66`,
        display: 'grid',
        placeItems: 'center',
        color: PALETTE.accent,
        fontSize: '0.72rem',
        fontWeight: 800,
      }}
    >
      {number}
    </Box>
    <Typography sx={{ color: PALETTE.text, fontWeight: 800, fontSize: '0.9rem' }}>{text}</Typography>
  </Stack>
);

const backBtnSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.7,
  mb: 1.8,
  px: 1.4,
  py: 0.75,
  borderRadius: 2,
  border: `1px solid ${PALETTE.cardBorder}`,
  background: PALETTE.glass,
  backdropFilter: 'blur(12px)',
  color: PALETTE.subtext,
  fontWeight: 700,
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  '&:hover': {
    background: `${PALETTE.accent}18`,
    color: PALETTE.accent,
    borderColor: `${PALETTE.accent}55`,
  },
} as const;

const chartCardSx = {
  borderRadius: 2,
  border: `1px solid ${PALETTE.cardBorder}`,
  background: 'rgba(255,255,255,0.03)',
  p: { xs: '14px', md: '20px' },
} as const;

export default ReportDetailScreen;
