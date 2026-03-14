/**
 * 共通 API レスポンス・ページネーション型
 *
 * 全エンドポイントで使い回す汎用ラッパー。
 * バックエンドの共通レスポンス形式と対応する。
 */

/** API エラーペイロード */
export interface ApiErrorPayload {
  code: string;
  message: string;
  details: string[];
}

/** 全 API 共通レスポンスラッパー */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
  timestamp: string;
}

/** ページネーションパラメータ (リクエスト側) */
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

/** ページネーション付きレスポンスラッパー */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasNext: boolean;
}
