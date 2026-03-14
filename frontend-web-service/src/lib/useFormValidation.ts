/**
 * useFormValidation — Zodスキーマベースのフォームバリデーションフック
 * ───────────────────────────────────────────────
 * 既存の ad-hoc validate() パターンを Zod スキーマで統一し、
 * フィールド単位のエラー表示を可能にする。
 *
 * 使い方:
 *   const { errors, validate, validateField, clearError, clearErrors, isValid } =
 *     useFormValidation(schema);
 *
 *   // 送信時
 *   const result = validate(formData);
 *   if (!result.success) return; // errors は自動更新
 *   // result.data は Zod で parse 済み（型安全）
 *
 *   // フィールド変更時（任意）
 *   validateField('email', value);
 */

import { useCallback, useState } from 'react';
import type { ZodSchema, ZodError } from 'zod';
import { sanitizeFields } from './sanitize';

/** フィールド名 → エラーメッセージのマップ */
export type FieldErrors = Record<string, string>;

/** ZodError からフラットなフィールドエラーマップに変換 */
const flattenZodErrors = (error: ZodError): FieldErrors => {
  const flat: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!flat[key]) flat[key] = issue.message;
  }
  return flat;
};

/** バリデーション結果 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors };

export const useFormValidation = <T>(schema: ZodSchema<T>) => {
  const [errors, setErrors] = useState<FieldErrors>({});

  /**
   * フォームデータ全体をバリデーション + サニタイズ
   * 成功時: sanitize 済みの parse 結果を返す
   * 失敗時: errors ステートを更新し、エラーマップを返す
   */
  const validate = useCallback(
    (data: Record<string, unknown>): ValidationResult<T> => {
      // string フィールドを一括サニタイズ
      const sanitized = sanitizeFields(data);
      const result = schema.safeParse(sanitized);
      if (result.success) {
        setErrors({});
        return { success: true, data: result.data };
      }
      const fieldErrors = flattenZodErrors(result.error);
      setErrors(fieldErrors);
      return { success: false, errors: fieldErrors };
    },
    [schema],
  );

  /**
   * 単一フィールドのバリデーション（onBlur 等で使用）
   * エラーがあれば該当フィールドのみ更新、なければクリア
   */
  const validateField = useCallback(
    (field: string, value: unknown) => {
      // 単一フィールドを含むオブジェクトで部分チェック
      const partial = { [field]: typeof value === 'string' ? value.trim() : value };
      const result = schema.safeParse(partial);
      if (result.success) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      } else {
        const allErrors = flattenZodErrors(result.error);
        // 該当フィールドのエラーのみ抽出
        if (allErrors[field]) {
          setErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
        }
      }
    },
    [schema],
  );

  /** 特定フィールドのエラーをクリア */
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** 全エラーをクリア */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /** エラーが存在しないか */
  const isValid = Object.keys(errors).length === 0;

  /**
   * 最初のエラーメッセージを取得（snackbar表示用）
   * 既存パターンの validate(): string | null と互換
   */
  const firstError = Object.values(errors)[0] ?? null;

  return {
    errors,
    validate,
    validateField,
    clearError,
    clearErrors,
    isValid,
    firstError,
  } as const;
};

export default useFormValidation;
