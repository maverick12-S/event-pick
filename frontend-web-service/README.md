## 🔹 api/
```ts
export const apiSignOut = ...
---

## 🛠 リファクタ実施ログ（今回の変更）

- `App.tsx` を `src/app/App.tsx` に移動して `src/app/index.ts` を作成しました。
	- 理由：`app/` を「アプリの組み立て層」として責務を明確化するため。
- `src/main.tsx` の `App` import を `./app` に変更しました。
- ヘッダー周りのスタイルを調整しました。
	- `Header.module.css` と `Logo.module.css` を編集し、上部バー風の見た目へ変更。
	- 日付/時刻を小さな丸パネルで表示する `datePanel` を追加。
	- `Header.tsx` の JSX を更新して `datePanel` を使用するようにしました。

これらの変更は命名と責務の一貫性を高め、画面作成・API連携・認証（Cognito など）追加の拡張性を改善します。

## ✅ 現状の判断 — アプリ開発の基礎は十分か？
---

## 🔐 トークン戦略設計（推奨）

目的：Amazon Cognito 等と連携する際のトークン保管・更新戦略を明文化し、フロント実装とサーバ実装の責務を分ける。

1) 保管方式の選択
- httpOnly Cookie（推奨）
	- 長所：XSS に対して安全。ブラウザが自動で cookie を送信するためフロントがアクセストークンを直接保持しない。
	- 短所：CSR の場合、CSRF 対策が必要（SameSite, CSRF トークン等）。API ドメイン設計や CORS 設定が必要。

- localStorage（簡易）
	- 長所：実装が簡単。アクセストークンを JS から直接参照可能。
	- 短所：XSS 攻撃に弱い。セキュリティリスクが高まるため、本番では推奨しない。

2) 推奨フロー（httpOnly cookie + short-lived access token）
- サーバ側で Cognito とやり取りし、`Set-Cookie: HttpOnly; Secure; SameSite=Strict` でリフレッシュトークンを保管。
- フロントは通常の API リクエストを行う（cookie が自動送信される）。必要に応じて Authorization ヘッダーは使用しない。
- 401 を検知したら `/auth/refresh` をサーバに POST し、サーバ側で cookie を参照して新しい access token を発行（cookie 更新）。

3) 実装上の注意点
- refresh の競合対策（refresh lock）：複数リクエストが同時に 401 を受けた際に並列で refresh を実行しない。
- トークンサービス抽象化：`src/api/tokenService.ts` のように storage 戦略を抽象化しておくと切り替えが容易。
- サーバは CORS、SameSite、Secure 属性を正しく設定すること。

4) 今回の実装
- `src/api/tokenService.ts` を追加し、`VITE_AUTH_USE_COOKIES` 環境変数で cookie ベース / localStorage ベースを切り替え可能にしました。
- `src/api/client.ts` のレスポンスインターセプターに refresh の排他制御（lock + queue）と簡易ログを追加しました。

---
- `contexts/` と `hooks/` の分離方針が定義されているため、認証状態や副作用の分離が容易です。

ただし「十分」から「完成」までには以下が必要です。

- テスト（ユニット／統合）と CI の導入
- Storybook やデザイントークンでの UI 一貫性チェック
- Amazon Cognito との実運用連携（環境変数管理、セキュアなトークン保管、リフレッシュ戦略の堅牢化）
- アクセシビリティとレスポンシブ調整の追加検証

総評：基礎（アーキテクチャ、通信基盤、共通コンポーネントの土台）はできています。次はテスト、CI、Cognito 統合を優先して進めると安全にスケールできます。

---

## 📝 役割整理（要約・視覚化）
以下は各ディレクトリの「目的」と「実装ルール」を短くまとめたものです。

- `api/` — インフラ層。axios インスタンス、インターセプター、共通ヘッダー、refresh token 処理を置く。UI を含めない。
- `assets/` — 静的リソース（画像・SVG・フォント）。ロジック禁止。
- `components/` — ドメイン非依存の共通UI（Button, Logo, Modal など）。業務ロジックを持たない。
- `contexts/` — React Context 定義のみ。状態共有は Hook に分離。
- `features/` — 機能単位で完結（api, components, hooks, screens を内包）。
- `hooks/` — 全体で使える汎用 Hook。feature 依存禁止。
- `layouts/` — 画面骨組み（Header, Sidebar, Footer）。Screen に骨組みを書かない。
- `lib/` — 汎用ユーティリティ（date formatter 等）。ビジネスロジック置かない。
- `routes/` — ルーティング定義。Screen の import のみ。
- `screens/` — Feature に属さない単発ページ（404 など）。
- `types/` — 全体共通の型定義。feature 固有型は feature 内に置く。

---

もしよければ、次に以下いずれを進めます：

- (A) Cognito 連携のためのトークン管理フロー設計と実装（api client の強化）
- (B) テストと CI の雛形追加（Jest + GitHub Actions）
- (C) Storybook 導入で UI コンポーネントのカタログ化

どれを優先しますか？
# Frontend Architecture Guide

このドキュメントは、React + TypeScript フロントエンドの
ディレクトリ構成と開発ルールを明確化し、
チーム開発および機能追加を円滑に進めるための設計指針です。

---

# 🎯 設計思想

本プロジェクトは **Feature-Driven Architecture** を採用しています。

- 機能単位でコードを完結させる
- 責務ごとにディレクトリを分離する
- UI統一のために軽量Design Systemを導入する
- スケール（30画面以上）を前提とする

---

# 📂 ディレクトリ構成
src/
app/
styles/
design-system/
features/
components/
contexts/
hooks/
layouts/
routes/
screens/
lib/
api/
types/
setupTests.ts


---

# 📁 各ディレクトリの役割

---

## 🔹 app/

アプリのエントリ責務。

- App.tsx
- main.tsx
- Provider統合
- ルーティングの起点

アプリ全体を束ねる役割のみを持つ。

---

## 🔹 styles/

グローバルCSS管理。

- index.css
- リセットCSS
- フォント定義

UIロジックは含めない。

---

## 🔹 design-system/

UIの統一を担う軽量Design System。
design-system/
components/
tokens/
index.ts


### components/
純粋なUI部品（ロジックを持たない）

- Button
- Input
- Modal

### tokens/
デザイン変数

- colors.ts
- spacing.ts

目的：
UIの統一と将来的な変更容易性を確保する。

---

## 🔹 features/

本プロジェクトの中核。

機能単位で完結させる。

例：
features/login/
api/
components/
hooks/
screens/


### api/
その機能専用のAPI処理

### components/
機能専用UI

### hooks/
機能専用ロジック

### screens/
画面コンポーネント

特徴：
- 機能削除が安全
- 影響範囲が明確
- チーム開発で衝突しにくい

---

## 🔹 components/

ドメイン非依存の共通UI部品。

例：
components/
auth/
logo/


Design Systemとは違い、
多少の業務ロジックを含む場合がある。

---

## 🔹 contexts/

React Context定義専用。

- AuthContext
- ThemeContext
- SidebarContext

ContextとHookは分離する。

---

## 🔹 hooks/

アプリ全体で使える共通Hook。

例：

- useAuth
- useDebounce

featureに依存しないもののみ。

---

## 🔹 layouts/

画面構造を司る。

例：

- DefaultLayout.tsx
- Header
- Sidebar
- Footer

画面実装に直接レイアウトを持たせない。

---

## 🔹 routes/

ルーティング定義専用。

- react-router設定
- ProtectedRoute
- RouteConfig

画面実装とは責務を分ける。

---

## 🔹 screens/

Featureに属さない単発ページ。

例：

- NotFoundScreen
- MaintenanceScreen

---

## 🔹 lib/

ユーティリティ・クライアント類。

例：

- date formatter
- storage helper
- firebase client

肥大化しやすいため早期分離。

---

## 🔹 api/

アプリ共通APIクライアント。

- axiosラッパー
- interceptor
- 認証ヘッダー付与
- firebase連携

例：

```ts
export const apiSignOut = ...

🔹 types/

アプリ全体で共有する型定義。

API Response

Domain Model

共通Interface
テスト戦略

テストは「各機能の横」に配置する。

例：

LoginForm.tsx
LoginForm.test.tsx

理由：

機能削除時にテストも安全に削除可能

影響範囲が明確

保守性が高い

別に tests/ ディレクトリは作らない。