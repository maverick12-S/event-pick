/**
 * useAsyncErrorBoundary テスト
 * ─────────────────────────────────────────────
 * 非同期エラーが ErrorBoundary へ伝搬されるか検証。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { useAsyncErrorBoundary } from '../useAsyncErrorBoundary';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

/* ─── テスト用コンポーネント ─── */

/** useEffect 内で非同期エラーを throw */
const AsyncEffectThrower: React.FC<{ error: Error }> = ({ error }) => {
  const throwToErrorBoundary = useAsyncErrorBoundary();

  useEffect(() => {
    throwToErrorBoundary(error);
  }, [error, throwToErrorBoundary]);

  return <div>正常コンテンツ</div>;
};

/** ボタンクリックで非同期エラーを throw */
const AsyncClickThrower: React.FC<{ error: Error }> = ({ error }) => {
  const throwToErrorBoundary = useAsyncErrorBoundary();

  return (
    <button type="button" onClick={() => throwToErrorBoundary(error)}>
      クリック
    </button>
  );
};

/** Promise の catch から throw */
const AsyncPromiseThrower: React.FC = () => {
  const throwToErrorBoundary = useAsyncErrorBoundary();

  useEffect(() => {
    Promise.reject(new Error('Promise rejection test'))
      .catch(throwToErrorBoundary);
  }, [throwToErrorBoundary]);

  return <div>正常コンテンツ</div>;
};

/** 文字列エラーを throw */
const AsyncStringThrower: React.FC = () => {
  const throwToErrorBoundary = useAsyncErrorBoundary();

  useEffect(() => {
    throwToErrorBoundary('string error message');
  }, [throwToErrorBoundary]);

  return <div>正常コンテンツ</div>;
};

/* ─────────────────────────────────────────────
   テストスイート
   ───────────────────────────────────────────── */
describe('useAsyncErrorBoundary', () => {
  it('useEffect 内の非同期エラーが ErrorBoundary でキャッチされる', () => {
    render(
      <ErrorBoundary>
        <AsyncEffectThrower error={new Error('async effect error')} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });

  it('イベントハンドラの非同期エラーが ErrorBoundary でキャッチされる', () => {
    render(
      <ErrorBoundary>
        <AsyncClickThrower error={new Error('click handler error')} />
      </ErrorBoundary>,
    );

    // まだエラーは発生していない
    expect(screen.getByText('クリック')).toBeInTheDocument();

    // ボタンクリックでエラー発生
    fireEvent.click(screen.getByText('クリック'));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });

  it('Promise rejection が ErrorBoundary でキャッチされる', async () => {
    render(
      <ErrorBoundary>
        <AsyncPromiseThrower />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('文字列エラーが Error オブジェクトに変換される', () => {
    render(
      <ErrorBoundary>
        <AsyncStringThrower />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });

  it('ネットワークエラーが正しく分類される', () => {
    render(
      <ErrorBoundary>
        <AsyncEffectThrower error={new Error('Network Error')} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('接続エラー')).toBeInTheDocument();
    expect(screen.getByText('ERR_NETWORK')).toBeInTheDocument();
  });

  it('エラーなしの場合は正常にレンダリング', () => {
    const Normal: React.FC = () => {
      useAsyncErrorBoundary(); // 使うが throw しない
      return <div>正常動作</div>;
    };

    render(
      <ErrorBoundary>
        <Normal />
      </ErrorBoundary>,
    );

    expect(screen.getByText('正常動作')).toBeInTheDocument();
  });
});
