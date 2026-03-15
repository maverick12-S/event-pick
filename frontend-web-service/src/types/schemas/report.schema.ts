import { z } from 'zod';

// ─── レポート画面 Zod スキーマ ──────────────────────
// 参照エンティティ: EventPreview_c (集計元)

/** 日付形式 YYYY-MM-DD */
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください');

/** レポート一覧パラメータ */
export const reportListParamsSchema = z.object({
  /** 開始日 DATE(10) ○ */
  from: dateSchema,
  /** 終了日 DATE(10) ○ */
  to: dateSchema,
  /** 拠点アカウントID CHAR(26) △ (親拠点フィルタ) */
  accountId: z.string().max(36).optional(),
  /** ソート順 */
  sortBy: z.enum(['newest', 'oldest', 'views', 'likes', 'favorites']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});

/** レポート詳細パラメータ */
export const reportDetailParamsSchema = z.object({
  /** レポートID (URL パラメータ) */
  reportId: z.string().min(1),
});

/** レポートサマリーパラメータ */
export const reportSummaryParamsSchema = z.object({
  from: dateSchema,
  to: dateSchema,
  companyAccountId: z.string().max(36).optional(),
  groupBy: z.enum(['day', 'week', 'month']).optional(),
  metrics: z.array(z.string()).optional(),
});
