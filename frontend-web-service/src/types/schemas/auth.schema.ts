import { z } from 'zod';

// ─── 既存: Cognito ログイン (UI モデル) ───────────────

/** ログインリクエスト */
export const loginRequestSchema = z.object({
  realm: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

/** ログインレスポンス */
export const loginResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_expires_in: z.number(),
  refresh_token: z.string(),
  token_type: z.string(),
  session_state: z.string(),
  scope: z.string(),
});

/** 認証ユーザー */
export const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  realm: z.string(),
  displayName: z.string().optional(),
});

// ─── 新規: オブジェクト定義準拠 ───────────────────

/** 企業サインアップ → Company + Auth_Credential */
export const signupRequestSchema = z.object({
  /** 法人コード VARCHAR(16) */
  company_code: z.string().min(1).max(16),
  /** 企業名 VARCHAR(80) */
  company_name: z.string().min(1).max(80),
  /** 代表者名 VARCHAR(40) */
  representative_name: z.string().min(1).max(40),
  /** 企業種別 CHAR(1) 1:法人/2:個人事業 */
  company_type: z.enum(['1', '2']),
  /** 管理用メール VARCHAR(128) */
  admin_email: z.string().email().max(128),
  /** 管理用電話番号 VARCHAR(15) △ */
  admin_phone: z.string().max(15).optional(),
  /** ログイン種別 CHAR(1) 1:email/2:phone/3:google/4:line */
  login_type: z.enum(['1', '2', '3', '4']),
});

/** サインアップレスポンス */
export const signupResponseSchema = z.object({
  /** 審査ID CHAR(26) ULID */
  review_id: z.string().length(26),
  /** MFA送信先 */
  mfa_destination: z.string(),
});

/** パスワードリセット要求 */
export const passwordResetRequestSchema = z.object({
  /** メールアドレス VARCHAR(128) */
  email: z.string().email().max(128),
});

/** パスワードリセットレスポンス */
export const passwordResetResponseSchema = z.object({
  sent: z.boolean(),
});

/** パスワード変更要求 */
export const passwordChangeRequestSchema = z.object({
  token: z.string().min(1),
  /** 新パスワード */
  new_password: z.string().min(8).max(128)
    .regex(/[A-Z]/, '大文字(A-Z)を1文字以上含めてください')
    .regex(/[a-z]/, '小文字(a-z)を1文字以上含めてください')
    .regex(/[0-9]/, '数字(0-9)を1文字以上含めてください')
    .regex(/[^A-Za-z0-9]/, '記号を1文字以上含めてください'),
});

/** パスワード変更レスポンス */
export const passwordChangeResponseSchema = z.object({
  changed: z.boolean(),
});

/** MFA検証要求 */
export const mfaVerifyRequestSchema = z.object({
  /** 6桁コード */
  code: z.string().length(6),
  /** 用途 */
  purpose: z.enum(['signup', 'password-reset', 'login']),
  /** セッショントークン */
  session_token: z.string().min(1),
});

/** MFA検証レスポンス */
export const mfaVerifyResponseSchema = z.object({
  verified: z.boolean(),
  token: z.string().optional(),
});
