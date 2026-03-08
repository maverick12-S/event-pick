export type ReportSortKey = 'postedAtDesc' | 'postedAtAsc' | 'viewsDesc' | 'likesDesc' | 'titleAsc';

export interface ReportListItem {
  id: string;
  accountId: string;
  title: string;
  summary: string;
  postedAt: string;
  views: number;
  likes: number;
  detailPath: string;
}

export const reportRowsDb: ReportListItem[] = [
  {
    id: 'today-1',
    accountId: 'TOKYO-001',
    title: '新春イベント',
    summary: '年始のイベント報告会。',
    postedAt: '2026-01-10',
    views: 2450,
    likes: 320,
    detailPath: '/report/today-1',
  },
  {
    id: 'today-2',
    accountId: 'TOKYO-002',
    title: 'ワークショップ開催',
    summary: '地域貢献イベントの実施。',
    postedAt: '2026-01-22',
    views: 1890,
    likes: 215,
    detailPath: '/report/today-2',
  },
  {
    id: 'tomorrow-3',
    accountId: 'KANAGAWA-101',
    title: '春祭り計画',
    summary: '来月の祭り準備会議。',
    postedAt: '2026-02-01',
    views: 1200,
    likes: 150,
    detailPath: '/report/tomorrow-3',
  },
  {
    id: 'tomorrow-4',
    accountId: 'TOKYO-001',
    title: 'オンラインセミナー',
    summary: '最新技術の紹介。',
    postedAt: '2026-02-05',
    views: 3500,
    likes: 480,
    detailPath: '/report/tomorrow-4',
  },
  {
    id: 'scheduled-5',
    accountId: 'CHIBA-220',
    title: '社内研修会',
    summary: 'スキルアップ講座。',
    postedAt: '2026-02-12',
    views: 900,
    likes: 95,
    detailPath: '/report/scheduled-5',
  },
  {
    id: 'scheduled-6',
    accountId: 'TOKYO-002',
    title: 'バレンタイン企画',
    summary: '感謝祭の報告。',
    postedAt: '2026-02-15',
    views: 2100,
    likes: 285,
    detailPath: '/report/scheduled-6',
  },
];
