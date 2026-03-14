/**
 * ErrorBoundary シミュレーションテスト
 * ─────────────────────────────────────────────
 * 全 8 種類のエラーを発生させ、classifyError が正しく分類し、
 * ErrorBoundary / ErrorPage が適切に表示されることを検証する。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ErrorPage from '../ErrorPage';
import type { ErrorKind } from '../ErrorPage';
import { classifyError, extractErrorMessage } from '../classifyError';

/* ─────────────────────────────────────────────
   1. classifyError ユニットテスト
      全エラーパターンの分類を網羅検証
   ───────────────────────────────────────────── */
describe('classifyError — エラー分類ロジック', () => {
  // ── chunk (遅延読み込み失敗) ──
  it.each([
    'Failed to fetch dynamically imported module /src/pages/Foo.tsx',
    'Loading chunk abc123 failed',
    'Loading CSS chunk xyz789 failed',
    'Importing a module script failed',
  ])('chunk: "%s" → chunk', (msg) => {
    expect(classifyError(new Error(msg))).toBe('chunk');
  });

  it('chunk: ChunkLoadError name → chunk', () => {
    const err = new Error('chunk error');
    err.name = 'ChunkLoadError';
    expect(classifyError(err)).toBe('chunk');
  });

  // ── network (ネットワーク障害) ──
  it.each([
    'Network Error',
    'NetworkError when attempting to fetch resource',
    'Failed to fetch',
    'Load failed',
    'network request failed',
  ])('network: "%s" → network', (msg) => {
    expect(classifyError(new Error(msg))).toBe('network');
  });

  it('network: Axios ERR_NETWORK → network', () => {
    const err: any = new Error('ERR_NETWORK');
    err.code = 'ERR_NETWORK';
    expect(classifyError(err)).toBe('network');
  });

  // ── timeout ──
  it.each([
    'timeout of 15000ms exceeded',
    'Request timed out',
    'The operation timed out',
  ])('timeout: "%s" → timeout', (msg) => {
    expect(classifyError(new Error(msg))).toBe('timeout');
  });

  it('timeout: ECONNABORTED code → timeout', () => {
    const err: any = new Error('conn aborted');
    err.code = 'ECONNABORTED';
    expect(classifyError(err)).toBe('timeout');
  });

  it('timeout: ERR_TIMEOUT code → timeout', () => {
    const err: any = new Error('timeout');
    err.code = 'ERR_TIMEOUT';
    expect(classifyError(err)).toBe('timeout');
  });

  // ── auth (401) ──
  it('auth: response.status 401 → auth', () => {
    const err: any = new Error('Unauthorized');
    err.response = { status: 401 };
    expect(classifyError(err)).toBe('auth');
  });

  it('auth: error.status 401 → auth', () => {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    expect(classifyError(err)).toBe('auth');
  });

  it('auth: code ERR_AUTH → auth', () => {
    const err: any = new Error('auth error');
    err.code = 'ERR_AUTH';
    expect(classifyError(err)).toBe('auth');
  });

  it('auth: code UNAUTHORIZED → auth', () => {
    const err: any = new Error('auth error');
    err.code = 'UNAUTHORIZED';
    expect(classifyError(err)).toBe('auth');
  });

  // ── forbidden (403) ──
  it('forbidden: response.status 403 → forbidden', () => {
    const err: any = new Error('Forbidden');
    err.response = { status: 403 };
    expect(classifyError(err)).toBe('forbidden');
  });

  it('forbidden: code FORBIDDEN → forbidden', () => {
    const err: any = new Error('forbidden');
    err.code = 'FORBIDDEN';
    expect(classifyError(err)).toBe('forbidden');
  });

  // ── not-found (404) ──
  it('not-found: response.status 404 → not-found', () => {
    const err: any = new Error('Not Found');
    err.response = { status: 404 };
    expect(classifyError(err)).toBe('not-found');
  });

  it('not-found: code NOT_FOUND → not-found', () => {
    const err: any = new Error('not found');
    err.code = 'NOT_FOUND';
    expect(classifyError(err)).toBe('not-found');
  });

  // ── server (5xx) ──
  it.each([500, 502, 503, 504])('server: response.status %d → server', (status) => {
    const err: any = new Error('Server Error');
    err.response = { status };
    expect(classifyError(err)).toBe('server');
  });

  // ── unknown (フォールバック) ──
  it('unknown: 一般的な Error → unknown', () => {
    expect(classifyError(new Error('Something went wrong'))).toBe('unknown');
  });

  it('unknown: null → unknown', () => {
    expect(classifyError(null)).toBe('unknown');
  });

  it('unknown: undefined → unknown', () => {
    expect(classifyError(undefined)).toBe('unknown');
  });

  it('unknown: 空オブジェクト → unknown', () => {
    expect(classifyError({})).toBe('unknown');
  });

  // ── 優先順位テスト ──
  it('chunk は network より優先（"failed to fetch" はチャンク読み込みで出ることがある）', () => {
    // チャンクエラーには "Failed to fetch dynamically imported module" が含まれるため chunk
    const err = new Error('Failed to fetch dynamically imported module /assets/page.js');
    expect(classifyError(err)).toBe('chunk');
  });

  it('timeout は network より優先', () => {
    const err: any = new Error('Request timeout exceeded');
    err.code = 'ECONNABORTED';
    expect(classifyError(err)).toBe('timeout');
  });
});

