/**
 * 管理者 (Admin) 系 DTO 型定義
 *
 * 対応画面:
 *  - AdminDashboardScreen         → AdminDashboardResponse / AdminTrendParams
 *  - AdminConsumersScreen         → AdminConsumersParams / Suspend / DeleteSchedule
 *  - AdminLocationAccountsScreen  → AdminLocationAccountsParams / Suspend / DeleteSchedule
 *  - AdminUsersScreen             → AdminUsersParams
 *  - AdminCouponsScreen           → AdminCouponCreateRequest
 *  - AdminCategoriesScreen        → AdminCategoryCreateRequest
 *  - AdminInquiriesScreen         → AdminInquiryReplyRequest / AdminInquiryCloseRequest
 *  - AdminReviewsScreen           → AdminReviewApproveRequest / AdminReviewRejectRequest
 *  - AdminSettingsScreen          → AdminSettingsUpdateRequest
 *  - AdminAuthLogsScreen          → AdminAuthLogsParams
 *  - AdminActivityLogScreen       → AdminActivityLogsParams
 */

import type {
  AdminStats,
  TrendDataPoint,
  TrendPeriod,
  ConsumerAccount,
  LocationAccount,
  AuthLog,
} from '../../features/admin/types/admin';
import type { PaginatedResponse, PaginationParams } from './common';
import type {
  CouponTargetType,
  CouponDiscountType,
  InquiryType,
  InquiryStatus,
  ReviewStatus,
} from '../entities';

// ─── ダッシュボード (AdminDashboardScreen) ────────

/** ダッシュボードレスポンス GET /admin/reports/overview */
export interface AdminDashboardResponse {
  stats: AdminStats;
}

/** トレンドパラメータ GET /admin/reports/trend */
export interface AdminTrendParams {
  period: TrendPeriod;
}

/** トレンドレスポンス */
export interface AdminTrendResponse {
  items: TrendDataPoint[];
}

// ─── 消費者管理 (AdminConsumersScreen) ────────────

/** 消費者一覧パラメータ GET /admin/users?type=consumer */
export interface AdminConsumersParams extends PaginationParams {
  /** フリーテキスト検索 (名前・ユーザー名・メール・電話番号) */
  search?: string;
}

/** 消費者一覧レスポンス */
export interface AdminConsumersResponse extends PaginatedResponse<ConsumerAccount> {}

/** 消費者アカウント停止リクエスト POST /admin/users/:id/suspend */
export interface AdminConsumerSuspendRequest {
  /** 対象ユーザーID */
  userId: string;
}

/** 消費者削除予定設定リクエスト POST /admin/users/:id/schedule-delete */
export interface AdminConsumerDeleteScheduleRequest {
  /** 対象ユーザーID */
  userId: string;
  /** 削除予定日 (YYYY-MM-DD) */
  deleteScheduledAt: string;
}

// ─── 拠点アカウント管理 (AdminLocationAccountsScreen) ──

/** 拠点アカウント一覧パラメータ GET /admin/companies */
export interface AdminLocationAccountsParams extends PaginationParams {
  /** フリーテキスト検索 (法人名・拠点名・担当者名・メール・電話番号) */
  search?: string;
}

/** 拠点アカウント一覧レスポンス */
export interface AdminLocationAccountsResponse extends PaginatedResponse<LocationAccount> {}

/** 拠点アカウント停止リクエスト POST /admin/companies/:id/suspend */
export interface AdminLocationAccountSuspendRequest {
  /** 対象企業ID */
  companyId: string;
}

/** 拠点アカウント削除予定設定リクエスト POST /admin/companies/:id/schedule-delete */
export interface AdminLocationAccountDeleteScheduleRequest {
  /** 対象企業ID */
  companyId: string;
  /** 削除予定日 (YYYY-MM-DD) */
  deleteScheduledAt: string;
}

// ─── ユーザー管理 (AdminUsersScreen) ──────────────

/** ユーザーステータスフィルタ */
export type AdminUserStatusFilter = '' | 'active' | 'suspended' | 'pending';

