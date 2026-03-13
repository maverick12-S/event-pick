/**
 * Zod ユーティリティ
 * ─────────────────────────────────────────────
 * アプリ全体で使う Zod ヘルパー。
 * スキーマ単位の parse / safeParse / バリデーションメッセージ生成を提供。
 */

import { z, type ZodSchema, type ZodError } from 'zod';

export { z };
export type { ZodSchema, ZodError };

/** スキーマで parse し、失敗時は ZodError を throw */
export const parse = <T>(schema: ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

/** 例外を投げずに success / error を返す */
export const safeParse = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: ZodError } => {
  return schema.safeParse(data);
};

/** ZodError → { [fieldName]: message } のフラットマップに変換 */
export const flattenErrors = (error: ZodError): Record<string, string> => {
  const flat: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!flat[key]) {
      flat[key] = issue.message;
    }
  }
  return flat;
};
