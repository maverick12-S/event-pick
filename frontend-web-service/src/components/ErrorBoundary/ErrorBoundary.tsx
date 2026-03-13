/**
 * ErrorBoundary
 * ─────────────────────────────────────────────
 * React コンポーネントツリー内のランタイムエラーをキャッチし、
 * エラー種別に応じた ErrorPage を表示する。
 *
 * - 子コンポーネントのレンダリングエラー全般を捕捉
 * - チャンク読み込み失敗を自動判定してリロード誘導
 * - リセット可能（再試行ボタン）
 */

import React from 'react';
import ErrorPage from './ErrorPage';
import type { ErrorKind } from './ErrorPage';
import { classifyError, extractErrorMessage } from './classifyError';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** フォールバック種別のオーバーライド */
  fallbackKind?: ErrorKind;
  /** エラー発生時のカスタムコールバック */
  onError?: (error: Error, info: React.ErrorInfo) => void;
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
    // 本番ではエラーレポーティングサービスへ送信
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
    this.props.onError?.(error, info);
  }

  /** 状態をリセットしてリトライ */
  private handleReset = () => {
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
