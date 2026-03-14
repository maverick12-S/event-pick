import type { SubscriptionStatusCode } from './enums';

/**
 * 企業契約管理 (Company_Subscription)
 * API参照名: Company_Subscription
 */
export interface CompanySubscription {
  /** ULID — CHAR(26) 外部ID */
  subscription_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** 企業プランID — CHAR(2) → Company_Plan FK */
  company_plan_id: string;
  /** 契約ステータス — CHAR(1) */
  status: SubscriptionStatusCode;
  /** 契約開始日 — DATE(10) */
  start_date: string;
  /** 契約終了日（解約時のみ） — DATE(10) */
  end_date?: string;
  /** 自動更新フラグ — BOOLEAN */
  is_auto_renew: boolean;
  /** クーポンコード — VARCHAR(20) 外部ID → Coupon FK */
  coupon_code?: string;
}

/**
 * 一般消費者契約管理 (User_Subscription)
 * API参照名: User_Subscription
 */
export interface UserSubscription {
  /** ULID — CHAR(26) 外部ID */
  subscription_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  user_id: string;
  /** 消費者プランID — CHAR(2) → User_Plan FK */
  user_plan_id: string;
  /** 契約ステータス — CHAR(1) */
  status: SubscriptionStatusCode;
  /** 契約開始日 — DATE(10) */
  start_date: string;
  /** 契約終了日（解約時のみ） — DATE(10) */
  end_date?: string;
  /** 自動更新フラグ — BOOLEAN */
  is_auto_renew: boolean;
  /** クーポンコード（初回登録用） — VARCHAR(20) 外部ID */
  coupon_code?: string;
}