/** ユーザー一覧パラメータ GET /admin/users */
export interface AdminUsersParams extends PaginationParams {
  /** 検索テキスト (ユーザー名・メール) */
  search?: string;
  /** ステータスフィルタ */
  status?: AdminUserStatusFilter;
}

/** ユーザー一覧レスポンス */
export interface AdminUsersResponse extends PaginatedResponse<import('../../features/admin/types/admin').AdminUser> {}

// ─── クーポン管理 (AdminCouponsScreen) ────────────
// CouponDiscountType, CouponTargetType は entities/enums から import

/**
 * クーポン作成リクエスト POST /admin/coupons
 * → Plan_Coupon エンティティ準拠
 */
export interface AdminCouponCreateRequest {
  /** クーポンコード — VARCHAR(20) */
  coupon_code: string;
  /** 対象種別 — CHAR(1) 1:企業/2:消費者 */
  target_type: CouponTargetType;
  /** 割引種別 — CHAR(1) 1:金額/2:率 */
  discount_type: CouponDiscountType;
  /** 無料期間日数 — INT(3) */
  free_days?: number;
}

/** クーポン作成レスポンス */
export interface AdminCouponCreateResponse {
  /** 作成されたクーポンID — CHAR(26) ULID */
  coupon_id: string;
}

// ─── カテゴリ管理 (AdminCategoriesScreen) ─────────

/** カテゴリ作成リクエスト POST /admin/categories → EventCategory_c */
export interface AdminCategoryCreateRequest {
  /** カテゴリコード — EventCategory_c.category_code VARCHAR(20) */
  category_code: string;
  /** カテゴリ名 — EventCategory_c.category_name VARCHAR(20) */
  category_name: string;
}

/** カテゴリ削除リクエスト DELETE /admin/categories/:id → EventCategory_c */
export interface AdminCategoryDeleteRequest {
  /** 対象カテゴリID — EventCategory_c.category_id CHAR(2) */
  category_id: string;
}

// ─── お問い合わせ管理 (AdminInquiriesScreen) ──────
// InquiryType, InquiryStatus は entities/enums から import

/**
 * お問い合わせ返信リクエスト POST /admin/inquiries/:id/reply
 * → InquiryHistory エンティティ準拠
 */
export interface AdminInquiryReplyRequest {
  /** 問い合わせID — CHAR(26) */
  inquiry_id: string;
  /** 問い合わせ種別 — CHAR(1) */
  inquiry_type: InquiryType;
  /** 対応状態更新 — CHAR(1) */
  inquiry_status: InquiryStatus;
  /** 返信内容 — TEXT(1500) */
  message: string;
  /** 担当運営ユーザーID — CHAR(26) */
  admin_user_id: string;
}

/** お問い合わせ完了リクエスト POST /admin/inquiries/:id/close */
export interface AdminInquiryCloseRequest {
  /** 問い合わせID — CHAR(26) */
  inquiry_id: string;
  /** 完了状態: '3' 固定 */
  inquiry_status: Extract<InquiryStatus, '3'>;
}

// ─── 審査管理 (AdminReviewsScreen) ────────────────
// ReviewType, ReviewStatus は entities/enums から import

/**
 * 審査承認リクエスト POST /admin/companies/:id/review
 * → Company_Review エンティティ準拠
 */
export interface AdminReviewApproveRequest {
  /** 審査ID — CHAR(26) */
  review_id: string;
  /** 企業ID — CHAR(26) */
  company_id: string;
  /** 審査ステータス: '2'(承認) 固定 */
  review_status: Extract<ReviewStatus, '2'>;
  /** 審査担当者ID — CHAR(26) */
  reviewer_id: string;
}

/**
 * 審査却下/差戻しリクエスト POST /admin/companies/:id/review
 * → Company_Review エンティティ準拠
 */
export interface AdminReviewRejectRequest {
  /** 審査ID — CHAR(26) */
  review_id: string;
  /** 企業ID — CHAR(26) */
  company_id: string;
  /** 審査ステータス: '3'(差戻し) or '4'(却下) */
  review_status: Extract<ReviewStatus, '3' | '4'>;
  /** 差戻理由 — VARCHAR(200) */
  review_comment: string;
  /** 審査担当者ID — CHAR(26) */
  reviewer_id: string;
}

