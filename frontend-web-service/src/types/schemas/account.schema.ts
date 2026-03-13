import { z } from 'zod';

/** アカウントステータス */
export const accountStatusSchema = z.enum(['利用中', '停止中', '削除予定']);

/** 契約プラン */
export const contractPlanSchema = z.enum(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン']);

/** 拠点アカウント */
export const baseAccountItemSchema = z.object({
  id: z.string().min(1),
  companyCode: z.string().min(1),
  baseName: z.string().min(1),
  accountId: z.string().min(1),
  status: accountStatusSchema,
  plan: contractPlanSchema,
  scheduledDeletionAt: z.string().optional(),
});