/* ─────────────────────────────────────────────
   2. extractErrorMessage ユニットテスト
   ───────────────────────────────────────────── */
describe('extractErrorMessage — メッセージ抽出', () => {
  it('Error オブジェクト → message プロパティ', () => {
    expect(extractErrorMessage(new Error('foo'))).toBe('foo');
  });

  it('文字列 → そのまま返す', () => {
    expect(extractErrorMessage('bar')).toBe('bar');
  });

  it('オブジェクト → JSON 文字列', () => {
    expect(extractErrorMessage({ code: 'ERR' })).toBe('{"code":"ERR"}');
  });

  it('null → "null" 文字列', () => {
    expect(extractErrorMessage(null)).toBe('null');
  });

  it('number → 文字列化', () => {
    expect(extractErrorMessage(42)).toBe('42');
  });
});

/* ─────────────────────────────────────────────
   3. ErrorPage 直接レンダリングテスト
      全 8 種別の UI 表示を検証
   ───────────────────────────────────────────── */
describe('ErrorPage — 全エラー種別の表示検証', () => {
  const ERROR_KINDS: { kind: ErrorKind; expectedTitle: string; expectedCode: string; expectedButton: string }[] = [
    { kind: 'network',    expectedTitle: '接続エラー',             expectedCode: 'ERR_NETWORK',     expectedButton: 'もう一度試す' },
    { kind: 'chunk',      expectedTitle: 'ページ読み込みエラー',    expectedCode: 'ERR_CHUNK_LOAD',  expectedButton: 'ページを再読み込み' },
    { kind: 'auth',       expectedTitle: '認証エラー',             expectedCode: 'ERR_AUTH',        expectedButton: 'ログインページへ' },
    { kind: 'forbidden',  expectedTitle: 'アクセス権限がありません', expectedCode: 'ERR_FORBIDDEN',   expectedButton: 'もう一度試す' },
    { kind: 'not-found',  expectedTitle: 'ページが見つかりません',   expectedCode: 'ERR_NOT_FOUND',   expectedButton: 'もう一度試す' },
    { kind: 'server',     expectedTitle: 'サーバーエラー',          expectedCode: 'ERR_SERVER',      expectedButton: 'もう一度試す' },
    { kind: 'timeout',    expectedTitle: 'タイムアウト',            expectedCode: 'ERR_TIMEOUT',     expectedButton: 'もう一度試す' },
    { kind: 'unknown',    expectedTitle: '予期しないエラー',         expectedCode: 'ERR_UNKNOWN',     expectedButton: 'もう一度試す' },
  ];

  it.each(ERROR_KINDS)(
    '$kind → タイトル "$expectedTitle"、コード "$expectedCode"、ボタン "$expectedButton"',
    ({ kind, expectedTitle, expectedCode, expectedButton }) => {
      render(<ErrorPage kind={kind} message="test error detail" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      expect(screen.getByText(expectedCode)).toBeInTheDocument();
      expect(screen.getByText(expectedButton)).toBeInTheDocument();
      expect(screen.getByText('前のページへ戻る')).toBeInTheDocument();
    },
  );

  it('開発環境では技術的詳細が表示される', () => {
    render(<ErrorPage kind="unknown" message="TypeError: Cannot read properties of undefined" />);
    expect(screen.getByText('開発者向け情報')).toBeInTheDocument();
    expect(screen.getByText('TypeError: Cannot read properties of undefined')).toBeInTheDocument();
  });

  it('onRetry コールバックが呼ばれる', () => {
    const handleRetry = vi.fn();
    render(<ErrorPage kind="network" onRetry={handleRetry} />);
    fireEvent.click(screen.getByText('もう一度試す'));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('auth のボタンはログインページへリンク', () => {
    // window.location.href の書き込みをインターセプト
    const hrefSetter = vi.fn();
    const loc = { ...window.location };
    delete (loc as any).href;
    Object.defineProperty(loc, 'href', {
      get() { return ''; },
      set(v: string) { hrefSetter(v); },
      configurable: true,
    });
    Object.defineProperty(window, 'location', {
      value: loc,
      writable: true,
    });

    render(<ErrorPage kind="auth" />);
    fireEvent.click(screen.getByText('ログインページへ'));
    expect(hrefSetter).toHaveBeenCalledWith('/login');
  });

  it('kind 省略時は unknown をデフォルトとする', () => {
    render(<ErrorPage />);
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   4. ErrorBoundary コンポーネントテスト
      実際にエラーを throw して捕捉されるか検証
   ───────────────────────────────────────────── */
describe('ErrorBoundary — コンポーネントツリーエラー捕捉', () => {
  // テスト中の console.error 出力を抑制
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  /** レンダリング中にエラーを投げるテスト用コンポーネント */
  const ThrowError: React.FC<{ error: Error }> = ({ error }) => {
    throw error;
  };

  it('レンダリングエラーを捕捉して ErrorPage を表示', () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error('Render crash!')} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();
  });

  it('ネットワークエラーを正しく分類して表示', () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error('Network Error')} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('接続エラー')).toBeInTheDocument();
    expect(screen.getByText('ERR_NETWORK')).toBeInTheDocument();
  });

  it('チャンクエラーを正しく分類して表示', () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error('Failed to fetch dynamically imported module /assets/page.js')} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('ページ読み込みエラー')).toBeInTheDocument();
    expect(screen.getByText('ERR_CHUNK_LOAD')).toBeInTheDocument();
  });

  it('タイムアウトエラーを正しく分類して表示', () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error('timeout of 15000ms exceeded')} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('タイムアウト')).toBeInTheDocument();
    expect(screen.getByText('ERR_TIMEOUT')).toBeInTheDocument();
  });

  it('401 エラーを auth として分類', () => {
    const err: any = new Error('Unauthorized');
    err.response = { status: 401 };

    render(
      <ErrorBoundary>
        <ThrowError error={err} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('認証エラー')).toBeInTheDocument();
    expect(screen.getByText('ログインページへ')).toBeInTheDocument();
  });

  it('403 エラーを forbidden として分類', () => {
    const err: any = new Error('Forbidden');
    err.response = { status: 403 };

    render(
      <ErrorBoundary>
        <ThrowError error={err} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('アクセス権限がありません')).toBeInTheDocument();
  });

  it('500 エラーを server として分類', () => {
    const err: any = new Error('Internal Server Error');
    err.response = { status: 500 };

    render(
      <ErrorBoundary>
        <ThrowError error={err} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('サーバーエラー')).toBeInTheDocument();
  });

  it('fallbackKind prop で分類をオーバーライドできる', () => {
    render(
      <ErrorBoundary fallbackKind="chunk">
        <ThrowError error={new Error('any error')} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('ページ読み込みエラー')).toBeInTheDocument();
  });

  it('onError コールバックが呼ばれる', () => {
    const handleError = vi.fn();
    const error = new Error('callback test');

    render(
      <ErrorBoundary onError={handleError}>
        <ThrowError error={error} />
      </ErrorBoundary>,
    );

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('リセットボタンで正常状態に復帰できる', () => {
    let shouldThrow = true;

    const MaybeThrow: React.FC = () => {
      if (shouldThrow) throw new Error('temporary error');
      return <div>正常コンテンツ</div>;
    };

    const { unmount } = render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    // エラー捕捉されている
    expect(screen.getByText('予期しないエラー')).toBeInTheDocument();

    // エラーを解消してリセット
    shouldThrow = false;
    fireEvent.click(screen.getByText('もう一度試す'));

    // 正常コンテンツが表示される
    expect(screen.getByText('正常コンテンツ')).toBeInTheDocument();

    unmount();
  });

  it('エラーなしの場合は children をそのまま表示', () => {
    render(
      <ErrorBoundary>
        <div>子コンテンツ</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('子コンテンツ')).toBeInTheDocument();
  });
});

