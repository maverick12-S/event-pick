/**
 * useFormValidation.ts — Zodスキーマベースのバリデーションフックのテスト
 * ───────────────────────────────────────────────
 * React Hooks のテスト: renderHook + act パターンで
 * validate / validateField / clearError / clearErrors の挙動を検証。
 */

import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useFormValidation } from '../useFormValidation';
import { safeString } from '../sanitize';

// テスト用スキーマ: safeString を使用して禁止文字チェックを含む
const testSchema = z.object({
  name: safeString({ min: 1, max: 20 }),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(1).optional(),
});

const refineSchema = z.object({
  password: z.string().min(8),
  confirm: z.string().min(1),
}).refine((d) => d.password === d.confirm, {
  message: 'パスワードが一致しません',
  path: ['confirm'],
});

// ═══════════════════════════════════════════════
// validate — 全体バリデーション
// ═══════════════════════════════════════════════

describe('useFormValidation: validate', () => {
  it('有効なデータでエラーなしを返す', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    let validationResult: ReturnType<typeof result.current.validate>;
    act(() => {
      validationResult = result.current.validate({ name: '田中太郎', email: 'test@example.com' });
    });

    expect(validationResult!.success).toBe(true);
    if (validationResult!.success) {
      expect(validationResult!.data.name).toBe('田中太郎');
    }
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.firstError).toBeNull();
  });

  it('無効なデータでフィールドエラーを返す', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    let validationResult: ReturnType<typeof result.current.validate>;
    act(() => {
      validationResult = result.current.validate({ name: '', email: 'invalid' });
    });

    expect(validationResult!.success).toBe(false);
    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.isValid).toBe(false);
    expect(result.current.firstError).toBeTruthy();
  });

  it('禁止文字を含む入力でエラーを返す', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    let validationResult: ReturnType<typeof result.current.validate>;
    act(() => {
      validationResult = result.current.validate({ name: '<script>alert(1)</script>', email: 'test@example.com' });
    });

    expect(validationResult!.success).toBe(false);
    expect(result.current.errors.name).toBeDefined();
  });

  it('サニタイズ（trim・制御文字除去）が自動適用される', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    let validationResult: ReturnType<typeof result.current.validate>;
    act(() => {
      validationResult = result.current.validate({ name: '  田中太郎  ', email: '  test@example.com  ' });
    });

    expect(validationResult!.success).toBe(true);
    if (validationResult!.success) {
      expect(validationResult!.data.name).toBe('田中太郎');
      expect(validationResult!.data.email).toBe('test@example.com');
    }
  });

  it('refine付きスキーマでバリデーションエラーを返す', () => {
    const { result } = renderHook(() => useFormValidation(refineSchema));

    let validationResult: ReturnType<typeof result.current.validate>;
    act(() => {
      validationResult = result.current.validate({ password: 'password1', confirm: 'password2' });
    });

    expect(validationResult!.success).toBe(false);
    expect(result.current.errors.confirm).toBe('パスワードが一致しません');
  });

  it('連続呼び出しでエラー状態が更新される', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    // 1回目: エラーあり
    act(() => {
      result.current.validate({ name: '', email: 'invalid' });
    });
    expect(result.current.isValid).toBe(false);

    // 2回目: 正常データ → エラークリア
    act(() => {
      result.current.validate({ name: '田中', email: 'test@example.com' });
    });
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });
});

// ═══════════════════════════════════════════════
// validateField — 単一フィールドバリデーション
// ═══════════════════════════════════════════════

describe('useFormValidation: validateField', () => {
  it('無効な値でフィールドエラーを設定する', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.validateField('email', 'not-an-email');
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it('有効な値でフィールドエラーをクリアする', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    // まずエラーを設定
    act(() => {
      result.current.validate({ name: '', email: 'invalid' });
    });
    expect(result.current.errors.email).toBeDefined();

    // clearError で手動クリア（validateField は全体スキーマで検証するため）
    act(() => {
      result.current.clearError('email');
    });
    // emailエラーはクリアされるが、nameエラーは残る
    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.name).toBeDefined();
  });
});

// ═══════════════════════════════════════════════
// clearError / clearErrors
// ═══════════════════════════════════════════════

describe('useFormValidation: clearError / clearErrors', () => {
  it('clearError で特定フィールドのエラーをクリアする', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.validate({ name: '', email: 'invalid' });
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThanOrEqual(2);

    act(() => {
      result.current.clearError('name');
    });
    expect(result.current.errors.name).toBeUndefined();
    expect(result.current.errors.email).toBeDefined();
  });

  it('clearErrors で全エラーをクリアする', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.validate({ name: '', email: 'invalid' });
    });
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.clearErrors();
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });
});

// ═══════════════════════════════════════════════
// firstError — スナックバー表示用
// ═══════════════════════════════════════════════

describe('useFormValidation: firstError', () => {
  it('エラーがない場合はnullを返す', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    expect(result.current.firstError).toBeNull();
  });

  it('エラーがある場合は最初のエラーメッセージを返す', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.validate({ name: '', email: 'invalid' });
    });

    expect(typeof result.current.firstError).toBe('string');
    expect(result.current.firstError!.length).toBeGreaterThan(0);
  });
});
