/**
 * zodErrorMap.ts — Zod v4 グローバル日本語エラーマップ
 * ───────────────────────────────────────────────
 * Zod v4 のデフォルト英語メッセージを日本語に置き換える。
 * main.tsx / setupTests.ts で import するだけで全スキーマに適用される。
 *
 * Zod v4 の error map は (issue) => { message } の形式。
 * issue.code: 'invalid_type' | 'too_small' | 'too_big' | 'invalid_format' | 'invalid_value' | 'custom' 等
 * issue.origin: 'string' | 'number' | 'array' | 'date' 等 (too_small/too_big)
 */

import { z } from 'zod';

const jpExpectedType = (t: string): string => {
  switch (t) {
    case 'string': return '文字列';
    case 'number': return '数値';
    case 'int': return '整数';
    case 'bigint': return '整数';
    case 'boolean': return '真偽値';
    case 'date': return '日付';
    case 'array': return '配列';
    case 'object': return 'オブジェクト';
    case 'undefined': return '未定義';
    case 'null': return 'null';
    default: return t;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const zodJaErrorMap = (issue: any): { message: string } => {
  switch (issue.code) {
    // ── 型不一致 ──
    case 'invalid_type': {
      // undefined = 必須フィールドが未入力
      if (issue.input === undefined || issue.input === null) {
        return { message: '必須項目です' };
      }
      // int チェック (z.number().int())
      if (issue.expected === 'int') {
        return { message: '整数で入力してください' };
      }
      return { message: `${jpExpectedType(issue.expected)}で入力してください` };
    }

    // ── 最小値 / 最小長 ──
    case 'too_small': {
      const origin = issue.origin as string | undefined;
      if (origin === 'string') {
        if (issue.minimum === 1) return { message: '入力してください' };
        return { message: `${issue.minimum}文字以上で入力してください` };
      }
      if (origin === 'number') {
        return {
          message: issue.inclusive
            ? `${issue.minimum}以上の値を入力してください`
            : `${issue.minimum}より大きい値を入力してください`,
        };
      }
      if (origin === 'array') {
        return { message: `${issue.minimum}件以上選択してください` };
      }
      if (origin === 'date') {
        return { message: '指定日以降の日付を入力してください' };
      }
      return { message: `${issue.minimum}以上にしてください` };
    }

    // ── 最大値 / 最大長 ──
    case 'too_big': {
      const origin = issue.origin as string | undefined;
      if (origin === 'string') {
        return { message: `${issue.maximum}文字以内で入力してください` };
      }
      if (origin === 'number') {
        return {
          message: issue.inclusive
            ? `${issue.maximum}以下の値を入力してください`
            : `${issue.maximum}未満の値を入力してください`,
        };
      }
      if (origin === 'array') {
        return { message: `${issue.maximum}件以内で選択してください` };
      }
      if (origin === 'date') {
        return { message: '指定日以前の日付を入力してください' };
      }
      return { message: `${issue.maximum}以下にしてください` };
    }

    // ── フォーマットバリデーション (email, url, regex, datetime, uuid 等) ──
    case 'invalid_format': {
      const format = issue.format as string | undefined;
      if (format === 'email') return { message: '有効なメールアドレスを入力してください' };
      if (format === 'url') return { message: '有効なURLを入力してください' };
      if (format === 'uuid') return { message: '有効なUUIDを入力してください' };
      if (format === 'datetime') return { message: '有効な日時を入力してください' };
      if (format === 'ip' || format === 'ipv4' || format === 'ipv6') return { message: '有効なIPアドレスを入力してください' };
      if (format === 'regex') return { message: '入力形式が正しくありません' };
      return { message: '入力形式が正しくありません' };
    }

    // ── 列挙値 / リテラル不一致 ──
    case 'invalid_value': {
      const values = issue.values as unknown[];
      if (values && values.length === 1) {
        return { message: '値が正しくありません' };
      }
      return { message: '選択肢から選んでください' };
    }

    // ── union どれにも該当しない ──
    case 'invalid_union':
      return { message: '入力値が正しくありません' };

    // ── 認識できないキー ──
    case 'unrecognized_keys':
      return { message: `不明な項目が含まれています: ${(issue.keys || []).join(', ')}` };

    // ── 日付 ──
    case 'invalid_date':
      return { message: '有効な日付を入力してください' };

    // ── custom (refine 等) ──
    case 'custom':
      return { message: issue.message || '入力値が正しくありません' };

    default:
      return { message: issue.message || '入力値が正しくありません' };
  }
};

// グローバル適用
z.setErrorMap(zodJaErrorMap as z.ZodErrorMap);
