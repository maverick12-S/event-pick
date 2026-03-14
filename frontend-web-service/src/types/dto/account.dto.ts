/**
 * アカウント管理 DTO 型定義
 *
 * 対応画面:
 *  - AccountsIssueScreen → AccountIssueRequest
 *  - AccountsEditScreen  → AccountUpdateRequest
 *  - AccountsListScreen  → AccountListParams / AccountListResponse
 *  - SettingsAccountScreen → (AccountUpdateRequest と共通)
 *
 * エンティティ準拠: Company_Account, Company_Subscription, Company_Plan
 */

import type {
  BaseAccountItem,
} from '../models/account';
import type { AccountsSortKey } from '../models/accountQuery';
import type { PaginationParams } from './common';
import type { CompanyAccountStatus, CompanyRoleId } from '../entities';

// ─── アカウント発行 (AccountsIssueScreen) ─────────

/**
 * アカウント発行リクエスト POST /company-accounts
 * → Company_Account + Company_Subscription を生成
 */
export interface AccountIssueRequest {
  /** 拠点名（店舗名） — Company_Account.branch_name VARCHAR(40) */
  branch_name: string;
  /** 拠点名（表示用） — Company_Account.branch_display_name VARCHAR(40) */
  branch_display_name?: string;
  /** 郵便番号（ハイフンなし） — Company_Account.postal_code CHAR(7) */
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
  /** 初期パスワード (認証連携用) */
  initial_password: string;
  /** 企業プランコード — Company_Plan.plan_code VARCHAR(20) */
  plan_code: string;
  /** クーポンコード — Plan_Coupon.coupon_code VARCHAR(20) */
  coupon_code?: string;
  /** 企業ロールID — Company_Account.company_role_id CHAR(2) */
  company_role_id: CompanyRoleId;
}

/** アカウント発行レスポンス */
export interface AccountIssueResponse {
  /** 拠点アカウントID — Company_Account.company_account_id UUID(36) */
  company_account_id: string;
  /** 拠点コード — Company_Account.branch_code VARCHAR(10) */
  branch_code: string;
}

// ─── アカウント更新 (AccountsEditScreen / SettingsAccountScreen) ──

/**
 * アカウント更新リクエスト PUT /company-accounts/:company_account_id
 * → Company_Account エンティティ準拠
 */
export interface AccountUpdateRequest {
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
  /** パスワード変更時のみ */
  password?: string;
  /** 企業プランコード — Company_Plan.plan_code VARCHAR(20) */
  plan_code?: string;
  /** クーポンコード — Plan_Coupon.coupon_code VARCHAR(20) */
  coupon_code?: string;
  /** ステータス — Company_Account.status CHAR(1) */
  status: CompanyAccountStatus;
}

/** アカウント更新レスポンス */
export interface AccountUpdateResponse {
  /** 更新後のアカウント情報 */
  item: BaseAccountItem;
}

// ─── アカウント削除 (AccountsEditScreen) ──────────

/**
 * アカウント削除リクエスト DELETE /company-accounts/:company_account_id
 */
export interface AccountDeleteRequest {
  /** 拠点アカウントID — Company_Account.company_account_id UUID(36) */
  company_account_id: string;
}

/** アカウント削除レスポンス */
export interface AccountDeleteResponse {
  deleted: boolean;
}

// ─── アカウント削除取消 ──────────────────────────

/** アカウント削除取消リクエスト POST /company-accounts/:company_account_id/cancel-deletion */
export interface AccountCancelDeletionRequest {
  /** 拠点アカウントID — Company_Account.company_account_id UUID(36) */
  company_account_id: string;
}

/** アカウント削除取消レスポンス */
export interface AccountCancelDeletionResponse {
  canceled: boolean;
}

// ─── アカウント一覧 (AccountsListScreen) ──────────

/** アカウント一覧パラメータ GET /company-accounts */
export interface AccountListParams extends PaginationParams {
  /** フリーテキスト検索 */
  query?: string;
  /** ソート順 */
  sortBy?: AccountsSortKey;
}

/** アカウント一覧レスポンス */
export interface AccountListResponse {
  /** 法人コード — Company.company_code VARCHAR(16) */
  company_code: string;
  /** アカウント一覧 */
  items: BaseAccountItem[];
}

// ─── アカウント詳細 (AccountsEditScreen) ──────────

/**
 * アカウント詳細レスポンス GET /company-accounts/:company_account_id
 * → Company_Account エンティティ準拠
 */
export interface AccountDetailResponse {
  /** 拠点アカウントID — Company_Account.company_account_id UUID(36) */
  company_account_id: string;
  /** 拠点コード — Company_Account.branch_code VARCHAR(10) */
  branch_code: string;
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
  /** 企業プランコード — Company_Plan.plan_code VARCHAR(20) */
  plan_code: string;
  /** クーポンコード — Plan_Coupon.coupon_code VARCHAR(20) */
  coupon_code?: string;
  /** ステータス — Company_Account.status CHAR(1) */
  status: CompanyAccountStatus;
  /** 企業ロールID — Company_Account.company_role_id CHAR(2) */
  company_role_id: CompanyRoleId;
}
