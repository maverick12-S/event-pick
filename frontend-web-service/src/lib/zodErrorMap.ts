/**
 * zodErrorMap.ts — Zod グローバル日本語エラーマップ
 * ───────────────────────────────────────────────
 * Zod のデフォルト英語メッセージを日本語に置き換える。
 * main.tsx で import するだけで全スキーマに適用される。
 *
 * 参考: https://zod.dev/ERROR_HANDLING?id=customizing-errors-with-zoderrormap
 */

import { z, ZodIssueCode, ZodParsedType } from 'zod';

const jpParsedType = (t: ZodParsedType): string => {
  switch (t) {
    case ZodParsedType.string:
      return '文字列';
    case ZodParsedType.number:
      return '数値';
    case ZodParsedType.bigint:
      return '整数';
    case ZodParsedType.boolean:
      return '真偽値';
    case ZodParsedType.date:
      return '日付';
    case ZodParsedType.array:
      return '配列';
    case ZodParsedType.object:
      return 'オブジェクト';
    case ZodParsedType.undefined:
      return '未定義';
    case ZodParsedType.null:
      return 'null';
    case ZodParsedType.nan:
      return 'NaN';
    default:
      return t;
  }
};

const zodJaErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    // ── 型不一致 ──
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        return { message: '必須項目です' };
      }
      return {
        message: `${jpParsedType(issue.expected)}で入力してください（${jpParsedType(issue.received)}が入力されました）`,
      };

    // ── リテラル不一致 ──
    case ZodIssueCode.invalid_literal:
      return { message: `値が正しくありません` };

    // ── 列挙値不一致 ──
    case ZodIssueCode.invalid_enum_value:
      return {
        message: `選択肢から選んでください（${issue.options.join(' / ')}）`,
      };

    // ── union どれにも該当しない ──
    case ZodIssueCode.invalid_union:
      return { message: '入力値が正しくありません' };

    case ZodIssueCode.invalid_union_discriminator:
      return {
        message: `選択肢から選んでください（${issue.options.join(' / ')}）`,
      };

    // ── 文字列バリデーション ──
    case ZodIssueCode.invalid_string:
      if (issue.validation === 'email') return { message: '有効なメールアドレスを入力してください' };
      if (issue.validation === 'url') return { message: '有効なURLを入力してください' };
      if (issue.validation === 'uuid') return { message: '有効なUUIDを入力してください' };
      if (issue.validation === 'datetime') return { message: '有効な日時を入力してください' };
      if (issue.validation === 'ip') return { message: '有効なIPアドレスを入力してください' };
      if (typeof issue.validation === 'object' && 'startsWith' in issue.validation) {
        return { message: `「${issue.validation.startsWith}」で始まる値を入力してください` };
      }
      if (typeof issue.validation === 'object' && 'endsWith' in issue.validation) {
        return { message: `「${issue.validation.endsWith}」で終わる値を入力してください` };
      }
      return { message: '入力形式が正しくありません' };

    // ── 数値 / 日付の大小 ──
    case ZodIssueCode.too_small:
      if (issue.type === 'string') {
        if (issue.minimum === 1) return { message: '入力してください' };
        return { message: `${issue.minimum}文字以上で入力してください` };
      }
      if (issue.type === 'number') {
        return {
          message: issue.inclusive
            ? `${issue.minimum}以上の値を入力してください`
            : `${issue.minimum}より大きい値を入力してください`,
        };
      }
      if (issue.type === 'array') {
        return { message: `${issue.minimum}件以上選択してください` };
      }
      if (issue.type === 'date') {
        return { message: `指定日以降の日付を入力してください` };
      }
      return { message: `${issue.minimum}以上にしてください` };

    case ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `${issue.maximum}文字以内で入力してください` };
      }
      if (issue.type === 'number') {
        return {
          message: issue.inclusive
            ? `${issue.maximum}以下の値を入力してください`
            : `${issue.maximum}未満の値を入力してください`,
        };
      }
      if (issue.type === 'array') {
        return { message: `${issue.maximum}件以内で選択してください` };
      }
      if (issue.type === 'date') {
        return { message: `指定日以前の日付を入力してください` };
      }
      return { message: `${issue.maximum}以下にしてください` };

    // ── 正規表現不一致 ──
    case ZodIssueCode.invalid_string:
      return { message: '入力形式が正しくありません' };

    // ── 配列内ユニーク違反 ──
    case ZodIssueCode.custom:
      return { message: ctx.defaultError };

    // ── 認識できないキー ──
    case ZodIssueCode.unrecognized_keys:
      return { message: `不明な項目が含まれています: ${issue.keys.join(', ')}` };

    // ── 引数/戻り値 ──
    case ZodIssueCode.invalid_arguments:
      return { message: '引数が正しくありません' };

    case ZodIssueCode.invalid_return_type:
      return { message: '戻り値が正しくありません' };

    // ── 日付 ──
    case ZodIssueCode.invalid_date:
      return { message: '有効な日付を入力してください' };

    // ── intersection 型のマージ不可 ──
    case ZodIssueCode.invalid_intersection_types:
      return { message: '型の組み合わせが正しくありません' };

    // ── not_multiple_of ──
    case ZodIssueCode.not_multiple_of:
      return { message: `${issue.multipleOf}の倍数で入力してください` };

    // ── not_finite ──
    case ZodIssueCode.not_finite:
      return { message: '有限の数値を入力してください' };

    default:
      return { message: ctx.defaultError };
  }
};

// グローバル適用
z.setErrorMap(zodJaErrorMap);
