import React from 'react';
import styles from './ErrorBoundary.module.css';

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // ロギングや外部送信をここに追加可能
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper} role="alert">
          <h1>予期せぬエラー!</h1>
          <p>申し訳ありません。問題を特定中です。ページを再読み込みしてください。</p>
          <details className={styles.details}>
            {this.state.error?.message}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
