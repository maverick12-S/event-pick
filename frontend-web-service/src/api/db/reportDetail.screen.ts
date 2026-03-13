import { reportRowsDb, type ReportListItem } from './reports.screen';
import { toFourByFiveUnsplash } from './mockImages';

export type ReportMetricKey = 'views' | 'likes' | 'favorites';

export interface DemographicRow {
  gender: string;
  values: number[];
}

export interface DemographicAccountBlock {
  accountId: string;
  rows: DemographicRow[];
}

export interface ReportDetailItem {
  id: string;
  accountId: string;
  title: string;
  summary: string;
  postedAt: string;
  postedTimeRange: string;
  location: string;
  tags: string[];
  overview: string;
  images: string[];
  views: number;
  likes: number;
  favoritesCount: number;
  trendLabels: string[];
  trendValues: {
    views: number[];
    likes: number[];
    favorites: number[];
  };
  demographics: {
    ageBins: string[];
    views: DemographicAccountBlock[];
    likes: DemographicAccountBlock[];
    favorites: DemographicAccountBlock[];
  };
}

const ageBins = Array.from({ length: 17 }, (_, index) => {
  const start = index * 5;
  const end = start + 4;
  return `${start}-${end}`;
}).concat('85以上');

const imagePool = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80',
].map((url) => toFourByFiveUnsplash(url, 1400));

const buildValues = (base: number, seed: number) =>
  ageBins.map((_, index) => {
    const wave = Math.sin((index + seed) / 2.2) * 8;
    const trend = index < 6 ? index * 4 : (12 - index) * 2.8;
    return Math.max(0, Math.round(base + trend + wave + seed));
  });

const buildRows = (seed: number): DemographicRow[] => [
  { gender: '男性', values: buildValues(22, seed + 1) },
  { gender: '女性', values: buildValues(26, seed + 2) },
  { gender: 'その他', values: buildValues(4, Math.floor(seed / 3)) },
];

const buildAccounts = (baseAccountId: string, seed: number): DemographicAccountBlock[] => {
  const sibling = baseAccountId === 'TOKYO-001' ? 'TOKYO-002' : 'TOKYO-001';

  return [
    { accountId: baseAccountId, rows: buildRows(seed) },
    { accountId: sibling, rows: buildRows(seed + 6) },
    { accountId: 'KANAGAWA-101', rows: buildRows(seed + 12) },
  ];
};

const toDetail = (row: ReportListItem, index: number): ReportDetailItem => {
  const seed = index * 4;
  return {
    id: row.id,
    accountId: row.accountId,
    title: row.title,
    summary: row.summary,
    postedAt: row.postedAt,
    postedTimeRange: '15:00-18:00',
    location: `${row.accountId} / 渋谷区神南1-2-3`,
    tags: ['Italian', 'Formal', 'Networking'],
    overview:
      '投稿の反応を確認し、次回企画の精度を上げるための分析用レポートです。時間帯、導線、クリエイティブ訴求の観点で改善ポイントを把握できます。',
    images: [
      imagePool[index % imagePool.length],
      imagePool[(index + 1) % imagePool.length],
      imagePool[(index + 2) % imagePool.length],
      imagePool[(index + 3) % imagePool.length],
    ],
    views: row.views,
    likes: row.likes,
    favoritesCount: Math.max(12, Math.floor(row.likes * 0.38)),
    trendLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    trendValues: {
      views: [40, 62, 95, 224, 108, Math.min(260, Math.max(130, Math.floor(row.views / 11)))],
      likes: [8, 14, 21, 54, 29, Math.min(86, Math.max(25, Math.floor(row.likes / 4)))],
      favorites: [3, 6, 10, 21, 12, Math.max(8, Math.floor(row.likes * 0.1))],
    },
    demographics: {
      ageBins,
      views: buildAccounts(row.accountId, seed + 2),
      likes: buildAccounts(row.accountId, seed + 1),
      favorites: buildAccounts(row.accountId, seed),
    },
  };
};

export const reportDetailDb: ReportDetailItem[] = reportRowsDb.map((row, index) => toDetail(row, index));
