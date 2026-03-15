import { z } from 'zod';

// ─── 既存: UI モデル用 (画面表示値) ───────────────

/** アカウントステータス (UI表示) */
export const accountStatusSchema = z.enum(['利用中', '停止中', '削除予定']);

/** 契約プラン (UI表示) */
export const contractPlanSchema = z.enum(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン']);

/** 拠点アカウント (UI表示モデル) */
export const baseAccountItemSchema = z.object({
  id: z.string().min(1),
  companyCode: z.string().min(1),
  baseName: z.string().min(1),
  accountId: z.string().min(1),
  status: accountStatusSchema,
  plan: contractPlanSchema,
  scheduledDeletionAt: z.string().optional(),
});

// ─── 新規: オブジェクト定義準拠 (API DTO バリデーション) ──

/** Company_Account ステータス CHAR(1) */
const companyAccountStatusSchema = z.enum(['1', '2']);

/** Company_Role ID CHAR(2) */
const companyRoleIdSchema = z.enum(['01', '02', '03']);

/** アカウント払出リクエスト → Company_Account 新規作成 */
export const accountIssueRequestSchema = z.object({
  /** 拠点名 VARCHAR(40) ○ */
  branch_name: z.string().min(1).max(40),
  /** 拠点名(表示用) VARCHAR(40) △ */
  branch_display_name: z.string().max(40).optional(),
  /** 郵便番号 CHAR(7) △ ハイフンなし */
  postal_code: z.string().length(7, '郵便番号は7桁で入力してください').regex(/^\d{7}$/, '郵便番号は数字7桁で入力してください').optional(),
  /** 都道府県コード CHAR(2) ○ JIS */
  prefecture_code: z.string().length(2, '都道府県コードは2桁で入力してください'),
  /** 市区町村 VARCHAR(30) ○ */
  city: z.string().min(1, '市区町村を入力してください').max(30, '30文字以内で入力してください'),
  /** 住所詳細 VARCHAR(60) △ */
  address_line: z.string().max(60, '60文字以内で入力してください').optional(),
  /** メールアドレス VARCHAR(80) △ */
  contact_email: z.string().email('有効なメールアドレスを入力してください').max(80, '80文字以内で入力してください').optional(),
  /** 電話番号 VARCHAR(15) △ */
  phone_number: z.string().max(15, '15文字以内で入力してください').optional(),
  /** 初期パスワード ○ */
  initial_password: z.string().min(8, '8文字以上で入力してください').max(128, '128文字以内で入力してください'),
  /** プランコード VARCHAR(20) ○ */
  plan_code: z.string().min(1, 'プランコードを入力してください').max(20, '20文字以内で入力してください'),
  /** クーポンコード VARCHAR(20) △ */
  coupon_code: z.string().max(20, '20文字以内で入力してください').optional(),
  /** 企業ロールID CHAR(2) ○ */
  company_role_id: companyRoleIdSchema,
});

/** アカウント払出レスポンス */
export const accountIssueResponseSchema = z.object({
  /** UUID(36) */
  company_account_id: z.string().min(1),
  /** VARCHAR(10) */
  branch_code: z.string().min(1).max(10),
});

/** アカウント更新リクエスト → Company_Account 更新 */
export const accountUpdateRequestSchema = z.object({
  branch_name: z.string().min(1, '拠点名を入力してください').max(40, '40文字以内で入力してください'),
  /** 拠点名(表示用) VARCHAR(40) △ */
  branch_display_name: z.string().max(40, '40文字以内で入力してください').optional(),
  /** 郵便番号 CHAR(7) △ ハイフンなし */
  postal_code: z.string().length(7, '郵便番号は7桁で入力してください').regex(/^\d{7}$/, '郵便番号は数字7桁で入力してください').optional(),
  /** 都道府県コード CHAR(2) ○ JIS */
  prefecture_code: z.string().length(2, '都道府県コードは2桁で入力してください'),
  /** 市区町村 VARCHAR(30) ○ */
  city: z.string().min(1, '市区町村を入力してください').max(30, '30文字以内で入力してください'),
  /** 住所詳細 VARCHAR(60) △ */
  address_line: z.string().max(60, '60文字以内で入力してください').optional(),
  /** メールアドレス VARCHAR(80) △ */
  contact_email: z.string().email('有効なメールアドレスを入力してください').max(80, '80文字以内で入力してください').optional(),
  /** 電話番号 VARCHAR(15) △ */
  phone_number: z.string().max(15, '15文字以内で入力してください').optional(),
  password: z.string().min(8, '8文字以上で入力してください').max(128, '128文字以内で入力してください').optional(),
  plan_code: z.string().max(20, '20文字以内で入力してください').optional(),
  coupon_code: z.string().max(20, '20文字以内で入力してください').optional(),
  /** ステータス CHAR(1) ○ */
  status: companyAccountStatusSchema,
});

/** アカウント削除リクエスト */
export const accountDeleteRequestSchema = z.object({
  company_account_id: z.string().min(1),
});

/** アカウント削除取消リクエスト */
export const accountCancelDeletionRequestSchema = z.object({
  company_account_id: z.string().min(1),
});

/** アカウント一覧パラメータ */
export const accountListParamsSchema = z.object({
  query: z.string().max(100, '100文字以内で入力してください').optional(),
  sortBy: z.enum(['baseName', 'plan', 'status']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});

/** アカウント詳細レスポンス → Company_Account */
export const accountDetailResponseSchema = z.object({
  company_account_id: z.string().min(1),
  branch_code: z.string().max(10),
  branch_name: z.string().max(40),
  branch_display_name: z.string().max(40).optional(),
  postal_code: z.string().length(7).optional(),
  prefecture_code: z.string().length(2),
  city: z.string().max(30),
  address_line: z.string().max(60).optional(),
  contact_email: z.string().max(80).optional(),
  phone_number: z.string().max(15).optional(),
  plan_code: z.string().max(20),
  coupon_code: z.string().max(20).optional(),
  status: companyAccountStatusSchema,
  company_role_id: companyRoleIdSchema,
});
