import type { PaymentStatusCode } from './enums';

/**
 * 企業請求管理 (Company_Billing)
 * API参照名: Company_Billing
 *
 * NOTE: 定義書No.8 payment_statusのデータ型欄に"paid_at"と記載あり。
 * 文脈からCHAR(1)として扱う。
 */
export interface CompanyBilling {
  /** ULID — CHAR(26) 外部ID */
  payment_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** 契約ID — CHAR(26) → Company_Subscription FK */
  subscription_id: string;
  /** 請求対象年月 YYYYMM — CHAR(6) */
  billing_month: string;
  /** 請求金額（税込） — INT(9) */
  amount: number;
  /** 割引額（クーポン適用） — INT(9) */
  discount_amount?: number;
  /** 最終請求額 — INT(9) 数式: amount - discount_amount */
  final_amount: number;
  /** 支払状態 — CHAR(1) */
  payment_status: PaymentStatusCode;
  /** 支払期限 — DATE(10) */
  due_date?: string;
  /** 支払日（成功時） — DATETIME(19) */
  paid_at?: string;
  /** 決済トランザクションID — VARCHAR(64) 外部ID */
  transaction_id?: string;
}

/**
 * 消費者請求管理 (User_Payment_Status)
 * API参照名: User_Payment_Status
 */
export interface UserPaymentStatus {
  /** ULID — CHAR(26) 外部ID */
  payment_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  user_id: string;
  /** 契約ID — CHAR(26) → User_Subscription FK */
  user_subscription_id?: string;
  /** 請求対象年月（月初固定 例:2025-04-01） — DATE(10) */
  billing_month: string;
  /** 請求金額（税込） — INT(10) */
  amount: number;
  /** 割引額（クーポン適用） — INT(10) */
  discount_amount?: number;
  /** 最終請求額 — INT(10) 数式: amount - COALESCE(discount_amount, 0) */
  final_amount: number;
  /** 支払状態 — CHAR(1) */
  payment_status: PaymentStatusCode;
  /** 支払期限 — DATE(10) */
  due_date?: string;
  /** 支払日（成功時） — DATETIME(19) */
  paid_at?: string;
  /** 決済トランザクションID — VARCHAR(64) 外部ID */
  transaction_id?: string;
}
