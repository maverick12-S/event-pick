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
  id: string;
  title: string;
  description?: string;
  eventDate?: string; // YYYY-MM-DD
  status?: string;
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
  eventId: string;
  title: string;
  views: number;
  favorites: number;
  clicks: number;
}

export interface ReportSummary {
  period: { from: string; to: string };
  totalViews: number;
  totalFavorites: number;
  totalClicks: number;
  chartData: ReportChartDataPoint[];
  topEvents: ReportTopEvent[];
}

export interface TicketTransaction {
  transactionId: string;
  type: 'PURCHASE' | 'CONSUME' | 'REFUND' | 'EXPIRE';
  amount: number;
  balance: number;
  eventId?: string;
  eventTitle?: string;
  createdAt: string;
}

export interface TicketHistoryResponse {
  transactions: TicketTransaction[];
  total: number;
}

export interface MediaUploadResponse {
  mediaId: string;
  mediaUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  width: number;
  height: number;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  uploadUrl: string;
  expiresIn: number;
  fileKey: string;
  fields?: Record<string, string>;
}

export interface NotificationItem {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedUrl?: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  total: number;
  unreadCount: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  expiresAt: string;
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
