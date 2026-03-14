import type {
  CompanyPlanId,
  CompanyPlanCode,
  UserPlanId,
  UserPlanCode,
  CouponTargetType,
  CouponDiscountType,
} from './enums';

/**
 * 企業プラン (Company_Plan)
 * API参照名: Company_Plan
 */
export interface CompanyPlan {
  /** 企業プランID — CHAR(2) 外部ID */
  company_plan_id: CompanyPlanId;
  /** プランコード — VARCHAR(20) 外部ID */
  plan_code: CompanyPlanCode;
  /** プラン名（表示用） — VARCHAR(30) */
  plan_name: string;
  /** 月額料金（円・税抜） — INT(7) */
  monthly_price: number;
  /** 1日投稿チケット数 — INT(3) */
  daily_ticket_limit: number;
  /** 繰越可否フラグ（日跨ぎ） — BOOLEAN */
  is_carry_over: boolean;
  /** 月跨ぎ可否フラグ — BOOLEAN */
  is_month_carry: boolean;
  /** レポート機能フラグ — BOOLEAN */
  is_report_enabled: boolean;
  /** 自動投稿機能フラグ — BOOLEAN */
  is_auto_post_enabled: boolean;
}

/**
 * 一般消費者プラン (User_Plan)
 * API参照名: User_Plan
 */
export interface UserPlan {
  /** 消費者プランID — CHAR(2) 外部ID */
  user_plan_id: UserPlanId;
  /** プランコード — VARCHAR(20) 外部ID */
  plan_code: UserPlanCode;
  /** プラン名（表示用） — VARCHAR(30) */
  plan_name: string;
  /** 月額料金（円・税抜） — INT(7) */
  monthly_price: number;
  /** 広告表示フラグ (true=広告あり) — BOOLEAN */
  is_ad_enabled: boolean;
  /** プッシュ通知上限（将来拡張用） — INT(3) */
  push_limit?: number;
  /** 有効フラグ（廃止管理） — BOOLEAN */
  is_active: boolean;
}

/**
 * クーポン (Plan_Coupon)
 * API参照名: Plan_Coupon
 */
export interface PlanCoupon {
  /** ULID — CHAR(26) 外部ID */
  coupon_id: string;
  /** クーポンコード — VARCHAR(20) 外部ID */
  coupon_code: string;
  /** 対象種別 — CHAR(1) */
  target_type: CouponTargetType;
  /** 割引種別 — CHAR(1) */
  discount_type: CouponDiscountType;
  /** 無料期間日数 — INT(3) */
  free_days?: number;
}
