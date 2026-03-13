/** レポート詳細の型定義 */

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
