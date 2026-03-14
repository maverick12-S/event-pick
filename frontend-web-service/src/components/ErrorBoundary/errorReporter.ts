/**
 * errorReporter
 * ─────────────────────────────────────────────
 * 商用向けエラーレポーティングモジュール。
 * - PII（個人情報）自動除去
 * - 同一エラーの重複送信抑止
 * - 構造化ペイロード生成
 * - 外部サービス（Sentry 等）への接続ポイント
 */

/* ─── 型定義 ─── */

export interface ErrorReport {
  /** エラー種別 */
  kind: string;
  /** サニタイズ済みメッセージ */
  message: string;
  /** エラー発生源 */
  source: 'boundary' | 'route' | 'global' | 'async' | 'rejection';
  /** 発生時刻 (ISO) */
  timestamp: string;
  /** ページパス */
  url: string;
  /** コンポーネントスタック（開発時のみ） */
  componentStack?: string;
  /** スタックトレース（開発時のみ） */
  stack?: string;
  /** 追加メタデータ */
  meta?: Record<string, unknown>;
}

export type ErrorReportHandler = (report: ErrorReport) => void;

/* ─── PII フィルタリング ─── */

const PII_PATTERNS: RegExp[] = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,       // Email
  /\b\d{3}[-.]?\d{4}[-.]?\d{4}\b/g,                          // 電話番号 (日本)
  /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,               // クレジットカード番号
  /\b\d{3}-?\d{4}-?\d{4}\b/g,                                // 電話番号パターン2
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,                         // Bearer トークン
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,  // JWT
  /password["']?\s*[:=]\s*["'][^"']+["']/gi,                   // password=xxx
];

export function stripPii(text: string): string {
  let result = text;
  for (const pattern of PII_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

/* ─── 重複抑止 ─── */

const DEDUP_WINDOW_MS = 5_000;
const MAX_DEDUP_ENTRIES = 50;
const recentErrors = new Map<string, number>();

function makeDedupKey(kind: string, message: string, source: string): string {
  return `${kind}::${source}::${message.slice(0, 120)}`;
}

function isDuplicate(key: string): boolean {
  const now = Date.now();
  const lastSeen = recentErrors.get(key);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
    return true;
  }
  // LRU風のサイズ制限
  if (recentErrors.size >= MAX_DEDUP_ENTRIES) {
    const oldest = recentErrors.keys().next().value;
    if (oldest !== undefined) recentErrors.delete(oldest);
  }
  recentErrors.set(key, now);
  return false;
}

/** テスト用: 重複キャッシュをリセット */
export function resetDedupCache(): void {
  recentErrors.clear();
}

/* ─── レポート生成 ─── */

const IS_PRODUCTION = import.meta.env.PROD;

export function buildReport(
  kind: string,
  error: unknown,
  source: ErrorReport['source'],
  componentStack?: string,
  meta?: Record<string, unknown>,
): ErrorReport {
  const rawMessage = error instanceof Error
    ? error.message
    : typeof error === 'string' ? error : String(error);

  const report: ErrorReport = {
    kind,
    message: stripPii(rawMessage),
    source,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  // 本番ではスタック / コンポーネントスタックを送信しない
  if (!IS_PRODUCTION) {
    if (error instanceof Error && error.stack) {
      report.stack = stripPii(error.stack);
    }
    if (componentStack) {
      report.componentStack = stripPii(componentStack);
    }
  }

  if (meta) {
    report.meta = meta;
  }

  return report;
}

/* ─── 外部ハンドラー登録 ─── */

let externalHandler: ErrorReportHandler | null = null;

/** 外部エラーレポーティングサービス（Sentry等）のハンドラーを登録 */
export function setErrorReportHandler(handler: ErrorReportHandler | null): void {
  externalHandler = handler;
}

/** 登録済みハンドラーを取得（テスト用） */
export function getErrorReportHandler(): ErrorReportHandler | null {
  return externalHandler;
}

/* ─── メインレポート関数 ─── */

/**
 * エラーをレポートする。重複抑止・PII除去を自動適用。
 * @returns レポートが送信された場合は true
 */
export function reportError(
  kind: string,
  error: unknown,
  source: ErrorReport['source'],
  componentStack?: string,
  meta?: Record<string, unknown>,
): boolean {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const key = makeDedupKey(kind, rawMessage, source);

  if (isDuplicate(key)) {
    return false;
  }

  const report = buildReport(kind, error, source, componentStack, meta);

  // コンソール出力（本番は最小限）
  if (IS_PRODUCTION) {
    console.error(`[ErrorReporter] ${report.kind}: ${report.message}`);
  } else {
    console.error('[ErrorReporter]', report);
  }

  // 外部ハンドラーへ転送
  if (externalHandler) {
    try {
      externalHandler(report);
    } catch {
      // ハンドラー自体のエラーは無視（無限ループ防止）
    }
  }

  return true;
}
