/**
 * classifyError
 * ─────────────────────────────────────────────
 * 任意の Error オブジェクトから ErrorKind を推定する。
 * ネットワーク障害・チャンク読み込み失敗・HTTP ステータスなどを判定。
 */

import type { ErrorKind } from './ErrorPage';

/**
 * エラーオブジェクトから ErrorKind を判定する
 */
export function classifyError(error: unknown): ErrorKind {
  if (!error) return 'unknown';

  // ─── チャンク読み込みエラー (React.lazy / dynamic import) ───
  if (isChunkLoadError(error)) return 'chunk';

  // ─── ネットワークエラー ───
  if (isNetworkError(error)) return 'network';

  // ─── タイムアウト ───
  if (isTimeoutError(error)) return 'timeout';

  // ─── HTTP ステータスベースの分類 ───
  const status = extractHttpStatus(error);
  if (status !== null) {
    if (status === 401) return 'auth';
    if (status === 403) return 'forbidden';
    if (status === 404) return 'not-found';
    if (status >= 500) return 'server';
  }

  // ─── エラーコードベースの分類 ───
  const code = extractErrorCode(error);
  if (code) {
    if (code === 'ERR_AUTH' || code === 'UNAUTHORIZED') return 'auth';
    if (code === 'ERR_FORBIDDEN' || code === 'FORBIDDEN') return 'forbidden';
    if (code === 'ERR_NOT_FOUND' || code === 'NOT_FOUND') return 'not-found';
  }

  return 'unknown';
}

/**
 * エラーメッセージを安全に抽出する
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/* ─── 内部判定ヘルパー ─── */

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  // dynamic import 失敗パターン
  if (msg.includes('loading chunk') || msg.includes('loading css chunk')) return true;
  if (msg.includes('failed to fetch dynamically imported module')) return true;
  if (msg.includes('importing a module script failed')) return true;
  // ChunkLoadError (webpack/vite)
  if (error.name === 'ChunkLoadError') return true;
  return false;
}

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  if (msg.includes('network error') || msg.includes('networkerror')) return true;
  if (msg.includes('failed to fetch')) return true;
  if (msg.includes('load failed')) return true;
  if (msg === 'network request failed') return true;
  // Axios の ERR_NETWORK
  if ((error as any)?.code === 'ERR_NETWORK') return true;
  return false;
}

function isTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  if (msg.includes('timeout') || msg.includes('timed out')) return true;
  if ((error as any)?.code === 'ECONNABORTED') return true;
  if ((error as any)?.code === 'ERR_TIMEOUT') return true;
  return false;
}

function extractHttpStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  // Axios error: error.response.status
  const resp = (error as any)?.response;
  if (resp && typeof resp.status === 'number') return resp.status;
  // Custom property: error.status
  const status = (error as any)?.status;
  if (typeof status === 'number' && status >= 100 && status < 600) return status;
  return null;
}

function extractErrorCode(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;
  const code = (error as any)?.code;
  return typeof code === 'string' ? code : null;
}
