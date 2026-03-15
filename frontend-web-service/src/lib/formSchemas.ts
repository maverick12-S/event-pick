/**
 * formSchemas.ts — フォーム画面用 Zod バリデーションスキーマ
 * ───────────────────────────────────────────────
 * UI フォームのフィールド名 (camelCase) に合わせたスキーマ。
 * safeString / safeEmail で禁止文字チェックを統合。
 *
 * ※ API DTO 用スキーマ (types/schemas/) とは別管理。
 *   API スキーマは snake_case で DB 物理名に準拠。
 */

import { z } from 'zod';
import { safeString, safeEmail } from './sanitize';

/** パスワード強度バリデーション — 8文字以上・大文字・小文字・数字・記号を各1つ以上含む */
const strongPassword = (label = 'パスワード') =>
  z.string()
    .min(8, `${label}は8文字以上で入力してください`)
    .max(128)
    .regex(/[A-Z]/, `${label}に大文字(A-Z)を1文字以上含めてください`)
    .regex(/[a-z]/, `${label}に小文字(a-z)を1文字以上含めてください`)
    .regex(/[0-9]/, `${label}に数字(0-9)を1文字以上含めてください`)
    .regex(/[^A-Za-z0-9]/, `${label}に記号(!@#$%等)を1文字以上含めてください`);

// ─── Auth ────────────────────────────────────────

