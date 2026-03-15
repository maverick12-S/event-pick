import { z } from 'zod';

// ─── 管理者画面 Zod スキーマ ──────────────────────
// 参照エンティティ: Plan_Coupon, InquiryHistory, Company_Review, AdminUser

/** クーポン作成リクエスト → Plan_Coupon */
export const adminCouponCreateRequestSchema = z.object({
  /** クーポンコード VARCHAR(20) ○ */
  coupon_code: z.string().min(1).max(20),
  /** 対象種別 CHAR(1) ○ 1:企業/2:消費者 */
  target_type: z.enum(['1', '2']),
  /** 割引種別 CHAR(1) ○ 1:金額/2:率 */
  discount_type: z.enum(['1', '2']),
  /** 無料期間日数 INT(3) △ */
  free_days: z.number().int().min(0).max(999).optional(),
});

/** クーポン作成レスポンス */
export const adminCouponCreateResponseSchema = z.object({
  /** クーポンID CHAR(26) ULID */
  coupon_id: z.string().length(26),
});

/** カテゴリー作成リクエスト → EventCategory_c */
export const adminCategoryCreateRequestSchema = z.object({
  /** カテゴリーコード VARCHAR(20) ○ */
  category_code: z.string().min(1).max(20),
  /** カテゴリー名 VARCHAR(20) ○ */
  category_name: z.string().min(1).max(20),
});

/** カテゴリー削除リクエスト */
export const adminCategoryDeleteRequestSchema = z.object({
  /** カテゴリーID CHAR(2) */
  category_id: z.string().min(1).max(2),
});

/** お問い合わせ返信リクエスト → InquiryHistory */
export const adminInquiryReplyRequestSchema = z.object({
  /** 問い合わせID CHAR(26) ○ */
  inquiry_id: z.string().length(26),
  /** 問い合わせ種別 CHAR(1) ○ 1:消費者/2:企業 */
  inquiry_type: z.enum(['1', '2']),
  /** 対応状態 CHAR(1) ○ */
  inquiry_status: z.enum(['1', '2', '3']),
  /** 返信内容 TEXT(1500) ○ */
  message: z.string().min(1).max(1500),
  /** 担当運営ユーザーID CHAR(26) */
  admin_user_id: z.string().length(26),
});

/** お問い合わせクローズリクエスト */
export const adminInquiryCloseRequestSchema = z.object({
  inquiry_id: z.string().length(26),
  /** 対応状態 = 3:完了 固定 */
  inquiry_status: z.literal('3'),
});

/** 審査承認リクエスト → Company_Review */
export const adminReviewApproveRequestSchema = z.object({
  /** 審査ID CHAR(26) ○ */
  review_id: z.string().length(26),
  /** 企業ID CHAR(26) ○ */
  company_id: z.string().length(26),
  /** 審査ステータス = 2:承認 固定 */
  review_status: z.literal('2'),
  /** 審査担当者ID CHAR(26) */
  reviewer_id: z.string().length(26),
});

/** 審査却下/差戻しリクエスト → Company_Review */
export const adminReviewRejectRequestSchema = z.object({
  review_id: z.string().length(26),
  company_id: z.string().length(26),
  /** 審査ステータス CHAR(1) 3:差戻し/4:却下 */
  review_status: z.enum(['3', '4']),
  /** 差戻理由 VARCHAR(200) ○ (差戻し時必須) */
  review_comment: z.string().min(1).max(200),
  reviewer_id: z.string().length(26),
});

/** 消費者サスペンドリクエスト */
export const adminConsumerSuspendRequestSchema = z.object({
  /** ユーザーID CHAR(26) */
  userId: z.string().min(1),
});

/** 消費者削除スケジュールリクエスト */
export const adminConsumerDeleteScheduleRequestSchema = z.object({
  userId: z.string().min(1),
  /** 削除予定日 DATE(10) */
  deleteScheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** 拠点アカウントサスペンドリクエスト */
export const adminLocationAccountSuspendRequestSchema = z.object({
  companyId: z.string().min(1),
});

/** 拠点アカウント削除スケジュールリクエスト */
export const adminLocationAccountDeleteScheduleRequestSchema = z.object({
  companyId: z.string().min(1),
  deleteScheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** 管理者設定更新リクエスト → AdminUser + サイト設定 */
export const adminSettingsUpdateRequestSchema = z.object({
  account: z.object({
    /** 表示名 VARCHAR(40) */
    displayName: z.string().min(1).max(40),
    username: z.string().min(1).max(40),
    /** メール VARCHAR(80) */
    email: z.string().email().max(80),
    /** 電話番号 VARCHAR(15) */
    phone: z.string().max(15).optional(),
  }),
  password: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  }).refine(d => d.newPassword === d.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  }).optional(),
  site: z.object({
    siteName: z.string().min(1).max(80),
    siteUrl: z.string().url().max(255),
    adminEmail: z.string().email().max(128),
    supportEmail: z.string().email().max(128),
    timezone: z.enum(['Asia/Tokyo', 'UTC', 'America/New_York']),
    language: z.enum(['ja', 'en']),
    description: z.string().max(500).optional(),
  }),
  notifications: z.object({
    emailNewReview: z.boolean(),
    emailNewInquiry: z.boolean(),
    emailDailyReport: z.boolean(),
    emailWeeklyReport: z.boolean(),
  }),
  security: z.object({
    twoFactorRequired: z.boolean(),
    sessionTimeoutMin: z.number().int().min(1).max(1440),
    maxLoginAttempts: z.number().int().min(1).max(100),
    passwordMinLength: z.number().int().min(6).max(128),
    ipWhitelist: z.string().max(1000).optional(),
  }),
});

/** 管理者ユーザー検索パラメータ */
export const adminUsersParamsSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(['', 'active', 'suspended', 'pending']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});

/** 認証ログ検索パラメータ */
export const adminAuthLogsParamsSchema = z.object({
  status: z.enum(['', 'success', 'failure', 'timeout']).optional(),
  method: z.enum(['', 'cookie', 'token']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});

/** アクティビティログ検索パラメータ */
export const adminActivityLogsParamsSchema = z.object({
  category: z.enum(['', '審査', 'アカウント', 'クーポン', 'カテゴリ', 'お問い合わせ', '設定', 'システム']).optional(),
  date: z.string().optional(),
  search: z.string().max(200).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});
