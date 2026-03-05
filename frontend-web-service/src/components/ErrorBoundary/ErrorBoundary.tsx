import React from 'react';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryState = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<Record<string, unknown>, ErrorBoundaryState> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        console.error('Uncaught error in component tree:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.wrapper} role="alert">
                    <h1>予期せぬエラー!</h1>
                    <p>申し訳ありません。問題を特定中です。ページを再読み込みしてください。</p>
                    <details className={styles.details}>{this.state.error?.message}</details>
                </div>
            );
        }
        return this.props.children as React.ReactNode;
    }
}
