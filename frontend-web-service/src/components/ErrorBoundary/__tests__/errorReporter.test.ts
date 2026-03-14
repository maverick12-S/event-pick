/**
 * errorReporter テスト
 * ─────────────────────────────────────────────
 * PII除去、重複抑止、構造化レポート、外部ハンドラー連携を検証。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  stripPii,
  buildReport,
  reportError,
  setErrorReportHandler,
  getErrorReportHandler,
  resetDedupCache,
} from '../errorReporter';

beforeEach(() => {
  resetDedupCache();
  setErrorReportHandler(null);
  vi.restoreAllMocks();
});

/* ─────────────────────────────────────────────
   1. stripPii — PII 除去
   ───────────────────────────────────────────── */
describe('stripPii — 個人情報の自動除去', () => {
  it('メールアドレスを除去', () => {
    expect(stripPii('Error for user@example.com')).toBe('Error for [REDACTED]');
  });

  it('Bearer トークンを除去', () => {
    expect(stripPii('Bearer eyJhbGc.token.sig')).toBe('[REDACTED]');
  });

  it('JWT を除去', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.abc123';
    expect(stripPii(`Token: ${jwt}`)).toContain('[REDACTED]');
    expect(stripPii(`Token: ${jwt}`)).not.toContain('eyJ');
  });

  it('password=xxx パターンを除去', () => {
    expect(stripPii('password="secret123"')).toContain('[REDACTED]');
    expect(stripPii("password='mysecret'")).toContain('[REDACTED]');
  });

  it('PII を含まないテキストはそのまま', () => {
    const text = 'Network Error: connection refused';
    expect(stripPii(text)).toBe(text);
  });

  it('複数の PII パターンを一度に除去', () => {
    const text = 'user@test.com failed with Bearer abc123def456token';
    const result = stripPii(text);
    expect(result).not.toContain('user@test.com');
    expect(result).not.toContain('Bearer');
  });
});

/* ─────────────────────────────────────────────
   2. buildReport — 構造化レポート生成
   ───────────────────────────────────────────── */
describe('buildReport — レポート構造', () => {
  it('基本フィールドが正しく設定される', () => {
    const report = buildReport('network', new Error('Network Error'), 'boundary');

    expect(report.kind).toBe('network');
    expect(report.message).toBe('Network Error');
    expect(report.source).toBe('boundary');
    expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(report.url).toBeDefined();
  });

  it('Error 以外の値もメッセージ化', () => {
    const report = buildReport('unknown', 'string error', 'global');
    expect(report.message).toBe('string error');
  });

  it('メッセージ内の PII が自動除去される', () => {
    const report = buildReport('unknown', new Error('Error for admin@corp.jp'), 'boundary');
    expect(report.message).toContain('[REDACTED]');
    expect(report.message).not.toContain('admin@corp.jp');
  });

  it('meta が含まれる', () => {
    const report = buildReport('chunk', new Error('chunk'), 'async', undefined, { retry: 1 });
    expect(report.meta).toEqual({ retry: 1 });
  });

  it('DEV 環境ではスタックが含まれる', () => {
    const err = new Error('test');
    const report = buildReport('unknown', err, 'boundary');
    // DEV=true (vitest) なのでスタックが入る
    expect(report.stack).toBeDefined();
    expect(report.stack).toContain('test');
  });

  it('componentStack が含まれる（開発時）', () => {
    const report = buildReport('unknown', new Error('x'), 'boundary', '\n    at MyComponent');
    expect(report.componentStack).toContain('MyComponent');
  });
});

/* ─────────────────────────────────────────────
   3. reportError — 重複抑止
   ───────────────────────────────────────────── */
describe('reportError — 重複抑止', () => {
  it('初回のレポートは送信される', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = reportError('network', new Error('fail'), 'global');
    expect(result).toBe(true);
    spy.mockRestore();
  });

  it('同一エラーの2回目は重複として抑止', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    reportError('network', new Error('same error'), 'global');
    const result2 = reportError('network', new Error('same error'), 'global');
    expect(result2).toBe(false);
  });

  it('異なるエラーは重複扱いしない', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    reportError('network', new Error('error A'), 'global');
    const result2 = reportError('timeout', new Error('error B'), 'global');
    expect(result2).toBe(true);
  });

  it('異なるソースは重複扱いしない', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    reportError('network', new Error('same'), 'global');
    const result2 = reportError('network', new Error('same'), 'boundary');
    expect(result2).toBe(true);
  });
});

/* ─────────────────────────────────────────────
   4. reportError — 外部ハンドラー
   ───────────────────────────────────────────── */
describe('reportError — 外部ハンドラー連携', () => {
  it('登録したハンドラーが呼ばれる', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const handler = vi.fn();
    setErrorReportHandler(handler);

    reportError('unknown', new Error('test'), 'boundary');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'unknown',
        message: 'test',
        source: 'boundary',
      }),
    );
  });

  it('ハンドラーが未登録なら呼ばれない（エラーなし）', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      reportError('unknown', new Error('test'), 'global');
    }).not.toThrow();
  });

  it('ハンドラー内のエラーが伝搬しない', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const throwing = () => { throw new Error('handler crash'); };
    setErrorReportHandler(throwing);

    expect(() => {
      reportError('unknown', new Error('test'), 'global');
    }).not.toThrow();
  });

  it('getErrorReportHandler でハンドラーを取得できる', () => {
    const handler = vi.fn();
    setErrorReportHandler(handler);
    expect(getErrorReportHandler()).toBe(handler);
  });
});

/* ─────────────────────────────────────────────
   5. resetDedupCache
   ───────────────────────────────────────────── */
describe('resetDedupCache', () => {
  it('リセット後は再送信できる', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    reportError('unknown', new Error('dup test'), 'global');
    const suppressed = reportError('unknown', new Error('dup test'), 'global');
    expect(suppressed).toBe(false);

    resetDedupCache();
    const afterReset = reportError('unknown', new Error('dup test'), 'global');
    expect(afterReset).toBe(true);
  });
});