// ─── 管理者設定 (AdminSettingsScreen) ─────────────

/** 運営アカウント設定 */
export interface OperatorAccountSettings {
  /** 表示名 */
  displayName: string;
  /** ユーザー名 */
  username: string;
  /** メールアドレス */
  email: string;
  /** 電話番号 (任意) */
  phone?: string;
}

/** パスワード変更設定 */
export interface OperatorPasswordSettings {
  /** 現在のパスワード */
  currentPassword: string;
  /** 新しいパスワード */
  newPassword: string;
  /** 新しいパスワード (確認) */
  confirmPassword: string;
}

/** サイト基本設定 */
export interface SiteSettings {
  /** サイト名 */
  siteName: string;
  /** サイトURL */
  siteUrl: string;
  /** 管理者メール */
  adminEmail: string;
  /** サポートメール */
  supportEmail: string;
  /** タイムゾーン */
  timezone: 'Asia/Tokyo' | 'UTC' | 'America/New_York';
  /** 言語 */
  language: 'ja' | 'en';
  /** サイト説明 (任意) */
  description?: string;
}

/** メール通知設定 */
export interface AdminNotificationSettings {
  /** 新規審査申請通知 */
  emailNewReview: boolean;
  /** 新規お問い合わせ通知 */
  emailNewInquiry: boolean;
  /** デイリーレポート */
  emailDailyReport: boolean;
  /** ウィークリーレポート */
  emailWeeklyReport: boolean;
}

/** セキュリティ設定 */
export interface SecuritySettings {
  /** 二要素認証の必須化 */
  twoFactorRequired: boolean;
  /** セッションタイムアウト (分) */
  sessionTimeoutMin: number;
  /** 最大ログイン試行回数 */
  maxLoginAttempts: number;
  /** パスワード最小文字数 */
  passwordMinLength: number;
  /** IPホワイトリスト (カンマ区切り) */
  ipWhitelist?: string;
}

/** 管理者設定一括更新リクエスト PUT /admin/settings */
export interface AdminSettingsUpdateRequest {
  account: OperatorAccountSettings;
  password?: OperatorPasswordSettings;
  site: SiteSettings;
  notifications: AdminNotificationSettings;
  security: SecuritySettings;
}

// ─── 認証ログ (AdminAuthLogsScreen) ──────────────

/** 認証ログステータスフィルタ */
export type AuthLogStatusFilter = '' | 'success' | 'failure' | 'timeout';

/** 認証方式フィルタ */
export type AuthMethodFilter = '' | 'cookie' | 'token';

/** 認証ログパラメータ GET /admin/audit-logs/auth */
export interface AdminAuthLogsParams extends PaginationParams {
  /** ステータスフィルタ */
  status?: AuthLogStatusFilter;
  /** 認証方式フィルタ */
  method?: AuthMethodFilter;
}

/** 認証ログレスポンス */
export interface AdminAuthLogsResponse extends PaginatedResponse<AuthLog> {}

// ─── アクティビティログ (AdminActivityLogScreen) ──

/** アクティビティカテゴリ */
export type AdminActivityCategory =
  | '審査' | 'アカウント' | 'クーポン'
  | 'カテゴリ' | 'お問い合わせ' | '設定' | 'システム';

/** アクティビティログアイテム */
export interface AdminActivityLogItem {
  id: string;
  /** 実行日時 */
  createdAt: string;
  /** カテゴリ */
  category: AdminActivityCategory;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;
  /** 実行者名 */
  actor: string;
}

/** アクティビティログパラメータ GET /admin/audit-logs/activity */
export interface AdminActivityLogsParams extends PaginationParams {
  /** カテゴリフィルタ */
  category?: AdminActivityCategory | '';
  /** 日付フィルタ (YYYY-MM-DD) */
  date?: string;
  /** テキスト検索 */
  search?: string;
}

/** アクティビティログレスポンス */
export interface AdminActivityLogsResponse extends PaginatedResponse<AdminActivityLogItem> {}
