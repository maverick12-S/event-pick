import { apiClient } from './http';
import endpoints from './endpoints';

// 共通レスポンスラッパー
export interface CommonResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ErrorPayload | null;
  timestamp: string;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details: string[];
}

export interface Paging {
  limit: number;
  hasNext: boolean;
  nextCursor?: string | null;
}

export interface EventItem {
  post_id: string;
  title: string;
  description?: string;
  event_date?: string; // YYYY-MM-DD — EventPost_c.event_date DATE(10)
  status?: string; // CHAR(1) 1:公開前/2:公開中/3:終了
}

export interface PaginatedEvents {
  items: EventItem[];
  pagination: Paging;
}

export interface ReportChartDataPoint {
  date: string;
  views: number;
  favorites: number;
  clicks: number;
}

export interface ReportTopEvent {
  post_id: string;
  title: string;
  views: number;
  favorites: number;
  clicks: number;
}

export interface ReportSummary {
  period: { from: string; to: string };
  total_views: number;
  total_favorites: number;
  total_clicks: number;
  chart_data: ReportChartDataPoint[];
  top_events: ReportTopEvent[];
}

export interface TicketTransaction {
  history_id: string;
  operation_type: '1' | '2' | '3' | '4'; // CHAR(1) 1:購入/2:消費/3:返金/4:期限切れ
  amount: number;
  balance: number;
  related_post_id?: string;
  event_title?: string; // joined display field
  created_at: string;
}

export interface TicketHistoryResponse {
  transactions: TicketTransaction[];
  total: number;
}

export interface MediaUploadResponse {
  media_id: string;
  media_url: string;
  thumbnail_url: string;
  file_size: number;
  width: number;
  height: number;
}

export interface PresignedUrlResponse {
  presigned_url: string;
  upload_url: string;
  expires_in: number;
  file_key: string;
  fields?: Record<string, string>;
}

export interface NotificationItem {
  notification_id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_url?: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  total: number;
  unread_count: number;
}

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
  expires_at: string;
}

class ApiError extends Error {
  code: string;
  details: string[];
  constructor(message: string, code: string, details: string[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export type { ApiError };

const unwrap = async <T>(p: Promise<{ data: CommonResponse<T> }>): Promise<T> => {
  const res = await p;
  const body = res.data;
  if (!body || body.success === false) {
    const code = body?.error?.code || 'E0000';
    const msg = body?.error?.message || 'API error';
    throw new ApiError(msg, code, body?.error?.details || []);
  }
  return body.data as T;
};

export const openapiClient = {
  // GET /events
  getEvents: (params?: Record<string, unknown>) =>
    unwrap<PaginatedEvents>(apiClient.get(endpoints.events, { params })),

  // GET /reports/summary
  getReportSummary: (params: { from: string; to: string; companyAccountId?: string; groupBy?: 'day' | 'week' | 'month'; metrics?: string[] }) =>
    unwrap<ReportSummary>(apiClient.get(endpoints.reportsSummary, { params })),

  // GET /tickets/history
  getTicketHistory: (params?: Record<string, unknown>) =>
    unwrap<TicketHistoryResponse>(apiClient.get(endpoints.tickets, { params })),

  // POST /events/{eventId}/media
  uploadEventMedia: (eventId: string, file: File, caption?: string, displayOrder?: number) => {
    const form = new FormData();
    form.append('file', file);
    if (caption) form.append('caption', caption);
    if (displayOrder !== undefined) form.append('displayOrder', String(displayOrder));
    return unwrap<MediaUploadResponse>(apiClient.post(endpoints.eventMedia(eventId), form, { headers: { 'Content-Type': 'multipart/form-data' } }));
  },

  // POST /uploads/presigned-url
  createPresignedUrl: (payload: { fileName: string; fileType: string; fileSize: number }) =>
    unwrap<PresignedUrlResponse>(apiClient.post(endpoints.uploadsPresignedUrl, payload)),

  // GET /notifications
  getNotifications: (params?: Record<string, unknown>) =>
    unwrap<NotificationsResponse>(apiClient.get(endpoints.notifications, { params })),

  // POST /billing/checkout-session
  createCheckoutSession: (payload: { productType: 'PLAN' | 'TICKET'; productId: string; quantity: number; successUrl: string; cancelUrl: string }) =>
    unwrap<CheckoutSessionResponse>(apiClient.post(endpoints.billingCheckoutSession, payload)),
};

export default openapiClient;
