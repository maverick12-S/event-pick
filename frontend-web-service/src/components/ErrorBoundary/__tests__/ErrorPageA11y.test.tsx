/**
 * ErrorPage — アクセシビリティ & 商用表示テスト
 * ─────────────────────────────────────────────
 * - focus 管理
 * - aria 属性
 * - keyboard 操作
 * - 本番/開発 表示差分
 * - リトライ連打防止
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ErrorPage from '../ErrorPage';
import type { ErrorKind } from '../ErrorPage';
import { ERROR_META } from '../ErrorPage';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/* ─────────────────────────────────────────────
   1. アクセシビリティ — 基本構造
   ───────────────────────────────────────────── */
describe('ErrorPage a11y — 基本構造', () => {
  it('role="alert" と aria-live="assertive" が設定されている', () => {
    render(<ErrorPage kind="unknown" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveAttribute('aria-atomic', 'true');
  });

  it('h1 見出しが存在する', () => {
    render(<ErrorPage kind="network" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('接続エラー');
  });

  it('エラーコードに aria-label が設定されている', () => {
    render(<ErrorPage kind="network" />);
    expect(screen.getByLabelText('エラーコード: ERR_NETWORK')).toBeInTheDocument();
  });

  it('アクションボタン群に role="group" と aria-label が設定されている', () => {
    render(<ErrorPage kind="unknown" />);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'エラー回復操作');
  });

  it('ボタンに aria-label が設定されている', () => {
    render(<ErrorPage kind="network" />);
    expect(screen.getByLabelText('もう一度試す')).toBeInTheDocument();
    expect(screen.getByLabelText('前のページへ戻る')).toBeInTheDocument();
  });

  it('auth の場合ログインページへの aria-label', () => {
    render(<ErrorPage kind="auth" />);
    expect(screen.getByLabelText('ログインページへ移動')).toBeInTheDocument();
  });

  it('アイコンは aria-hidden でスクリーンリーダーから非表示', () => {
    const { container } = render(<ErrorPage kind="unknown" />);
    const icon = container.querySelector('[role="img"]');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});

/* ─────────────────────────────────────────────
   2. アクセシビリティ — フォーカス管理
   ───────────────────────────────────────────── */
describe('ErrorPage a11y — フォーカス管理', () => {
  it('マウント時に h1 にフォーカスが移動する', () => {
    render(<ErrorPage kind="unknown" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(heading);
  });
});

/* ─────────────────────────────────────────────
   3. アクセシビリティ — キーボード操作
   ───────────────────────────────────────────── */
describe('ErrorPage a11y — キーボード操作', () => {
  it('Escape キーで戻る操作が実行される', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    Object.defineProperty(window.history, 'length', { value: 3, writable: true, configurable: true });

    render(<ErrorPage kind="unknown" />);

    fireEvent.keyDown(screen.getByRole('alert'), { key: 'Escape' });
    expect(backSpy).toHaveBeenCalledTimes(1);
    backSpy.mockRestore();
  });
});

/* ─────────────────────────────────────────────
   4. 本番/開発 表示差分
   ───────────────────────────────────────────── */
describe('ErrorPage — 開発/本番表示', () => {
  // vitest は DEV=true で動作するため開発モードのテストが行える
  it('開発環境では技術的詳細が表示される', () => {
    render(<ErrorPage kind="unknown" message="TypeError: Cannot read properties" />);
    expect(screen.getByText('開発者向け情報')).toBeInTheDocument();
    expect(screen.getByText('TypeError: Cannot read properties')).toBeInTheDocument();
  });

  it('message が空の場合は詳細セクションが表示されない', () => {
    render(<ErrorPage kind="unknown" />);
    expect(screen.queryByText('開発者向け情報')).not.toBeInTheDocument();
  });

  it('dev-details の data-testid が存在する', () => {
    render(<ErrorPage kind="unknown" message="error detail" />);
    expect(screen.getByTestId('dev-details')).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   5. リトライ連打防止
   ───────────────────────────────────────────── */
describe('ErrorPage — リトライ連打防止', () => {
  it('リトライボタンが連打で無効化される', () => {
    const handleRetry = vi.fn();
    render(<ErrorPage kind="network" onRetry={handleRetry} />);

    const button = screen.getByText('もう一度試す');

    // 1回目: 通常通り
    fireEvent.click(button);
    expect(handleRetry).toHaveBeenCalledTimes(1);

    // 2回目: disabled なので呼ばれない
    fireEvent.click(button);
    expect(handleRetry).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    // 1秒後に再び有効化
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(button).not.toBeDisabled();
  });
});

/* ─────────────────────────────────────────────
   6. 全エラー種別の ERROR_META カバレッジ
   ───────────────────────────────────────────── */
describe('ErrorPage — ERROR_META 全種別', () => {
  const kinds: ErrorKind[] = ['network', 'chunk', 'auth', 'forbidden', 'not-found', 'server', 'timeout', 'unknown'];

  it.each(kinds)('%s → 正しいメタ情報が表示される', (kind) => {
    render(<ErrorPage kind={kind} />);
    const meta = ERROR_META[kind];
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(meta.title);
    expect(screen.getByText(meta.code)).toBeInTheDocument();
    expect(screen.getByText(meta.description)).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   7. 操作ボタンの動作
   ───────────────────────────────────────────── */
describe('ErrorPage — ボタン動作', () => {
  it('onRetry が優先される', () => {
    const handleRetry = vi.fn();
    render(<ErrorPage kind="network" onRetry={handleRetry} />);
    fireEvent.click(screen.getByText('もう一度試す'));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('onReset がフォールバックとして使われる', () => {
    const handleReset = vi.fn();
    render(<ErrorPage kind="unknown" onReset={handleReset} />);
    fireEvent.click(screen.getByText('もう一度試す'));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('kind 省略時は unknown がデフォルト', () => {
    render(<ErrorPage />);
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });

  it('auth ボタンはログインページへ遷移', () => {
    const hrefSetter = vi.fn();
    const loc = { ...window.location };
    delete (loc as any).href;
    Object.defineProperty(loc, 'href', {
      get: () => '',
      set: hrefSetter,
      configurable: true,
    });
    Object.defineProperty(window, 'location', {
      value: loc, writable: true, configurable: true,
    });

    render(<ErrorPage kind="auth" />);
    fireEvent.click(screen.getByText('ログインページへ'));
    expect(hrefSetter).toHaveBeenCalledWith('/login');
  });
});
