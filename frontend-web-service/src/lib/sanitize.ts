/**
 * sanitize.ts — 入力サニタイズ + 禁止文字チェック
 * ───────────────────────────────────────────────
 * API (private network) に安全にデータを渡すため、
 * XSS / SQLインジェクション / コマンドインジェクションを
 * フロント側で事前にブロックする。
 *
 * 使い方:
 *   import { sanitize, containsForbidden, FORBIDDEN_CHARS_MSG } from '@/lib/sanitize';
 *   const clean = sanitize(rawInput);
 *   if (containsForbidden(rawInput)) { ...error... }
 */

// ─── 禁止文字パターン ───────────────────────────
// XSS: < > を含むタグ注入
// SQLi: ' ; -- /* */ のSQLフラグメント
// CMD Injection: ` $ | の制御文字
// NULL byte: \0

/** 禁止文字の正規表現 — HTMLタグ / SQL制御 / シェル制御 / NULL byte */
const FORBIDDEN_PATTERN = /[<>'"`;$|\\]|--|\0|\/\*/;

/** URL欄用の緩和パターン（クエリパラメータの ? & = は許可） */
const FORBIDDEN_PATTERN_URL = /[<>"'`;\$|\\]|--|\0|\/\*/;

/** 禁止文字が含まれているかチェック */
export const containsForbidden = (value: string): boolean => {
  return FORBIDDEN_PATTERN.test(value);
};

/** URL用の緩和チェック（/ ? & = # : は許可） */
export const containsForbiddenUrl = (value: string): boolean => {
  return FORBIDDEN_PATTERN_URL.test(value);
};

/** 禁止文字のユーザー向けエラーメッセージ */
export const FORBIDDEN_CHARS_MSG = '使用できない文字が含まれています（< > \' " ` ; $ | \\ -- など）';

// ─── サニタイズ関数 ─────────────────────────────

/** 前後空白のトリム */
export const trimValue = (value: string): string => value.trim();

/** HTMLエンティティにエスケープ（表示用、API送信前に使用） */
export const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/** 制御文字（\x00-\x1f, \x7f）を除去。改行・タブは保持 */
export const stripControlChars = (value: string): string => {
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * 入力値のサニタイズ — trim + 制御文字除去
 * HTMLエスケープは行わない（API側で行うため、二重エスケープを防止）
 */
export const sanitize = (value: string): string => {
  return stripControlChars(trimValue(value));
};

/**
 * オブジェクト全体のサニタイズ — string フィールドに sanitize を適用
 */
export const sanitizeFields = <T extends Record<string, unknown>>(obj: T): T => {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key as keyof T];
    if (typeof val === 'string') {
      (result as Record<string, unknown>)[key] = sanitize(val as string);
    }
  }
  return result;
};

// ─── Zod カスタムバリデータ（スキーマに組み込み用） ──

import { z } from 'zod';

/** 禁止文字チェック付き文字列スキーマ */
export const safeString = (opts?: { min?: number; max?: number }) => {
  let schema = z.string();
  if (opts?.min !== undefined) schema = schema.min(opts.min);
  if (opts?.max !== undefined) schema = schema.max(opts.max);
  return schema.refine((v) => !containsForbidden(v), { message: FORBIDDEN_CHARS_MSG });
};

/** 禁止文字チェック付きURL文字列スキーマ */
export const safeUrl = (opts?: { max?: number }) => {
  let schema = z.string().url();
  if (opts?.max !== undefined) schema = schema.max(opts.max);
  return schema.refine((v) => !containsForbiddenUrl(v), { message: FORBIDDEN_CHARS_MSG });
};

/** 禁止文字チェック付きメールスキーマ */
export const safeEmail = (opts?: { max?: number }) => {
  let schema = z.string().email();
  if (opts?.max !== undefined) schema = schema.max(opts.max);
  return schema.refine((v) => !containsForbidden(v), { message: FORBIDDEN_CHARS_MSG });
};
