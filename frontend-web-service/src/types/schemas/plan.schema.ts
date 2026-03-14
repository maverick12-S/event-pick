import { z } from 'zod';

// ─── プラン選択・クーポン適用 Zod スキーマ ──────────
// 参照エンティティ: Company_Plan, Plan_Coupon

/** プラン選択リクエスト → Company_Plan.plan_code */
export const planSelectRequestSchema = z.object({
  /** プランコード VARCHAR(20) ○ LIGHT/STANDARD/PREMIUM */
  plan_code: z.enum(['LIGHT', 'STANDARD', 'PREMIUM']),
});

/** プラン選択レスポンス */
export const planSelectResponseSchema = z.object({
  changed: z.boolean(),
  /** プラン名 VARCHAR(30) */
  plan_name: z.string().max(30),
});

/** クーポン適用リクエスト → Plan_Coupon.coupon_code */
export const couponApplyRequestSchema = z.object({
  /** クーポンコード VARCHAR(20) ○ */
  coupon_code: z.string().min(1).max(20),
});

/** クーポン適用レスポンス */
export const couponApplyResponseSchema = z.object({
  applied: z.boolean(),
  /** 割引種別 CHAR(1) 1:金額/2:率 */
  discount_type: z.enum(['1', '2']).optional(),
  /** 無料期間日数 INT(3) */
  free_days: z.number().int().min(0).max(999).optional(),
});