/** ログインフォーム */
export const loginFormSchema = z.object({
  realm: safeString({ min: 1 }),
  username: safeString({ min: 1 }),
  /** パスワードは特殊文字を許可（ハッシュ化されるため） */
  password: z.string().min(1, 'パスワードを入力してください'),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;

/** サインアップフォーム */
export const signupFormSchema = z.object({
  corporateCode: safeString({ min: 1, max: 16 }),
  companyName: safeString({ min: 1, max: 80 }),
  representative: safeString({ min: 1, max: 40 }),
  notifyEmail: safeEmail({ max: 128 }),
});
export type SignupFormData = z.infer<typeof signupFormSchema>;

/** パスワードリセットフォーム */
export const passwordResetFormSchema = z.object({
  email: safeEmail({ max: 128 }),
});
export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

/** パスワード変更フォーム */
export const passwordChangeFormSchema = z.object({
  password: strongPassword(),
  confirm: z.string().min(1, '確認用パスワードを入力してください'),
}).refine((d) => d.password === d.confirm, {
  message: 'パスワードが一致しません',
  path: ['confirm'],
});
export type PasswordChangeFormData = z.infer<typeof passwordChangeFormSchema>;

/** MFA 認証フォーム */
export const mfaFormSchema = z.object({
  code: z.string().length(6, '認証コードは6桁で入力してください').regex(/^\d{6}$/, '数字6桁で入力してください'),
});
export type MfaFormData = z.infer<typeof mfaFormSchema>;

// ─── Account ─────────────────────────────────────

/** 拠点アカウント払出フォーム */
export const accountIssueFormSchema = z.object({
  baseName: safeString({ min: 1, max: 40 }),
  displayName: safeString({ max: 40 }),
  address: safeString({ min: 1, max: 60 }),
  initialPassword: strongPassword('初期パスワード'),
  plan: z.enum(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン']),
  couponCode: z.string().max(20).optional(),
});
export type AccountIssueFormData = z.infer<typeof accountIssueFormSchema>;

/** 拠点アカウント編集フォーム */
export const accountEditFormSchema = z.object({
  baseName: safeString({ min: 1, max: 40 }),
  address: safeString({ min: 1, max: 60 }),
  email: safeEmail({ max: 80 }),
  /** 空文字 or 未入力は許可、入力時はパスワードポリシー適用 */
  password: z.union([z.literal(''), strongPassword()]).optional(),
  plan: z.enum(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン']),
  couponCode: z.string().max(20).optional(),
  paymentInfo: z.string().optional(),
  status: z.enum(['利用中', '停止中', '削除予定']),
});
export type AccountEditFormData = z.infer<typeof accountEditFormSchema>;

// ─── Settings ────────────────────────────────────

/** 設定 > アカウント情報変更フォーム（AccountEditFormSchema と同一構造） */
export const settingsAccountFormSchema = accountEditFormSchema;
export type SettingsAccountFormData = AccountEditFormData;

/** 設定 > 請求先情報変更フォーム */
export const billingEditFormSchema = z.object({
  name: safeString({ min: 1, max: 80 }),
  email: safeEmail({ max: 128 }),
  country: safeString({ min: 1, max: 20 }),
  postalCode: safeString({ min: 1, max: 10 }),
  prefecture: safeString({ min: 1, max: 10 }),
  city: safeString({ min: 1, max: 30 }),
  address1: safeString({ min: 1, max: 60 }),
  address2: z.string().max(60).optional(),
  phoneCountry: z.string().max(5).optional(),
  phoneNumber: z.string().max(15).optional(),
});
export type BillingEditFormData = z.infer<typeof billingEditFormSchema>;

/** 設定 > お問い合わせフォーム */
export const contactFormSchema = z.object({
  subject: safeString({ min: 1, max: 100 }),
  category: z.string().optional(),
  message: safeString({ min: 1, max: 1500 }),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;

// ─── Plan ────────────────────────────────────────

/** クーポン適用フォーム */
export const couponFormSchema = z.object({
  couponCode: safeString({ min: 1, max: 20 }),
});
export type CouponFormData = z.infer<typeof couponFormSchema>;

// ─── Posts ───────────────────────────────────────

/** 投稿作成・予約投稿編集フォーム（PostFormData に対応） */
export const postFormSchema = z.object({
  title: safeString({ min: 1, max: 100 }),
  summary: safeString({ min: 1, max: 400 }),
  detail: safeString({ max: 1200 }),
  reservation: z.string().max(200).optional(),
  address: safeString({ max: 100 }),
  venueName: safeString({ max: 60 }),
  budget: z.string().max(30).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  category: safeString({ min: 1 }),
});
export type PostFormSchemaData = z.infer<typeof postFormSchema>;

/** 投稿詳細の予約編集フォーム（PostDetailScreenB） */
export const postDetailEditFormSchema = z.object({
  title: safeString({ min: 1, max: 100 }),
  category: safeString({ min: 1 }),
  ward: safeString({ max: 60 }),
  venue: safeString({ max: 60 }),
  description: safeString({ max: 400 }),
  timeLabel: z.string().max(20).optional(),
  nextPostDate: z.string().optional(),
});
export type PostDetailEditFormData = z.infer<typeof postDetailEditFormSchema>;

// ─── Admin ───────────────────────────────────────

/** 管理者アカウント設定フォーム */
export const adminAccountFormSchema = z.object({
  displayName: safeString({ min: 1, max: 40 }),
  username: safeString({ min: 1, max: 40 }),
  email: safeEmail({ max: 128 }),
  phone: safeString({ max: 20 }),
});
export type AdminAccountFormData = z.infer<typeof adminAccountFormSchema>;

/** 管理者パスワード変更フォーム */
export const adminPasswordFormSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  nextPassword: strongPassword('新しいパスワード'),
  confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
}).refine((d) => d.nextPassword === d.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});
export type AdminPasswordFormData = z.infer<typeof adminPasswordFormSchema>;

/** サイト基本設定フォーム */
export const adminSiteFormSchema = z.object({
  siteName: safeString({ min: 1, max: 60 }),
  siteUrl: z.string().url('有効なURLを入力してください').max(200),
  adminEmail: safeEmail({ max: 128 }),
  supportEmail: safeEmail({ max: 128 }),
  timezone: z.string().min(1),
  language: z.string().min(1),
  description: safeString({ max: 300 }),
});
export type AdminSiteFormData = z.infer<typeof adminSiteFormSchema>;

/** セキュリティ設定フォーム */
export const adminSecurityFormSchema = z.object({
  sessionTimeoutMin: z.number().int().min(5, '5分以上で設定してください').max(1440),
  maxLoginAttempts: z.number().int().min(1).max(100),
  passwordMinLength: z.number().int().min(6).max(128),
  ipWhitelist: z.string().max(500).optional(),
});
export type AdminSecurityFormData = z.infer<typeof adminSecurityFormSchema>;

/** クーポン生成フォーム（Admin） */
export const adminCouponGenerateFormSchema = z.object({
  code: safeString({ min: 1, max: 20 }),
  type: z.enum(['percent', 'fixed']),
  discount: z.string().min(1, '割引値を入力してください'),
  maxUses: z.string().min(1, '利用上限数を入力してください'),
  expiresAt: z.string().min(1, '有効期限を入力してください'),
});
export type AdminCouponGenerateFormData = z.infer<typeof adminCouponGenerateFormSchema>;

/** カテゴリ追加フォーム（Admin） */
export const adminCategoryAddFormSchema = z.object({
  name: safeString({ min: 1, max: 30 }),
});
export type AdminCategoryAddFormData = z.infer<typeof adminCategoryAddFormSchema>;

/** 問い合わせ返信フォーム（Admin） */
export const adminInquiryReplyFormSchema = z.object({
  replyText: safeString({ min: 1, max: 2000 }),
});
export type AdminInquiryReplyFormData = z.infer<typeof adminInquiryReplyFormSchema>;

/** 審査却下理由フォーム（Admin） */
export const adminReviewRejectFormSchema = z.object({
  rejectReason: safeString({ min: 1, max: 1000 }),
});
export type AdminReviewRejectFormData = z.infer<typeof adminReviewRejectFormSchema>;
