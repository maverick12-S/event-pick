/**
 * プラン選択 DTO 型定義
 *
 * 対応画面:
 *  - PlanScreen → PlanSelectRequest / CouponApplyRequest
 *
 * エンティティ準拠: Company_Plan, Company_Subscription, Plan_Coupon
 */

import type { CompanyPlanCode } from '../entities';

// ─── プラン選択 (PlanScreen) ──────────────────────

/**
 * プラン選択リクエスト POST /subscriptions/plan
 * → Company_Subscription.company_plan_id を更新
 */
export interface PlanSelectRequest {
  /** 企業プランコード — VARCHAR(20) = 'LIGHT'|'STANDARD'|'PREMIUM' */
  plan_code: CompanyPlanCode;
}

/** プラン選択レスポンス */
export interface PlanSelectResponse {
  /** 変更成功 */
  changed: boolean;
  /** 変更後プラン名 — Company_Plan.plan_name VARCHAR(30) */
  plan_name: string;
}

// ─── クーポン適用 (PlanScreen) ──────────────────────

/**
 * クーポン適用リクエスト POST /subscriptions/coupon
 * → Company_Subscription.coupon_code を更新
 */
export interface CouponApplyRequest {
  /** クーポンコード — Plan_Coupon.coupon_code VARCHAR(20) */
  coupon_code: string;
}

/** クーポン適用レスポンス */
export interface CouponApplyResponse {
  /** 適用成功 */
  applied: boolean;
  /** 割引種別 — Plan_Coupon.discount_type CHAR(1) */
  discount_type?: string;
  /** 無料期間日数 — Plan_Coupon.free_days INT(3) */
  free_days?: number;
}
