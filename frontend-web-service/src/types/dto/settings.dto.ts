/**
 * 設定系 DTO 型定義
 *
 * 対応画面:
 *  - SettingsAccountScreen        → SettingsAccountUpdateRequest
 *  - SettingsBillingEditScreen    → BillingAddressUpdateRequest
 *  - SettingsBillingScreen        → BillingDataResponse
 *  - SettingsNotificationsScreen  → NotificationSettingsPayload
 *  - SettingsContactScreen        → ContactInquiryRequest
 *  - SettingsHistoryScreen        → ExecutionHistoryListParams
 *
 * エンティティ準拠: Company_Account, Company_Billing, Company_Notification,
 *                   InquiryHistory, Company_Execution_History
 */

import type { BillingAddress, BillingData } from '../models/billing';
import type { ExecutionHistoryCategory, ExecutionHistoryItem } from '../models/executionHistory';
import type { CompanyAccountStatus, CompanyNotificationType } from '../entities';

// ─── アカウント設定更新 (SettingsAccountScreen) ───

/**
 * アカウント設定更新リクエスト PUT /company-accounts/me
 * → Company_Account エンティティ準拠
 */
export interface SettingsAccountUpdateRequest {
  /** 拠点名 — Company_Account.branch_name VARCHAR(40) */
  branch_name: string;
  /** 拠点名（表示用） — Company_Account.branch_display_name VARCHAR(40) */
  branch_display_name?: string;
  /** 郵便番号 — Company_Account.postal_code CHAR(7) */
  postal_code?: string;
  /** 都道府県コード — Company_Account.prefecture_code CHAR(2) */
  prefecture_code: string;
  /** 市区町村 — Company_Account.city VARCHAR(30) */
  city: string;
  /** 住所詳細 — Company_Account.address_line VARCHAR(60) */
  address_line?: string;
  /** メールアドレス — Company_Account.contact_email VARCHAR(80) */
  contact_email?: string;
  /** 電話番号 — Company_Account.phone_number VARCHAR(15) */
  phone_number?: string;
  /** パスワード (変更時のみ) */
  password?: string;
  /** 企業プランコード — Company_Plan.plan_code VARCHAR(20) */
  plan_code?: string;
  /** クーポンコード — Plan_Coupon.coupon_code VARCHAR(20) */
  coupon_code?: string;
  /** ステータス — Company_Account.status CHAR(1) */
  status: CompanyAccountStatus;
}

/** アカウント設定更新レスポンス */
export interface SettingsAccountUpdateResponse {
  /** 更新成功 */
  updated: boolean;
}

// ─── 請求先住所更新 (SettingsBillingEditScreen) ───

/** 請求先住所更新リクエスト PUT /billing/address */
export type BillingAddressUpdateRequest = BillingAddress;

/** 請求先住所更新レスポンス */
export interface BillingAddressUpdateResponse {
  /** 更新成功 */
  updated: boolean;
}

// ─── 請求情報取得 (SettingsBillingScreen) ─────────

/** 請求情報レスポンス GET /billing */
export type BillingDataResponse = BillingData;

// ─── 通知設定 (SettingsNotificationsScreen) ───────

/**
 * 通知設定 (SettingsNotificationsScreen)
 * → Company_Notification エンティティ準拠
 */

/** 通知設定項目（1行分） */
export interface NotificationSettingItem {
  /** 実行機能コード — Company_Notification.function_code VARCHAR(20) */
  function_code: string;
  /** 通知有効フラグ — Company_Notification.is_enabled BOOLEAN */
  is_enabled: boolean;
  /** 通知種別 — Company_Notification.notification_type CHAR(1) */
  notification_type: CompanyNotificationType;
}

/** 通知設定ペイロード PUT /company-accounts/me/notifications */
export type NotificationSettingsPayload = NotificationSettingItem[];

/** 通知設定レスポンス GET /company-accounts/me/notifications */
export interface NotificationSettingsResponse {
  settings: NotificationSettingsPayload;
}

// ─── お問い合わせ (SettingsContactScreen) ──────────

/** お問い合わせカテゴリ */
export type ContactCategory =
  | 'アカウント'
  | '投稿機能'
  | '請求・決済'
  | '通知'
  | '不具合報告'
  | 'その他';

/**
 * お問い合わせリクエスト POST /inquiries
 * → InquiryHistory エンティティ準拠
 */
export interface ContactInquiryRequest {
  /** 件名 — InquiryHistory.subject VARCHAR(100) */
  subject: string;
  /** 内容 — InquiryHistory.message TEXT(1500) */
  message: string;
}

/** お問い合わせレスポンス */
export interface ContactInquiryResponse {
  /** お問い合わせID — InquiryHistory.inquiry_id CHAR(26) */
  inquiry_id: string;
  submitted: boolean;
}

// ─── 実行履歴 (SettingsHistoryScreen) ─────────────

/** 実行履歴パラメータ GET /audit-logs */
export interface ExecutionHistoryListParams {
  /** テキスト検索 (タイトル・内容・実行者) */
  search?: string;
  /** 日付フィルタ (YYYY-MM-DD) */
  date?: string;
  /** カテゴリフィルタ */
  category?: ExecutionHistoryCategory | 'all';
}

/** 実行履歴レスポンス */
export interface ExecutionHistoryListResponse {
  items: ExecutionHistoryItem[];
}
