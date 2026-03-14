# EventPick — プロジェクト概要

## 1. サービス概要

EventPick は **法人向けイベント投稿・管理 SaaS** です。  
企業の拠点（拠点アカウント）が地域のイベント情報を作成・予約投稿し、一般ユーザーが閲覧・お気に入り登録できるプラットフォームを提供します。

### ターゲット
| 利用者 | 役割 |
|---|---|
| **企業（拠点アカウント）** | イベントの作成・予約投稿・レポート確認・チケット管理 |
| **一般ユーザー** | イベント閲覧・お気に入り登録 |
| **運営管理者（IMADMIN）** | 企業審査・ユーザー管理・クーポン・プラン・カテゴリ管理 |

### 収益モデル
- **サブスクリプション（月額プラン）**: LIGHT / STANDARD / PREMIUM の 3 プラン
- **チケット制投稿**: 日別・月別のチケット上限でイベント投稿数を制御
- Stripe 連携で決済・請求書管理

---

## 2. 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | React 19 + TypeScript 5.9 |
| ビルド | Vite 7 |
| UI | MUI 7 + CSS Modules |
| データ取得 | @tanstack/react-query 5 |
| HTTP | Axios（CSRF / JWT Bearer / Token Refresh 対応） |
| バリデーション | Zod 4 + カスタム `useFormValidation` フック |
| ルーティング | React Router 7（Lazy loading） |
| テスト | Vitest + Testing Library + jsdom |
| Lint | ESLint 9 (flat config) |
| 本番デプロイ | Docker（multi-stage: node build → nginx） |
| API 仕様 | OpenAPI 3.0.3（2,180 行、全 98 エンドポイント定義済み） |

---

## 3. プロジェクト規模

| 指標 | 数値 |
|---|---|
| TypeScript ファイル数 | 235 |
| 総行数 (src/) | 35,414 行 |
| 画面数 | 47 |
| コンポーネント数 | 26 |
| カスタムフック数 | 25 |
| テストファイル数 | 9（354 テストケース） |
| 型定義ファイル数 | 47（エンティティ / DTO / スキーマ） |
| API エンドポイント数 | 98 |
| Mock API モジュール数 | 10 |

---

## 4. アーキテクチャ

### 4.1 ディレクトリ構造

```
src/
├── api/             # API 層
│   ├── endpoints.ts # 全エンドポイント定義
│   ├── http.ts      # Axios クライアント（JWT / CSRF / Refresh）
│   ├── client.ts    # エンティティ別 API 関数
│   ├── services.ts  # React Query ベースの API サービス
│   ├── tokenService.ts  # トークン管理（Cookie / localStorage 切替）
│   ├── db/          # Mock データベース層
│   └── mock/        # Mock API 層（db → mock → hooks の中間）
├── app/             # アプリルート (App.tsx)
├── components/      # 共通コンポーネント（Header, Footer, ErrorBoundary 等）
├── contexts/        # React Context (AuthContext)
├── features/        # ドメイン別機能モジュール
│   ├── accounts/    # アカウント管理（一覧・発行・編集）
│   ├── admin/       # 運営管理画面
│   ├── dashboard/   # ダッシュボード
│   ├── events/      # イベント
│   ├── home/        # ホーム画面
│   ├── login/       # ログイン・サインアップ・MFA
│   ├── notifications/ # 通知
│   ├── plan/        # プラン選択
│   ├── posts/       # 投稿管理（作成・一覧・予約・下書き）
│   ├── reports/     # レポート
│   └── settings/    # 設定（アカウント・請求・履歴・通知・お問い合わせ）
├── layouts/         # レイアウト (BaseLayout)
├── lib/             # ユーティリティ（バリデーション・サニタイズ）
├── routes/          # ルーティング定義（ProtectedRoute / OperatorRoute）
├── styles/          # グローバル CSS / テーマ
└── types/           # 型定義
    ├── entities/    # DB エンティティ型（26 テーブル対応）
    ├── dto/         # リクエスト / レスポンス DTO
    ├── models/      # UI モデル
    └── schemas/     # Zod バリデーションスキーマ
```

### 4.2 データフロー（Mock → 本番 API 移行設計）

```
api/db/          → api/mock/         → features/*/hooks/  → features/*/screens/
(Mock データ)      (Mock API 関数)      (React Query フック)   (画面コンポーネント)
                        ↓                      ↓
                  将来: api/client.ts    (Hook 内の関数呼替のみで
                  (実 API 呼び出し)       画面コードは変更不要)
```

**設計方針**: 全 47 画面が Mock API を直接参照せず、Hook 経由でデータ取得する。API 移行時は Hook 内の 1 行（関数参照）を差し替えるだけで完了。

### 4.3 認証・セキュリティ