/* ─────────────────────────────────────────────
   5. エッジケース・境界値テスト
   ───────────────────────────────────────────── */
describe('エッジケース', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('非 Error オブジェクト（文字列）が throw されても正しく処理', () => {
    const ThrowString: React.FC = () => {
      throw 'string error' as unknown as Error;
    };

    render(
      <ErrorBoundary>
        <ThrowString />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('複合条件エラー: ネットワークエラー + status 503', () => {
    const err: any = new Error('Network Error');
    err.response = { status: 503 };
    // ネットワーク判定が先なので network が優先
    expect(classifyError(err)).toBe('network');
  });

  it('HTTP status 418 (未知のステータス) → unknown', () => {
    const err: any = new Error('I am a teapot');
    err.response = { status: 418 };
    expect(classifyError(err)).toBe('unknown');
  });

  it('HTTP status 200 は valid だがエラーとは分類しない → unknown', () => {
    const err: any = new Error('weird but 200');
    err.response = { status: 200 };
    expect(classifyError(err)).toBe('unknown');
  });

  it('error.status (非 response) でも分類可能', () => {
    const err: any = new Error('Not found');
    err.status = 404;
    expect(classifyError(err)).toBe('not-found');
  });

  it('循環参照を含むエラーでも extractErrorMessage がクラッシュしない', () => {
    const circular: any = {};
    circular.self = circular;
    const result = extractErrorMessage(circular);
    expect(typeof result).toBe('string');
  });
});
