import { z } from 'zod';

// ─── 設定画面 Zod スキーマ ──────────────────────
// 参照エンティティ: Company_Account, Company_Notification, InquiryHistory, Company_Billing

/** 設定アカウント更新リクエスト → Company_Account 更新 */
export const settingsAccountUpdateRequestSchema = z.object({
  /** 拠点名 VARCHAR(40) ○ */
  branch_name: z.string().min(1).max(40),
  /** 拠点名(表示用) VARCHAR(40) △ */
  branch_display_name: z.string().max(40).optional(),
  /** 郵便番号 CHAR(7) △ ハイフンなし */
  postal_code: z.string().length(7).regex(/^\d{7}$/).optional(),
  /** 都道府県コード CHAR(2) ○ */
  prefecture_code: z.string().length(2),
  /** 市区町村 VARCHAR(30) ○ */
  city: z.string().min(1).max(30),
  /** 住所詳細 VARCHAR(60) △ */
  address_line: z.string().max(60).optional(),
  /** メールアドレス VARCHAR(80) △ */
  contact_email: z.string().email().max(80).optional(),
  /** 電話番号 VARCHAR(15) △ */
  phone_number: z.string().max(15).optional(),
  /** パスワード変更 △ */
  password: z.string().min(8).max(128).optional(),
  /** プランコード VARCHAR(20) △ */
  plan_code: z.string().max(20).optional(),
  /** クーポンコード VARCHAR(20) △ */
  coupon_code: z.string().max(20).optional(),
  /** ステータス CHAR(1) ○ */
  status: z.enum(['1', '2']),
});

/** 請求先住所更新リクエスト — 既存UIモデル(BillingAddress) */
export const billingAddressUpdateRequestSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(128),
  country: z.string().min(1).max(20),
  postalCode: z.string().min(1).max(10),
  prefecture: z.string().min(1).max(10),
  city: z.string().min(1).max(30),
  address1: z.string().min(1).max(60),
  address2: z.string().max(60),
  phoneCountry: z.string().max(5),
  phoneNumber: z.string().max(15),
});

/** 通知設定項目 → Company_Notification */
export const notificationSettingItemSchema = z.object({
  /** 実行機能コード VARCHAR(20) ○ */
  function_code: z.string().min(1).max(20),
  /** 通知有効フラグ ○ */
  is_enabled: z.boolean(),
  /** 通知種別 CHAR(1) ○ 1:メール/2:Push/3:両方 */
  notification_type: z.enum(['1', '2', '3']),
});

/** 通知設定ペイロード (配列) */
export const notificationSettingsPayloadSchema = z.array(notificationSettingItemSchema);

/** お問い合わせリクエスト → InquiryHistory */
export const contactInquiryRequestSchema = z.object({
  /** 件名 VARCHAR(100) ○ */
  subject: z.string().min(1).max(100),
  /** 内容 TEXT(1500) ○ */
  message: z.string().min(1).max(1500),
});

/** お問い合わせレスポンス */
export const contactInquiryResponseSchema = z.object({
  /** 問い合わせID CHAR(26) */
  inquiry_id: z.string().length(26),
  submitted: z.boolean(),
});

/** 実行履歴検索パラメータ → Company_Execution_History */
export const executionHistoryListParamsSchema = z.object({
  search: z.string().max(200).optional(),
  date: z.string().optional(),
  category: z.enum(['投稿', 'アカウント払出', '情報変更', '削除', '削除予定', 'all']).optional(),
});
