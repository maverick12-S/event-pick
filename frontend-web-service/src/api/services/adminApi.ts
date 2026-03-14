/**
 * 管理者 API サービス
 * ─────────────────────────────────────────────
 * 画面: AdminDashboardScreen, AdminConsumersScreen, AdminLocationAccountsScreen,
 *       AdminUsersScreen, AdminCouponsScreen, AdminCategoriesScreen,
 *       AdminInquiriesScreen, AdminReviewsScreen, AdminAuthLogsScreen,
 *       AdminActivityLogScreen, AdminSettingsScreen
 * DTO: admin.dto.ts — Zod: admin.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  adminCouponCreateRequestSchema,
  adminCouponCreateResponseSchema,
  adminCategoryCreateRequestSchema,
  adminCategoryDeleteRequestSchema,
  adminInquiryReplyRequestSchema,
  adminInquiryCloseRequestSchema,
  adminReviewApproveRequestSchema,
  adminReviewRejectRequestSchema,
  adminConsumerSuspendRequestSchema,
  adminConsumerDeleteScheduleRequestSchema,
  adminLocationAccountSuspendRequestSchema,
  adminLocationAccountDeleteScheduleRequestSchema,
  adminSettingsUpdateRequestSchema,
  adminUsersParamsSchema,
  adminAuthLogsParamsSchema,
  adminActivityLogsParamsSchema,
} from '../../types/schemas';
import type {
  AdminDashboardResponse, AdminTrendParams, AdminTrendResponse,
  AdminConsumersParams, AdminConsumersResponse,
  AdminConsumerSuspendRequest, AdminConsumerDeleteScheduleRequest,
  AdminLocationAccountsParams, AdminLocationAccountsResponse,
  AdminLocationAccountSuspendRequest, AdminLocationAccountDeleteScheduleRequest,
  AdminUsersParams, AdminUsersResponse,
  AdminCouponCreateRequest, AdminCouponCreateResponse,
  AdminCategoryCreateRequest, AdminCategoryDeleteRequest,
  AdminInquiryReplyRequest, AdminInquiryCloseRequest,
  AdminReviewApproveRequest, AdminReviewRejectRequest,
  AdminSettingsUpdateRequest,
  AdminAuthLogsParams, AdminAuthLogsResponse,
  AdminActivityLogsParams, AdminActivityLogsResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const adminApi = {
  // ─── ダッシュボード ───
  /** GET /admin/reports/overview */
  dashboard: async (): Promise<AdminDashboardResponse> => {
    const res = await apiClient.get<ApiResponse<AdminDashboardResponse>>(endpoints.admin.reportsOverview);
    return unwrap(res);
  },

  /** GET /admin/reports/overview?period=xxx */
  trend: async (params: AdminTrendParams): Promise<AdminTrendResponse> => {
    const res = await apiClient.get<ApiResponse<AdminTrendResponse>>(
      endpoints.admin.reportsOverview,
      { params },
    );
    return unwrap(res);
  },

  // ─── 消費者管理 ───
  /** GET /admin/consumers */
  listConsumers: async (params: AdminConsumersParams): Promise<AdminConsumersResponse> => {
    const res = await apiClient.get<ApiResponse<AdminConsumersResponse>>(
      endpoints.adminConsumers,
      { params },
    );
    return unwrap(res);
  },

  /** POST /admin/consumers/:userId/suspend */
  suspendConsumer: async (req: AdminConsumerSuspendRequest): Promise<void> => {
    const validated = adminConsumerSuspendRequestSchema.parse(req);
    await apiClient.post(endpoints.adminConsumerSuspend(validated.userId));
  },

  /** POST /admin/consumers/:userId/delete-schedule */
  deleteScheduleConsumer: async (req: AdminConsumerDeleteScheduleRequest): Promise<void> => {
    const validated = adminConsumerDeleteScheduleRequestSchema.parse(req);
    await apiClient.post(
      endpoints.adminConsumerDeleteSchedule(validated.userId),
      { deleteScheduledAt: validated.deleteScheduledAt },
    );
  },

  // ─── 拠点アカウント管理 ───
  /** GET /admin/location-accounts */
  listLocationAccounts: async (params: AdminLocationAccountsParams): Promise<AdminLocationAccountsResponse> => {
    const res = await apiClient.get<ApiResponse<AdminLocationAccountsResponse>>(
      endpoints.adminLocationAccounts,
      { params },
    );
    return unwrap(res);
  },

  /** POST /admin/location-accounts/:companyId/suspend */
  suspendLocationAccount: async (req: AdminLocationAccountSuspendRequest): Promise<void> => {
    const validated = adminLocationAccountSuspendRequestSchema.parse(req);
    await apiClient.post(endpoints.adminLocationAccountSuspend(validated.companyId));
  },

  /** POST /admin/location-accounts/:companyId/delete-schedule */
  deleteScheduleLocationAccount: async (req: AdminLocationAccountDeleteScheduleRequest): Promise<void> => {
    const validated = adminLocationAccountDeleteScheduleRequestSchema.parse(req);
    await apiClient.post(
      endpoints.adminLocationAccountDeleteSchedule(validated.companyId),
      { deleteScheduledAt: validated.deleteScheduledAt },
    );
  },

  // ─── 運営ユーザー管理 ───
  /** GET /admin/users */
  listUsers: async (params: AdminUsersParams): Promise<AdminUsersResponse> => {
    const validated = adminUsersParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<AdminUsersResponse>>(
      endpoints.admin.users,
      { params: validated },
    );
    return unwrap(res);
  },

  // ─── クーポン ───
  /** POST /admin/coupons */
  createCoupon: async (req: AdminCouponCreateRequest): Promise<AdminCouponCreateResponse> => {
    const validated = adminCouponCreateRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<AdminCouponCreateResponse>>(
      endpoints.admin.coupons,
      validated,
    );
    return adminCouponCreateResponseSchema.parse(unwrap(res));
  },

  // ─── カテゴリー ───
  /** POST /admin/categories */
  createCategory: async (req: AdminCategoryCreateRequest): Promise<void> => {
    const validated = adminCategoryCreateRequestSchema.parse(req);
    await apiClient.post(endpoints.admin.categories, validated);
  },

  /** DELETE /admin/categories/:id */
  deleteCategory: async (req: AdminCategoryDeleteRequest): Promise<void> => {
    const validated = adminCategoryDeleteRequestSchema.parse(req);
    await apiClient.delete(endpoints.admin.category(validated.categoryId));
  },

  // ─── お問い合わせ ───
  /** POST /admin/inquiries/:id/reply */
  replyInquiry: async (req: AdminInquiryReplyRequest): Promise<void> => {
    const validated = adminInquiryReplyRequestSchema.parse(req);
    await apiClient.post(
      endpoints.admin.inquiryReply(validated.inquiry_id),
      validated,
    );
  },

  /** POST /admin/inquiries/:id/close */
  closeInquiry: async (req: AdminInquiryCloseRequest): Promise<void> => {
    const validated = adminInquiryCloseRequestSchema.parse(req);
    await apiClient.post(
      endpoints.admin.inquiryClose(validated.inquiry_id),
      validated,
    );
  },

  // ─── 審査 ───
  /** POST /admin/reviews/:id/approve */
  approveReview: async (req: AdminReviewApproveRequest): Promise<void> => {
    const validated = adminReviewApproveRequestSchema.parse(req);
    await apiClient.post(
      endpoints.adminReviewApprove(validated.review_id),
      validated,
    );
  },

  /** POST /admin/reviews/:id/reject */
  rejectReview: async (req: AdminReviewRejectRequest): Promise<void> => {
    const validated = adminReviewRejectRequestSchema.parse(req);
    await apiClient.post(
      endpoints.adminReviewReject(validated.review_id),
      validated,
    );
  },

  // ─── 設定 ───
  /** PUT /admin/settings */
  updateSettings: async (req: AdminSettingsUpdateRequest): Promise<void> => {
    const validated = adminSettingsUpdateRequestSchema.parse(req);
    await apiClient.put(endpoints.adminSettings, validated);
  },

  // ─── ログ ───
  /** GET /admin/auth-logs */
  listAuthLogs: async (params: AdminAuthLogsParams): Promise<AdminAuthLogsResponse> => {
    const validated = adminAuthLogsParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<AdminAuthLogsResponse>>(
      endpoints.adminAuthLogs,
      { params: validated },
    );
    return unwrap(res);
  },

  /** GET /admin/activity-logs */
  listActivityLogs: async (params: AdminActivityLogsParams): Promise<AdminActivityLogsResponse> => {
    const validated = adminActivityLogsParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<AdminActivityLogsResponse>>(
      endpoints.adminActivityLogs,
      { params: validated },
    );
    return unwrap(res);
  },
};
