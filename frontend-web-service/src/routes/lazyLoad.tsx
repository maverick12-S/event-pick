import React, { lazy } from 'react';
import type { ReactElement } from 'react';
import SuspenseLoading from '../components/SuspenseWeather/SuspenseLoading';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import { reportError } from '../components/ErrorBoundary/errorReporter';

/**
 * 遅延読み込みヘルパ。
 * - React.lazy でコード分割
 * - チャンク読み込み失敗時に1回だけ自動リトライ
 * - ErrorBoundary でフォールバック表示
 * - リトライ失敗は errorReporter へ送信
 */
const lazyWithRetry = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return lazy(() =>
    importFn().catch((error) => {
      // チャンク読み込み失敗時、1回だけリトライ（デプロイ直後のキャッシュ不整合対策）
      const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Loading CSS chunk') ||
        error?.name === 'ChunkLoadError';

      if (isChunkError) {
        reportError('chunk', error, 'async', undefined, { retryAttempt: 1 });
        return importFn();
      }
      throw error;
    }),
  );
};

export const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>): ReactElement => {
  const Component = lazyWithRetry(importFn) as React.LazyExoticComponent<React.ComponentType<any>>;
  return (
    <ErrorBoundary fallbackKind="chunk" name="LazyLoadBoundary">
      <SuspenseLoading>
        <Component />
      </SuspenseLoading>
    </ErrorBoundary>
  );
};

export default lazyLoad;
