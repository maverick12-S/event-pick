/**
 * レポート API サービス
 * ─────────────────────────────────────────────
 * 画面: ReportScreen, ReportDetailScreen
 * DTO: report.dto.ts — Zod: report.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  reportListParamsSchema,
  reportDetailParamsSchema,
  reportSummaryParamsSchema,
} from '../../types/schemas';
import type {
  ReportListParams, ReportListResponse,
  ReportDetailParams, ReportDetailResponse,
  ReportSummaryParams, ReportSummaryResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const reportApi = {
  /** レポート一覧 GET /reports/search */
  list: async (params: ReportListParams): Promise<ReportListResponse> => {
    const validated = reportListParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<ReportListResponse>>(
      endpoints.reportsSearch,
      { params: validated },
    );
    return unwrap(res);
  },

  /** レポート詳細 GET /reports/:accountId/:eventId */
  detail: async (params: ReportDetailParams): Promise<ReportDetailResponse> => {
    const validated = reportDetailParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<ReportDetailResponse>>(
      endpoints.reportByAccount(validated.reportId),
    );
    return unwrap(res);
  },

  /** レポートサマリー GET /reports/summary */
  summary: async (params: ReportSummaryParams): Promise<ReportSummaryResponse> => {
    const validated = reportSummaryParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<ReportSummaryResponse>>(
      endpoints.reportsSummary,
      { params: validated },
    );
    return unwrap(res);
  },
};
