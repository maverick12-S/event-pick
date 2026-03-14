/**
 * transforms.ts — フォームデータ → API DTO 変換
 * ───────────────────────────────────────────────
 * UI フォーム (camelCase) → API リクエスト (snake_case) の
 * 型安全な変換関数を提供する。
 *
 * バリデーション済みの formSchemas 型を受け取り、
 * API DTO スキーマ (types/schemas/) と互換のオブジェクトを返す。
 */

import type { z } from 'zod';
import type { signupRequestSchema, passwordChangeRequestSchema, mfaVerifyRequestSchema } from '../types/schemas/auth.schema';
import type { accountIssueRequestSchema, accountUpdateRequestSchema } from '../types/schemas/account.schema';
import type { contactInquiryRequestSchema } from '../types/schemas/settings.schema';
import type { couponApplyRequestSchema, planSelectRequestSchema } from '../types/schemas/plan.schema';
import type {
  SignupFormData,
  PasswordChangeFormData,
  MfaFormData,
  AccountIssueFormData,
  AccountEditFormData,
  ContactFormData,
  CouponFormData,
} from './formSchemas';

// ─── 型エイリアス (API DTO) ──────────────────────
type SignupRequest = z.infer<typeof signupRequestSchema>;
type PasswordChangeRequest = z.infer<typeof passwordChangeRequestSchema>;
type MfaVerifyRequest = z.infer<typeof mfaVerifyRequestSchema>;
type AccountIssueRequest = z.infer<typeof accountIssueRequestSchema>;
type AccountUpdateRequest = z.infer<typeof accountUpdateRequestSchema>;
type ContactInquiryRequest = z.infer<typeof contactInquiryRequestSchema>;
type CouponApplyRequest = z.infer<typeof couponApplyRequestSchema>;
type PlanSelectRequest = z.infer<typeof planSelectRequestSchema>;

// ─── プランコード変換マップ ──────────────────────
const PLAN_CODE_MAP: Record<string, string> = {
  'ライトプラン': 'LIGHT',
  'スタンダードプラン': 'STANDARD',
  'プレミアムプラン': 'PREMIUM',
};

const STATUS_CODE_MAP: Record<string, '1' | '2'> = {
  '利用中': '1',
  '停止中': '2',
};

// ─── Auth ────────────────────────────────────────

/** サインアップフォーム → SignupRequest DTO */
export const toSignupRequest = (form: SignupFormData): SignupRequest => ({
  company_code: form.corporateCode,
  company_name: form.companyName,
  representative_name: form.representative,
  company_type: '1',
  admin_email: form.notifyEmail,
  login_type: '1',
});

/** パスワード変更フォーム → PasswordChangeRequest DTO */
export const toPasswordChangeRequest = (
  form: PasswordChangeFormData,
  token: string,
): PasswordChangeRequest => ({
  token,
  new_password: form.password,
});

/** MFA フォーム → MfaVerifyRequest DTO */
export const toMfaVerifyRequest = (
  form: MfaFormData,
  purpose: 'signup' | 'password-reset' | 'login',
  sessionToken: string,
): MfaVerifyRequest => ({
  code: form.code,
  purpose,
  session_token: sessionToken,
});

// ─── Account ─────────────────────────────────────

/** 拠点アカウント払出フォーム → AccountIssueRequest DTO */
export const toAccountIssueRequest = (form: AccountIssueFormData): AccountIssueRequest => ({
  branch_name: form.baseName,
  branch_display_name: form.displayName || undefined,
  prefecture_code: '13',
  city: '',
  address_line: form.address,
  initial_password: form.initialPassword,
  plan_code: PLAN_CODE_MAP[form.plan] ?? 'LIGHT',
  coupon_code: form.couponCode || undefined,
  company_role_id: '02',
});

/** 拠点アカウント編集フォーム → AccountUpdateRequest DTO */
export const toAccountUpdateRequest = (form: AccountEditFormData): AccountUpdateRequest => ({
  branch_name: form.baseName,
  prefecture_code: '13',
  city: '',
  address_line: form.address,
  contact_email: form.email || undefined,
  password: form.password || undefined,
  plan_code: PLAN_CODE_MAP[form.plan] ?? undefined,
  coupon_code: form.couponCode || undefined,
  status: STATUS_CODE_MAP[form.status] ?? '1',
});

// ─── Settings ────────────────────────────────────

/** お問い合わせフォーム → ContactInquiryRequest DTO */
export const toContactInquiryRequest = (form: ContactFormData): ContactInquiryRequest => ({
  subject: form.subject,
  message: form.message,
});

// ─── Plan ────────────────────────────────────────

/** クーポンフォーム → CouponApplyRequest DTO */
export const toCouponApplyRequest = (form: CouponFormData): CouponApplyRequest => ({
  coupon_code: form.couponCode,
});

/** プラン選択 → PlanSelectRequest DTO */
export const toPlanSelectRequest = (planId: string): PlanSelectRequest => ({
  plan_code: planId.toUpperCase() as 'LIGHT' | 'STANDARD' | 'PREMIUM',
});
