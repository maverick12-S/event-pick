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