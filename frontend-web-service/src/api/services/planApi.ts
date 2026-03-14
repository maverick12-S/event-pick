/**
 * プラン選択 API サービス
 * ─────────────────────────────────────────────
 * 画面: PlanScreen
 * DTO: plan.dto.ts — Zod: plan.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  planSelectRequestSchema,
  planSelectResponseSchema,
  couponApplyRequestSchema,
  couponApplyResponseSchema,
} from '../../types/schemas';
import type {
  PlanSelectRequest, PlanSelectResponse,
  CouponApplyRequest, CouponApplyResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const planApi = {
  /** プラン選択 POST /billing/plan/change */
  selectPlan: async (req: PlanSelectRequest): Promise<PlanSelectResponse> => {
    const validated = planSelectRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<PlanSelectResponse>>(
      endpoints.billingPlanChange,
      validated,
    );
    return planSelectResponseSchema.parse(unwrap(res));
  },

  /** クーポン適用 POST /billing/coupon/apply */
  applyCoupon: async (req: CouponApplyRequest): Promise<CouponApplyResponse> => {
    const validated = couponApplyRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<CouponApplyResponse>>(
      endpoints.billingCouponApply,
      validated,
    );
    return couponApplyResponseSchema.parse(unwrap(res));
  },
};
