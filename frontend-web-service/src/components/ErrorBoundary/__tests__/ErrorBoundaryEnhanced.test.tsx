/**
 * ErrorBoundary — 拡張機能テスト
 * ─────────────────────────────────────────────
 * - ネスト ErrorBoundary（内側→外側の順にキャッチ）
 * - resetKey による自動リセット
 * - errorReporter 連携
 * - 部分復旧
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { resetDedupCache, setErrorReportHandler } from '../errorReporter';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  resetDedupCache();
  setErrorReportHandler(null);
});

/* ─── テストヘルパー ─── */

const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
  throw error;
};

/* ─────────────────────────────────────────────
   1. ネスト ErrorBoundary
   ───────────────────────────────────────────── */
describe('ErrorBoundary — ネストサポート', () => {
  it('内側の ErrorBoundary が先にキャッチする', () => {
    render(
      <ErrorBoundary name="outer">
        <div>
          <div data-testid="sibling">兄弟コンテンツ</div>
          <ErrorBoundary name="inner">
            <ThrowError error={new Error('inner error')} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>,
    );

    // 内側がエラー表示
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();

    // 外側の兄弟コンテンツは表示されたまま
    expect(screen.getByTestId('sibling')).toBeInTheDocument();
    expect(screen.getByText('兄弟コンテンツ')).toBeInTheDocument();
  });

  it('内側のリセットで部分復旧ができる', () => {
    let shouldThrow = true;

    const MaybeThrow: React.FC = () => {
      if (shouldThrow) throw new Error('temporary');
      return <div>復旧済み</div>;
    };

    render(
      <ErrorBoundary name="outer">
        <div>
          <div data-testid="sibling">兄弟</div>
          <ErrorBoundary name="inner">
            <MaybeThrow />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>,
    );

    // エラー状態
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('兄弟')).toBeInTheDocument();

    // リセット
    shouldThrow = false;
    fireEvent.click(screen.getByText('もう一度試す'));

    expect(screen.getByText('復旧済み')).toBeInTheDocument();
    expect(screen.getByText('兄弟')).toBeInTheDocument();
  });

  it('外側に fallbackKind を設定すると内側のエラーも分類される', () => {
    render(
      <ErrorBoundary name="outer">
        <ErrorBoundary name="inner" fallbackKind="chunk">
          <ThrowError error={new Error('any error')} />
        </ErrorBoundary>
      </ErrorBoundary>,
    );

    expect(screen.getByText('ページ読み込みエラー')).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   2. resetKey による自動リセット
   ───────────────────────────────────────────── */
describe('ErrorBoundary — resetKey', () => {
  it('resetKey 変更でエラー状態がクリアされる', () => {
    let shouldThrow = true;

    const MaybeThrow: React.FC = () => {
      if (shouldThrow) throw new Error('reset test');
      return <div>復旧済み</div>;
    };

    const Wrapper: React.FC = () => {
      const [key, setKey] = useState('initial');
      return (
        <div>
          <button type="button" onClick={() => setKey('changed')}>キー変更</button>
          <ErrorBoundary resetKey={key}>
            <MaybeThrow />
          </ErrorBoundary>
        </div>
      );
    };

    render(<Wrapper />);

    // エラー状態
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // resetKey 変更でクリア
    shouldThrow = false;
    fireEvent.click(screen.getByText('キー変更'));

    expect(screen.getByText('復旧済み')).toBeInTheDocument();
  });

  it('resetKey が同じ値の場合はリセットされない', () => {
    const MaybeThrow: React.FC = () => {
      throw new Error('no reset');
    };

    const Wrapper: React.FC = () => {
      const [, setCounter] = useState(0);
      return (
        <div>
          <button type="button" onClick={() => setCounter((c) => c + 1)}>再レンダリング</button>
          <ErrorBoundary resetKey="same-key">
            <MaybeThrow />
          </ErrorBoundary>
        </div>
      );
    };

    render(<Wrapper />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // 再レンダリングしてもキーが同じなのでリセットされない
    fireEvent.click(screen.getByText('再レンダリング'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   3. errorReporter 連携
   ───────────────────────────────────────────── */
describe('ErrorBoundary — errorReporter 連携', () => {
  it('エラー時に外部ハンドラーが呼ばれる', () => {
    const handler = vi.fn();
    setErrorReportHandler(handler);

    render(
      <ErrorBoundary>
        <ThrowError error={new Error('reporter test')} />
      </ErrorBoundary>,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'unknown',
        source: 'boundary',
        meta: expect.objectContaining({ boundaryName: 'ErrorBoundary' }),
      }),
    );
  });

  it('name prop がメタデータに含まれる', () => {
    const handler = vi.fn();
    setErrorReportHandler(handler);

    render(
      <ErrorBoundary name="PageBoundary">
        <ThrowError error={new Error('named boundary')} />
      </ErrorBoundary>,
    );

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({ boundaryName: 'PageBoundary' }),
      }),
    );
  });

  it('onError コールバックも同時に呼ばれる', () => {
    const handler = vi.fn();
    setErrorReportHandler(handler);
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError error={new Error('dual callback')} />
      </ErrorBoundary>,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });
});

/* ─────────────────────────────────────────────
   4. 既存テストの互換性確認
   ───────────────────────────────────────────── */
describe('ErrorBoundary — 後方互換', () => {
  it('エラーなしの場合は children を表示', () => {
    render(
      <ErrorBoundary>
        <div>子コンテンツ</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('子コンテンツ')).toBeInTheDocument();
  });

  it('fallbackKind で分類をオーバーライド', () => {
    render(
      <ErrorBoundary fallbackKind="chunk">
        <ThrowError error={new Error('generic error')} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('ページ読み込みエラー')).toBeInTheDocument();
  });

  it('リセットボタンで正常状態に復帰', () => {
    let shouldThrow = true;
    const MaybeThrow: React.FC = () => {
      if (shouldThrow) throw new Error('temporary');
      return <div>正常コンテンツ</div>;
    };

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByText('もう一度試す'));
    expect(screen.getByText('正常コンテンツ')).toBeInTheDocument();
  });
});
