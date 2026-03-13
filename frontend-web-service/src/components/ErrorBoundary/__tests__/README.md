# ErrorBoundary テストドキュメント

## 概要

エラーバウンダリーシステムの全 8 エラー種別に対するシミュレーションテスト。

## テスト実行

```bash
npx vitest run src/components/ErrorBoundary/__tests__/ErrorBoundary.test.tsx
```

## テスト構成 (68 テスト)

### 1. classifyError — エラー分類ロジック (34 tests)

| エラー種別 | テストパターン |
|---|---|
| `chunk` | `Loading chunk`, `dynamically imported module`, `module script failed`, `ChunkLoadError` name |
| `network` | `Network Error`, `Failed to fetch`, `Load failed`, `network request failed`, `ERR_NETWORK` code |
| `timeout` | `timeout exceeded`, `timed out`, `ECONNABORTED` code, `ERR_TIMEOUT` code |
| `auth` | `response.status 401`, `error.status 401`, `ERR_AUTH` code, `UNAUTHORIZED` code |
| `forbidden` | `response.status 403`, `FORBIDDEN` code |
| `not-found` | `response.status 404`, `NOT_FOUND` code |
| `server` | `response.status 500/502/503/504` |
| `unknown` | 一般 Error, `null`, `undefined`, 空オブジェクト |
| 優先順位 | chunk > network, timeout > network |

### 2. extractErrorMessage — メッセージ抽出 (5 tests)

| 入力 | 期待出力 |
|---|---|
| `Error` オブジェクト | `.message` |
| 文字列 | そのまま |
| オブジェクト | JSON 文字列 |
| `null` | `"null"` |
| 数値 | 文字列化 |

### 3. ErrorPage — 全種別の表示検証 (12 tests)

- 全 8 種別のタイトル・エラーコード・ボタンテキスト・「前のページへ戻る」表示
- 開発環境での技術的詳細表示
- `onRetry` コールバック発火
- `auth` → ログインページ遷移
- `kind` 省略時 → `unknown` デフォルト

### 4. ErrorBoundary — コンポーネント捕捉 (11 tests)

- レンダリングエラー捕捉 → ErrorPage 表示
- network / chunk / timeout / auth(401) / forbidden(403) / server(500) の自動分類
- `fallbackKind` prop によるオーバーライド
- `onError` コールバック発火
- リセットボタンで正常状態に復帰
- エラーなし → children そのまま表示

### 5. エッジケース (6 tests)

- 非 Error オブジェクト (文字列) の throw
- 複合条件 (network + status 503) → network 優先
- 未知ステータス (418) → unknown
- status 200 → unknown
- `error.status` (非 response) での分類
- 循環参照オブジェクトの安全処理
