/**
 * ErrorBoundary
 * ─────────────────────────────────────────────
 * React コンポーネントツリー内のランタイムエラーをキャッチし、
 * エラー種別に応じた ErrorPage を表示する。
 *
 * 商用リリース水準:
 *  - errorReporter 連携（PII除去・重複抑止・外部サービス転送）
 *  - ネスト対応（内側 → 外側の順にキャッチ）
 *  - resetKey による自動リセット（ルーティング連携）
 *  - リトライ間隔制御
 */

import React from 'react';
import ErrorPage from './ErrorPage';
import type { ErrorKind } from './ErrorPage';
import { classifyError, extractErrorMessage } from './classifyError';
import { reportError } from './errorReporter';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** フォールバック種別のオーバーライド */
  fallbackKind?: ErrorKind;
  /** エラー発生時のカスタムコールバック */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** 変更時に自動リセット（例: location.pathname） */
  resetKey?: string;
  /** ネスト時の名前（ログ識別用） */
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorKind: ErrorKind;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorKind: 'unknown' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorKind: classifyError(error),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const kind = this.props.fallbackKind ?? classifyError(error);
    const boundaryName = this.props.name ?? 'ErrorBoundary';

    // errorReporter 経由でレポート（PII除去・重複抑止済み）
    reportError(kind, error, 'boundary', info.componentStack ?? undefined, {
      boundaryName,
    });

    // カスタムコールバック
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // resetKey が変更されたらエラー状態をクリア（ルート遷移で自動復帰）
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false, error: null, errorKind: 'unknown' });
    }
  }

  /** 状態をリセットしてリトライ */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorKind: 'unknown' });
  };

  render() {
    if (this.state.hasError) {
      const kind = this.props.fallbackKind ?? this.state.errorKind;
      return (
        <ErrorPage
          kind={kind}
          message={extractErrorMessage(this.state.error)}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