- **JWT Bearer 認証**: `tokenService` で Cookie / localStorage を環境変数で切替
- **CSRF 保護**: Axios `xsrfCookieName` / `xsrfHeaderName` でサーバーの `XSRF-TOKEN` Cookie を自動送信
- **Token Refresh**: 401 レスポンス時に自動リフレッシュ + 並行リクエストのキューイング
- **入力サニタイズ**: `sanitize.ts` で XSS / SQLi / コマンドインジェクションをフロント側でブロック
- **Zod バリデーション**: `useFormValidation` フックで全フォームを統一バリデーション
- **ルートガード**: `ProtectedRoute`（認証必須）/ `OperatorRoute`（管理者権限必須）
- **ErrorBoundary**: グローバルエラーキャッチ + リトライ + ユーザー通知

---

## 5. 主要機能一覧

### 5.1 企業向け機能
| 機能 | 画面数 | 説明 |
|---|---|---|
| ログイン / サインアップ | 5 | 法人番号バリデーション・MFA・パスワードリセット |
| ホーム | 1 | ダッシュボード概要 |
| アカウント管理 | 5 | 拠点アカウント一覧・発行・編集・削除予約 |
| イベント投稿 | 6 | 作成・編集・予約投稿・下書き・プレビュー |
| 予約投稿管理 | 3 | 一覧・編集・削除 |
| レポート | 4 | サマリー・アカウント別・イベント別詳細 |
| 設定 | 7 | アカウント情報・請求先・履歴・通知・お問い合わせ |
| プラン | 2 | プラン選択・Stripe 決済 |
| チケット | — | ヘッダーに日別/月別残量表示 |

### 5.2 運営管理画面
| 機能 | 画面数 | 説明 |
|---|---|---|
| 企業管理 | 3 | 一覧・詳細・審査（承認/却下） |
| ユーザー管理 | 4 | 一般ユーザー・拠点アカウント・停止・削除予約 |
| イベント管理 | 2 | 一覧・非公開/削除 |
| レビュー管理 | 2 | 一覧・承認/却下 |
| クーポン管理 | 1 | 作成・削除 |
| カテゴリ / プラン | 2 | マスタ管理 |
| お問い合わせ | 2 | 一覧・返信・クローズ |
| ログ / 監査 | 3 | 認証ログ・アクティビティログ・監査ログ |
| 設定 | 1 | サイト設定・管理者パスワード変更 |

---

## 6. API 移行ガイド

### 6.1 概要

現在フロントエンドは Mock データで完全動作しています。本番 API への移行は以下の手順で行います。

### 6.2 手順

1. **バックエンド API 構築**: `openapi.yaml` に定義された 98 エンドポイントを実装
2. **環境変数設定**: `VITE_API_BASE_URL` を実 API サーバーに向ける
3. **Hook 内の関数差替**: 各 `use*.ts` フックの Mock API 呼び出しを `apiClient` 呼び出しに変更

```ts
// Before (Mock)
export const usePostManagement = () => {
  return useQuery({
    queryKey: ['postManagement'],
    queryFn: () => postManagementApi.fetchAll(),
  });
};

// After (Real API)
export const usePostManagement = () => {
  return useQuery({
    queryKey: ['postManagement'],
    queryFn: () => apiClient.get('/api/v1/events').then(r => r.data.data),
  });
};
```

4. **Mock 削除**: `api/db/` と `api/mock/` を削除（画面コードの変更不要）

### 6.3 認証切替

`VITE_AUTH_USE_COOKIES=true` に設定すると、`tokenService` が httpOnly Cookie ベースの認証に自動切替。

---

## 7. 開発コマンド

```bash
# 開発サーバー
npm run dev

# ビルド（TypeScript チェック → Vite 本番ビルド）
npm run build

# テスト
npm test              # 1回実行
npm run test:watch    # ウォッチモード

# Lint
npm run lint

# プレビュー（ビルド後の本番サーバー確認）
npm run preview
```

---

## 8. 本番デプロイ

### Dockerfile
```
# Multi-stage build
node:20-alpine → npm ci → npm run build → nginx:1.27-alpine
```

- **ビルドステージ**: TypeScript コンパイル + Vite 本番ビルド
- **配信ステージ**: nginx でスタティック配信 + SPA フォールバック
- セキュリティヘッダー自動付与（X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy）
- 静的アセットに 1 年キャッシュ

### AWS 構成例
```
Route53 → CloudFront → ALB → ECS Fargate (nginx)
                              ↕
                        ECS Fargate (API: Node/Go/etc.)
                              ↕
                        RDS Aurora + ElastiCache + S3
```

---

## 9. 商用リリースまでの残作業

### フロントエンド ✅ 完了


### バックエンド（未実装）
- [ ] API サーバー構築（98 エンドポイント）
- [ ] データベース設計・マイグレーション（26 テーブル）
- [ ] Keycloak / Cognito 認証統合
- [ ] Stripe 決済連携
- [ ] S3 メディアアップロード
- [ ] CSRF トークン Cookie 発行

### インフラ（未実装）
- [ ] AWS 環境構築（VPC / ECS / RDS / CloudFront / S3）
- [ ] CI/CD パイプライン
- [ ] ドメイン・SSL 設定
- [ ] 監視・ログ（CloudWatch / Sentry）

