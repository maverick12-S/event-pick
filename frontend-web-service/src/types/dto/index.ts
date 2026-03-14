/**
 * types/dto — API通信用 DTO (Data Transfer Object) 型定義の集約エクスポート
 *
 * 各画面のフォーム入力 → API送信ペイロード (Request)、
 * API応答 → 画面表示データ (Response) を網羅的に定義する。
 *
 * 用途:
 *  - バックエンド DTO 設計の仕様書として
 *  - フロントエンド ↔ バックエンド間の型契約として
 *  - テスト用モックデータのスキーマとして
 */

// ── 共通 ──
export type {
  ApiResponse,
  ApiErrorPayload,
  PaginatedResponse,
  PaginationParams,
} from './common';

// ── 認証 ──
export type {
  SignupRequest,
  SignupResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  MfaVerifyRequest,
  MfaVerifyResponse,
  AuthMeResponse,
  RefreshTokenResponse,
} from './auth.dto';

// ── 投稿管理 ──
export type {
  PostCreateRequest,
  PostCreateResponse,
  PostSearchParams,
  PostSearchResponse,
  PostDetailEditRequest,
  ScheduledPostCreateRequest,
  ScheduledPostUpdateRequest,
  ScheduledPostUpdateResponse,
  ScheduledPostListParams,
  ScheduledPostListResponse,
  PostDraftListResponse,
  PostPreviewPayload,
} from './post.dto';

// ── アカウント管理 ──
export type {
  AccountIssueRequest,
  AccountIssueResponse,
  AccountUpdateRequest,
  AccountUpdateResponse,
  AccountDeleteRequest,
  AccountDeleteResponse,
  AccountCancelDeletionRequest,
  AccountCancelDeletionResponse,
  AccountListParams,
  AccountListResponse,
  AccountDetailResponse,
} from './account.dto';

// ── レポート ──
export type {
  ReportListParams,
  ReportListResponse,
  ReportDetailParams,
  ReportDetailResponse,
  ReportSummaryParams,
  ReportSummaryResponse,
} from './report.dto';

// ── 設定 ──
export type {
  SettingsAccountUpdateRequest,
  SettingsAccountUpdateResponse,
  BillingAddressUpdateRequest,
  BillingAddressUpdateResponse,
  BillingDataResponse,
  NotificationSettingItem,
  NotificationSettingsPayload,
  NotificationSettingsResponse,
  ContactInquiryRequest,
  ContactInquiryResponse,
  ExecutionHistoryListParams,
  ExecutionHistoryListResponse,
} from './settings.dto';

// ── プラン ──
export type {
  PlanSelectRequest,
  PlanSelectResponse,
  CouponApplyRequest,
  CouponApplyResponse,
} from './plan.dto';

// ── 管理者 (Admin) ──
export type {
  AdminDashboardResponse,
  AdminTrendParams,
  AdminTrendResponse,
  AdminConsumersParams,
  AdminConsumersResponse,
  AdminConsumerSuspendRequest,
  AdminConsumerDeleteScheduleRequest,
  AdminLocationAccountsParams,
  AdminLocationAccountsResponse,
  AdminLocationAccountSuspendRequest,
  AdminLocationAccountDeleteScheduleRequest,
  AdminUsersParams,
  AdminUsersResponse,
  AdminCouponCreateRequest,
  AdminCouponCreateResponse,
  AdminCategoryCreateRequest,
  AdminCategoryDeleteRequest,
  AdminInquiryReplyRequest,
  AdminInquiryCloseRequest,
  AdminReviewApproveRequest,
  AdminReviewRejectRequest,
  AdminSettingsUpdateRequest,
  AdminAuthLogsParams,
  AdminAuthLogsResponse,
  AdminActivityLogsParams,
  AdminActivityLogsResponse,
} from './admin.dto';

// ── 承諾ログ ──
export type {
  AgreementType,
  AgreementLogCreateRequest,
  AgreementLogCreateResponse,
} from './agreement.dto';
