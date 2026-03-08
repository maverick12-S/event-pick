Project の概要

- 目的: EventPick のフロントエンド — 機能拡張がしやすく、画面追加が容易な構成。
- デザイン/仕様: 機能実装時に視覚デザインや挙動を変更しないこと。既存のスタイルと UX は維持してください。

フォルダ構成（概要）

- `api`: アプリ共通の通信基盤（axios インスタンス、インターセプター、リフレッシュトークン処理）。インフラ層であり UI を含みません。
- `api/db`: モック用のDB定義レイヤー。画面で使う固定データの一次ソースを置き、UIから直接参照しないこと。
- `api/mock`: `api/db` を読み出して画面向けに返す取得レイヤー。将来の実APIに置き換える対象。
- `assets`: 画像・SVG・フォントなどの静的リソース。ロジックやコンポーネントは置かないでください。
- `components`: ドメイン非依存の共通 UI（Button、Logo、Modal、Input など）。業務ロジックを持たせないこと。
- `contexts`: React Context 定義（例: `AuthContext`、`ThemeContext`）。状態共有の器で、ロジックは hooks に分離します。
- `features`: 機能単位で完結するフォルダ（例: `features/login`）。内部に `api`、`components`、`hooks`、`screens` を持ちます。
- `features/*/styles`: 機能ローカルのデザイン定義（`sx` オブジェクト、トークン）を管理します。画面内に巨大なスタイル定義を残さないこと。
- `hooks`: アプリ全体で使う再利用可能なロジック（例: `useAuth`、`useDebounce`）。feature 依存を避けること。
- `layouts`: 画面の骨組み（例: `BaseLayout`、`Header`、`Footer`）。Screen に骨組みを直接書かないこと。
- `lib`: 汎用ユーティリティ（date フォーマッタ、storage helper など）。ビジネスロジックは置かない。
- `routes`: ルーティング定義（`react-router` 設定、ProtectedRoute 等）。Screen のみを import する。
- `screens`: feature に属さない単発ページ（404、500 等）。
- `types`: アプリ全体で使う共通型定義。feature 固有型は feature 内に置く。
- `app`: アプリの組み立て層（`App.tsx` など）。ビジネスロジックは書かない。
- `styles`: グローバル CSS（`index.css`、`app.css`）を管理。
- `main.tsx`: エントリーポイント。React の起動、Provider のラップ、グローバル CSS 読み込みを担当。

依存の流れ（守ること）

main.tsx → app/ → layouts/ → routes/ → features/ → components/hooks/api/lib

一方向依存を維持し、feature から上位へ依存しないこと。

責務ドキュメント

- ルート責務: `src/RESPONSIBILITIES.md`
- API層責務: `src/api/RESPONSIBILITIES.md`
- モックDB責務: `src/api/db/RESPONSIBILITIES.md`
- モック取得責務: `src/api/mock/RESPONSIBILITIES.md`
- 投稿機能責務: `src/features/posts/RESPONSIBILITIES.md`
- レポート機能責務: `src/features/reports/RESPONSIBILITIES.md`

投稿管理のデータ参照ルール

- 画面（`features/posts/screens`, `features/reports/screens`）では `api/db` を直接 import しない。
- 画面は `features/*/hooks` または `api/mock` の取得関数を経由してデータを受け取る。
- `api/db` は生データ定義のみ、加工・絞り込み・結合は `api/mock` に置く。
- 実API化時は `api/mock` の実装差し替えを優先し、画面側の変更を最小化する。

ログイン風の新規画面を追加する手順（ステップ）

1) feature フォルダ作成
- `features/yourFeature/` を作成し、サブフォルダ `api`、`components`、`hooks`、`screens` を追加します。

2) API 層
- `features/yourFeature/api/index.ts` を作成し、feature 固有の API 呼び出しを実装します。共通の axios インスタンスや interceptor、認証処理は `src/api` に置き、feature から利用してください。

3) コンポーネント
- UI 部品は `features/yourFeature/components` に入れ、CSS Modules（`*.module.css`）でスタイルを管理します。

4) フック（ロジック）
- `features/yourFeature/hooks/useYourFeature.ts` にロジックを実装します。非同期処理や API 呼び出しはここで完結させ、UI は props で受け取るだけにします。

5) スクリーン
- `features/yourFeature/screens/YourScreen.tsx` を作成し、画面の本体（タイトル、カードなど）だけを返すようにします。ヘッダー・フッター・背景などは `BaseLayout` が提供します。

6) ルーティング追加
- `routes/index.tsx` に lazy ロードでルートを追加します。例:

```tsx
const YourScreen = lazy(() => import('../features/yourFeature/screens/YourScreen'));
{
  path: '/your',
  element: <Suspense fallback={<SuspenseLoading />}><YourScreen /></Suspense>
}
```

7) スタイル
- コンポーネント単位で CSS Module を使用し、グローバルスタイルは可能な限り触らないこと。

8) ローカルテスト
- `npm run dev`（または `yarn dev`）で動作確認を行い、`BaseLayout` 内でヘッダー／フッター／背景との整合を確認してください。

コードテンプレート（最小）

- `features/yourFeature/screens/YourScreen.tsx` の例:

```tsx
import React from 'react';
import styles from './YourScreen.module.css';
import YourComponent from '../components/YourComponent';

const YourScreen: React.FC = () => {
  return (
    <>
      <div className={styles.titleSection}>タイトル</div>
      <div className={styles.card}><YourComponent /></div>
    </>
  );
};
export default YourScreen;
```

運用上のベストプラクティス

- 小さな PR を心がける（1 画面 / 1 機能ごと）。
- 再利用可能な UI は `components/` に切り出す。
- スタイルは局所化（CSS Modules）し、グローバル CSS は最小限に留める。
- Context には状態共有の責務のみを持たせ、ロジックは hooks に分離する。
- `features/login` の構成をコピーして新機能を作ると初期セットアップが速くなる。

アセットと背景画像に関して

- 実行時に絶対パスで参照する必要がある画像は `public/` に置くことを推奨します。
- バンドラ経由で確実に解決したい場合は `src/assets` に置き、import を使って参照してください。

変更タイミングのルール

- UI / デザインの変更はデザイナー承認後に行うこと。
- リファクタは振る舞いを壊さないよう小さいコミットで行い、理由をドキュメントすること。

次のステップ（提案）

- 要望があれば以下を自動で行います:
  - `features/new-login` をテンプレートに従ってスキャフォールド作成
  - 画面追加のテンプレートジェネレータ（CLI）の作成

---
この README はリポジトリの方針に合わせて日本語に差し替えられました。

商用リリースできるか？」の短い判断（要点のみ）:

可否: はい、現実的に商用リリース可能です。ただし下記の条件を満たす必要があります。
必須項目:
API スキーマの厳密な定義とランタイム検証（zot を全エンドポイントで適用）
エラーハンドリングと再試行・タイムアウト戦略（http.ts の既存実装を拡充）
セキュリティ（認証・認可・XSS/CSRF対策・秘密管理）
テスト（ユニット + E2E）、自動化された CI（型チェック・テスト・リント）
モニタリング／ロギング／アラート（Sentry / CloudWatch 等）
パフォーマンステスト（負荷、初回表示時間など）
インフラの堅牢化（ステージングで AWS との疎通確認、自動デプロイ、バックアップ、スケーリング）
リスク要因（早期対処推奨）:
バックエンドの API 仕様変更への追従（OpenAPI ベースで自動同期推奨）
トークン周りの競合・リフレッシュ失敗パスの未網羅
不十分なテストカバレッジによるリグレッション