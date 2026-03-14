/**
 * ErrorPage
 * ─────────────────────────────────────────────
 * 統一エラー表示ページ。エラー種別に応じたメッセージ・リカバリ操作を提供。
 * 商用リリース水準:
 *  - アクセシビリティ (heading, focus, aria-live, keyboard)
 *  - 本番環境では技術的詳細を非表示
 *  - リトライ連打防止 (debounce)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ErrorPage.module.css';

/* ─── エラー種別 ─── */
export type ErrorKind =
  | 'network'        // ネットワーク接続不良
  | 'chunk'          // 遅延読み込み失敗
  | 'auth'           // 認証切れ (401)
  | 'forbidden'      // 権限不足 (403)
  | 'not-found'      // ページ未検出 (404)
  | 'server'         // サーバーエラー (5xx)
  | 'timeout'        // タイムアウト
  | 'unknown';       // 不明なランタイムエラー

export interface ErrorPageProps {
  kind?: ErrorKind;
  /** 技術的エラーメッセージ（開発時のみ表示） */
  message?: string;
  /** 再試行コールバック。設定しない場合はページリロード */
  onRetry?: () => void;
  /** リセットコールバック（ErrorBoundary からの reset 用） */
  onReset?: () => void;
}

/* ─── エラー種別 → UI情報マッピング ─── */
interface ErrorMeta {
  icon: string;
  title: string;
  description: string;
  code: string;
}

const ERROR_META: Record<ErrorKind, ErrorMeta> = {
  network: {
    icon: '🌐',
    title: '接続エラー',
    description: 'ネットワークに接続できません。インターネット接続を確認してからもう一度お試しください。',
    code: 'ERR_NETWORK',
  },
  chunk: {
    icon: '📦',
    title: 'ページ読み込みエラー',
    description: '新しいバージョンが公開された可能性があります。ページを再読み込みしてください。',
    code: 'ERR_CHUNK_LOAD',
  },
  auth: {
    icon: '🔒',
    title: '認証エラー',
    description: 'セッションの有効期限が切れました。ログインページに移動して再度ログインしてください。',
    code: 'ERR_AUTH',
  },
  forbidden: {
    icon: '🚫',
    title: 'アクセス権限がありません',
    description: 'このページにアクセスする権限がありません。管理者にお問い合わせください。',
    code: 'ERR_FORBIDDEN',
  },
  'not-found': {
    icon: '🔍',
    title: 'ページが見つかりません',
    description: 'お探しのページは存在しないか、移動した可能性があります。',
    code: 'ERR_NOT_FOUND',
  },
  server: {
    icon: '⚙️',
    title: 'サーバーエラー',
    description: 'サーバーで問題が発生しました。しばらく時間を置いてからお試しください。',
    code: 'ERR_SERVER',
  },
  timeout: {
    icon: '⏱️',
    title: 'タイムアウト',
    description: 'リクエストがタイムアウトしました。通信環境を確認してからもう一度お試しください。',
    code: 'ERR_TIMEOUT',
  },
  unknown: {
    icon: '⚠️',
    title: '予期しないエラー',
    description: 'システムで問題が発生しました。ページを再読み込みするか、しばらく時間を置いてからお試しください。',
    code: 'ERR_UNKNOWN',
  },
};

/** テスト用にエクスポート */
export { ERROR_META };

const IS_DEV = import.meta.env.DEV;

/** リトライ連打防止の間隔 (ms) */
const RETRY_DEBOUNCE_MS = 1_000;

const ErrorPage: React.FC<ErrorPageProps> = ({ kind = 'unknown', message, onRetry, onReset }) => {
  const meta = useMemo(() => ERROR_META[kind], [kind]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [retryDisabled, setRetryDisabled] = useState(false);

  // マウント時にh1へフォーカスしてスクリーンリーダーに即時通知
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleRetry = useCallback(() => {
    if (retryDisabled) return;
    setRetryDisabled(true);
    setTimeout(() => setRetryDisabled(false), RETRY_DEBOUNCE_MS);

    if (onRetry) {
      onRetry();
    } else if (kind === 'chunk') {
      window.location.reload();
    } else if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  }, [onRetry, onReset, kind, retryDisabled]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/login';
    }
  }, []);

  // Escape キーで「戻る」操作
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleGoBack();
    }
  }, [handleGoBack]);

  return (
    <div
      className={styles.container}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.card}>
        {/* アイコン */}
        <div className={styles.iconWrapper}>
          <span className={styles.icon} role="img" aria-hidden="true">
            {meta.icon}
          </span>
        </div>

        {/* エラーコード */}
        <span className={styles.errorCode} aria-label={`エラーコード: ${meta.code}`}>
          {meta.code}
        </span>

        {/* タイトル — tabIndex=-1 でプログラムフォーカス対象 */}
        <h1 className={styles.title} ref={headingRef} tabIndex={-1}>
          {meta.title}
        </h1>
        <p className={styles.description}>{meta.description}</p>

        {/* 開発環境のみ：技術的詳細（本番では絶対に非表示） */}
        {IS_DEV && message && (
          <details className={styles.devDetails} data-testid="dev-details">
            <summary>開発者向け情報</summary>
            <pre className={styles.devMessage}>{message}</pre>
          </details>
        )}

        {/* アクションボタン */}
        <div className={styles.actions} role="group" aria-label="エラー回復操作">
          {kind === 'auth' ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleGoHome}
              aria-label="ログインページへ移動"
            >
              ログインページへ
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleRetry}
              disabled={retryDisabled}
              aria-label={kind === 'chunk' ? 'ページを再読み込み' : 'もう一度試す'}
              aria-busy={retryDisabled}
            >
              {kind === 'chunk' ? 'ページを再読み込み' : 'もう一度試す'}
            </button>
          )}
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleGoBack}
            aria-label="前のページへ戻る"
          >
            前のページへ戻る
          </button>
        </div>

        {/* フッター */}
        <p className={styles.footer}>
          問題が解決しない場合は<a href="mailto:support@eventpick.jp" className={styles.footerLink}>サポート</a>までお問い合わせください。
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
