/**
 * レポート系 DTO 型定義
 *
 * 対応画面:
 *  - ReportScreen       → ReportListParams / ReportListResponse
 *  - ReportDetailScreen → ReportDetailParams / ReportDetailResponse
 */

import type { ReportSortKey, ReportListItem } from '../models/report';
import type { ReportDetailItem } from '../models/reportDetail';
import type { ReportAggregateSummary } from '../models/reportSummary';
import type { PaginatedResponse, PaginationParams } from './common';

// ─── レポート一覧 (ReportScreen) ──────────────────

/** レポート一覧パラメータ GET /reports/search */
export interface ReportListParams extends PaginationParams {
  /** 開始日 (YYYY-MM-DD) */
  from: string;
  /** 終了日 (YYYY-MM-DD) */
  to: string;
  /** 拠点アカウントIDフィルタ (親拠点の場合) */
  accountId?: string;
  /** ソート順 */
  sortBy?: ReportSortKey;
}

/** レポート一覧レスポンス */
export interface ReportListResponse extends PaginatedResponse<ReportListItem> {
  /** 集計サマリー */
  summary: ReportAggregateSummary;
}

// ─── レポート詳細 (ReportDetailScreen) ────────────

/** レポート詳細パラメータ GET /reports/:accountId/:eventId */
export interface ReportDetailParams {
  /** レポートID (URL パラメータ) */
  reportId: string;
}

/** レポート詳細レスポンス */
export interface ReportDetailResponse {
  item: ReportDetailItem;
}

// ─── レポートサマリー (API集計) ──────────────────

/** レポートサマリーパラメータ GET /reports/summary */
export interface ReportSummaryParams {
  /** 開始日 */
  from: string;
  /** 終了日 */
  to: string;
  /** 拠点アカウントID */
  companyAccountId?: string;
  /** 集計単位 */
  groupBy?: 'day' | 'week' | 'month';
  /** メトリクス一覧 */
  metrics?: string[];
}

/** レポートサマリーレスポンス */
export interface ReportSummaryResponse {
  period: { from: string; to: string };
  totalViews: number;
  totalFavorites: number;
  totalClicks: number;
  chartData: Array<Record<string, unknown>>;
  topEvents: Array<Record<string, unknown>>;
}
