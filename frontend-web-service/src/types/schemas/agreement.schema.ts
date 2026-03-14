/**
 * 承諾ログ Zod スキーマ定義
 *
 * 対応 DTO: agreement.dto.ts
 * API サービス層で送信前バリデーションに使用。
 */
import { z } from 'zod';

/** 承諾種別スキーマ */
export const agreementTypeSchema = z.literal('TEMPLATE_LICENSE');

/**
 * 承諾ログ作成リクエストスキーマ
 * POST /agreement-logs
 */
export const agreementLogCreateRequestSchema = z.object({
  company_id: z.string().min(1).max(26),
  user_id: z.string().min(1).max(26),
  agreement_type: agreementTypeSchema,
  agreement_version: z.string().min(1).max(10),
  agreed_at: z.string().datetime(),
  template_id: z.string().min(1).max(60),
  user_agent: z.string().max(500),
});

/** 承諾ログ作成レスポンススキーマ */
export const agreementLogCreateResponseSchema = z.object({
  created: z.boolean(),
});
