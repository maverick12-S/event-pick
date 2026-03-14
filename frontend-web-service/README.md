Project の概要

EventPick フロントエンド Web サービス。Feature-based design で構成され、保守性・拡張性に優れたアーキテクチャ。

- 目的: EventPick のフロントエンド — 機能拡張がしやすく、画面追加が容易な構成。
- デザイン/仕様: 機能実装時に視覚デザインや挙動を変更しないこと。既存のスタイルと UX は維持してください。

フォルダ構成（概要）

- `api`: アプリ共通の通信基盤（axios インスタンス、インターセプター、リフレッシュトークン処理）。インフラ層であり UI を含みません。
- `api/db`: モック用のDB定義レイヤー。画面で使う固定データの一次ソースを置き、UIから直接参照しないこと。**型定義は `types/models/` に集約済み。** `db` は re-export のみ。
- `api/mock`: `api/db` を読み出して画面向けに返す取得レイヤー。将来の実APIに置き換える対象。**型定義は `types/models/` から import。**
- `assets`: 画像・SVG・フォントなどの静的リソース。ロジックやコンポーネントは置かないでください。
- `components`: ドメイン非依存の共通 UI（Button、Logo、Modal、Input、ErrorBoundary など）。業務ロジックを持たせないこと。
- `contexts`: React Context 定義（例: `AuthContext`、`ThemeContext`）。状態共有の器で、ロジックは hooks に分離します。
- `features`: 機能単位で完結するフォルダ（例: `features/login`）。内部に `api`、`components`、`hooks`、`screens` を持ちます。
- `features/*/styles`: 機能ローカルのデザイン定義（`sx` オブジェクト、トークン）を管理します。画面内に巨大なスタイル定義を残さないこと。
- `hooks`: アプリ全体で使う再利用可能なロジック（例: `useAuth`、`useDebounce`）。feature 依存を避けること。
- `layouts`: 画面の骨組み（例: `BaseLayout`、`Header`、`Footer`）。Screen に骨組みを直接書かないこと。
- `lib`: 汎用ユーティリティ（date フォーマッタ、storage helper、**zodUtils** など）。ビジネスロジックは置かない。
- `routes`: ルーティング定義（`react-router` 設定、ProtectedRoute 等）。Screen のみを import する。
- `screens`: feature に属さない単発ページ（404、500 等）。
- `types`: アプリ全体で使う共通型定義。feature 固有型は feature 内に置く。
- `types/models`: **全ドメインモデルの型定義（唯一の型ソース）。** feature / api どちらもここから import する。
- `types/schemas`: **Zod スキーマ定義。** `types/models` と一対一対応し、ランタイム検証に使用。
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
- エラーバウンダリーテスト: `src/components/ErrorBoundary/__tests__/README.md`

型定義システム（types/models + Zod）

型の一元管理:
- 全ドメインモデル型は `types/models/` に集約。`api/db` や `api/mock` には型を定義しない。
- `api/db/` は `types/models/` の型を re-export し、モックデータのみを管理。
- feature の画面・hooks・コンポーネントは `types/models/` から型を import する。

```
types/models/          ← 唯一の型ソース (手書き TypeScript 型)
  ├── account.ts       AccountStatus, ContractPlan, BaseAccountItem
  ├── accountQuery.ts  AccountsSortKey, GetAccountsParams
  ├── post.ts          PostsTabKey, PostEventDbItem
  ├── postDraft.ts     PostDraftPayload, PostDraftItem
  ├── postSort.ts      PostListSortKey
  ├── scheduledPost.ts PostCondition, ScheduledPostItem
  ├── report.ts        ReportSortKey, ReportListItem
  ├── reportDetail.ts  ReportMetricKey, DemographicAccountBlock, ReportDetailItem
  ├── reportSummary.ts ReportAggregateSummary
  ├── billing.ts       BillingData, BillingAddress, Invoice, etc.
  ├── executionHistory.ts ExecutionHistoryCategory, ExecutionHistoryItem
  └── index.ts         集約 re-export
```

Zod スキーマ:
- `types/schemas/` に Zod スキーマを定義。`types/models/` の手書き型と一対一対応。
- ランタイム検証（API レスポンス、フォーム入力）に使用。
- `lib/zodUtils.ts` に parse / safeParse / flattenErrors ヘルパーを提供。

```
types/schemas/
  ├── account.schema.ts  ← BaseAccountItem のバリデーション
  ├── auth.schema.ts     ← LoginRequest/Response バリデーション
  ├── billing.schema.ts  ← 請求データのバリデーション
  └── index.ts           ← 集約 re-export
```

使い方の例:
```tsx
import { loginRequestSchema } from '../types/schemas';
import { safeParse, flattenErrors } from '../lib/zodUtils';

const result = safeParse(loginRequestSchema, formData);
if (!result.success) {
  const errors = flattenErrors(result.error);
  // { username: '必須項目です', password: '必須項目です' }
}
```

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
API スキーマの厳密な定義とランタイム検証（**Zod** を全エンドポイントで適用 — `types/schemas/` に準備済み）
エラーハンドリングと再試行・タイムアウト戦略（http.ts の既存実装 + ErrorBoundary 8 種対応済み）
セキュリティ（認証・認可・XSS/CSRF対策・秘密管理）
テスト（ユニット + E2E）、自動化された CI（型チェック・テスト・リント）
モニタリング／ロギング／アラート（Sentry / CloudWatch 等）
パフォーマンステスト（負荷、初回表示時間など）
インフラの堅牢化（ステージングで AWS との疎通確認、自動デプロイ、バックアップ、スケーリング）
リスク要因（早期対処推奨）:
バックエンドの API 仕様変更への追従（OpenAPI ベースで自動同期推奨）
トークン周りの競合・リフレッシュ失敗パスの未網羅
不十分なテストカバレッジによるリグレッション

---

テスト

テスト実行:
```bash
npx vitest run                                           # 全テスト
npx vitest run src/components/ErrorBoundary/__tests__/   # ErrorBoundary のみ
```

テスト構成（68 tests）:

| スイート | テスト数 | 内容 |
|---|---|---|
| classifyError | 34 | 全 8 エラー種別の分類ロジック検証 |
| extractErrorMessage | 5 | Error/string/object/null からのメッセージ抽出 |
| ErrorPage | 12 | 全種別の UI 表示・ボタン・コールバック |
| ErrorBoundary | 11 | コンポーネントツリーのエラー捕捉・auto分類・リセット |
| エッジケース | 6 | 非 Error throw、複合条件、循環参照 |

エラーバウンダリー対応種別（8 種）:
- `network` — ネットワーク接続エラー
- `chunk` — 遅延読み込み失敗（React.lazy）
- `auth` — 認証エラー（401）
- `forbidden` — 権限不足（403）
- `not-found` — ページ未検出（404）
- `server` — サーバーエラー（5xx）
- `timeout` — タイムアウト
- `unknown` — 不明なランタイムエラー


ではオブジェクト定義書を渡すので、各I/O値の型を定義してこの後API導線確率時に不整合がないように確認して。そしてかならず定義したtoのみ行うのであってI値以外の値で採用するまたは新たな変数を作成することはないようにして。おそらくI値は大文字や数値以外が来るのでI値はそこをstringやstringまたは数値としてもいいがapiに渡すときや受け取るときの型はオブジェクト定義にそるべきだと考えている。またオブジェクト定義はそのままdbに格納する値となるので最大の文字数など超えないように。

オブジェクト		企業								
API 参照名		Company								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	企業ID	company_id	CHAR	26	ID	○				ULID（時系列＋一意）
2	法人コード	company_code	VARCHAR	16	コード	○			○	拠点連携キー
3	企業名（正式）	company_name	VARCHAR	80	テキスト	○				登記名
4	企業名（表示用）	display_name	VARCHAR	40	テキスト	○				UI最適
5	企業種別	company_type	CHAR	1	区分	○	"1:法人 / 
2:個人事業"			将来拡張可
6	代表者名	representative_name	VARCHAR	40	テキスト	○				審査用
7	管理用メール	admin_email	VARCHAR	128	メール	○				通知・審査
8	管理用電話番号	admin_phone	VARCHAR	15	電話	△				E.164

オブジェクト		拠点アカウント								
API 参照名		Company_Account								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	拠点アカウントID	company_account_id	UUID	36	ID	○			○	内部主キー
2	企業ID	company_id	UUID	36	参照(ID)	○				No.02 Company
3	企業ロールID	company_role_id	CHAR	2	選択	○				No.04 Company_Role
4	拠点コード	branch_code	VARCHAR	10	テキスト	○			○	企業内一意
5	拠点名	branch_name	VARCHAR	40	テキスト	○				店舗名
6	拠点名（表示用）	branch_display_name	VARCHAR	40	テキスト					UI用（省略可）
7	郵便番号	postal_code	CHAR	7	テキスト					ハイフンなし
8	都道府県コード	prefecture_code	CHAR	2	選択	○	都道府県			JIS想定
9	市区町村	city	VARCHAR	30	テキスト	○				
10	住所詳細	address_line	VARCHAR	60	テキスト					
11	電話番号	phone_number	VARCHAR	15	テキスト					表示・発信
12	メールアドレス	contact_email	VARCHAR	80	テキスト					通知先
13	ステータス	status	CHAR	1	選択	○	有効/停止			投稿可否


オブジェクト		企業ロール								
API 参照名		Company_Role								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	企業ロールID	company_role_id	CHAR	2	主キー	○	01 / 02 / 03		○	01:親企業 / 02:子拠点 / 03:運営
2	ロールコード	role_code	VARCHAR	10	文字列	○	PARENT / CHILD / ADMIN			システム判定用コード
3	ロール名（和名）	role_name	VARCHAR	20	文字列	○	"親企業 / 
子拠点 /
 運営 /"			UI表示用


オブジェクト		認証情報								
API 参照名		Auth_Credential								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	認証ID	auth_id	CHAR	26	主キー	○		○	ULID	ULID
2	ユーザー種別	user_type	CHAR	1	選択	○	1:消費者 / 2:拠点			No.01 or No.03
3	消費者ID	consumer_id	CHAR	26	参照	△			No.01 FK	No.01 FK（user_type=1時必須）
4	拠点アカウントID	company_account_id	CHAR	26	参照	△			No.03 FK	No.03 FK（user_type=2時必須）
5	Cognito sub	auth_sub	VARCHAR	128	文字列	○		○	Cognito一意ID	Cognito一意ID
6	ログイン種別	login_type	CHAR	1	選択	○	1:email / 2:phone / 3:google / 4:line			
7	IPアドレス	ip_address	VARCHAR	45	文字列	△				IPv6対応
7	MFA有効フラグ	is_mfa_enabled	BOOLEAN	1	フラグ	○	true/false			
8	アカウント有効フラグ	is_enabled	BOOLEAN	1	フラグ	○	true/false		アプリ停止	アプリ側停止用
9	ロック状態	is_locked	BOOLEAN	1	フラグ	○	true/false			不正アクセス対策
10	ロック理由	lock_reason	VARCHAR	50	文字列	△			管理用	管理用

オブジェクト		法人審査								
API 参照名		Company_Review								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	審査ID	review_id	CHAR	26	主キー	○			○	ULID
2	企業ID	company_id	CHAR	26	参照	○				No.02 FK
3	申請種別	review_type	CHAR	1	選択	○	1:新規 / 2:更新 / 3:再申請			将来拡張可
4	審査ステータス	review_status	CHAR	1	選択	○	"1:申請中 /
 2:承認 / 
3:差戻し / 
4:却下"			業務制御の中心
5	申請日時	applied_at	DATETIME	19	日時	○				企業側操作
6	審査完了日時	reviewed_at	DATETIME	19	日時	△				承認/却下時
7	審査担当者ID	reviewer_id	CHAR	26	参照	△				運営アカウントID
8	差戻理由	review_comment	VARCHAR	200	文字列	△				差戻し時必須
9	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false			現行審査のみtrue

オブジェクト		提出書類								
API 参照名		Company_Document　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	書類ID	document_id	CHAR	26	主キー	○			○	ULID
2	企業ID	company_id	CHAR	26	参照	○				No.02 FK
3	審査ID	review_id	CHAR	26	参照	△				No.08 FK（審査紐付け時）
4	書類種別	document_type	CHAR	2	選択	○	"01:登記簿謄本 / 02:本人確認 / 
03:営業許可証 /
99:その他"			固定マスタ化可
5	ファイル名	file_name	VARCHAR	100	文字列	○				表示用
6	保存パス	file_path	VARCHAR	255	文字列	○				S3キー
7	MIMEタイプ	mime_type	VARCHAR	50	文字列	○				pdf/jpeg/png
8	ファイルサイズ	file_size	INT	10	数値	○				byte単位
9	アップロード者種別	uploaded_by_type	CHAR	1	選択	○	1:企業 / 2:運営			
10	アップロード日時	uploaded_at	DATETIME	19	日時	○				
11	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false			差し替え時false

オブジェクト		ユーザープロファイル(レポート用)								
API 参照名		User_Profile　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	プロフィールID	user_profile_id	CHAR	26	主キー	○			○	ULID
2	消費者ID	consumer_id	CHAR	26	参照	○				No.01 FK
3	性別	gender	CHAR	1	選択	△	"1:男性 /
2:女性 /
3:その他"			
4	生年	birth_year	CHAR	4	数値	△				例:1998
5	年代区分	age_group	CHAR	2	数式	△		CASE式		10/20/30/40/50/60
5	都道府県ID	region_id	CHAR	2	主キー	○			○	JISコード

オブジェクト		企業プラン								
API 参照名		Company_Plan　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	企業プランID	company_plan_id	CHAR	2	主キー	○	2001/2/3		○	固定値
2	プランコード	plan_code	VARCHAR	20	文字列	○	LIGHT / STANDARD / PREMIUM		○	内部識別
3	プラン名	plan_name	VARCHAR	30	文字列	○				表示用
4	月額料金	monthly_price	INT	7	数値	○				円（税抜）
5	1日投稿チケット数	daily_ticket_limit	INT	3	数値	○				2003/6/30
6	繰越可否フラグ	is_carry_over	BOOLEAN	1	フラグ	○	true/false			日跨ぎ可否
7	月跨ぎ可否フラグ	is_month_carry	BOOLEAN	1	フラグ	○	true/false			月跨ぎ可否
8	レポート機能フラグ	is_report_enabled	BOOLEAN	1	フラグ	○	true/false			
9	自動投稿機能フラグ	is_auto_post_enabled	BOOLEAN	1	フラグ	○	true/false			
オブジェクト		一般消費者プラン								
API 参照名		User_Plan								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	消費者プランID	user_plan_id	CHAR	2	主キー	○	1月2日		○	固定値
2	プランコード	plan_code	VARCHAR	20	文字列	○	FREE / AD_FREE		○	内部識別
3	プラン名	plan_name	VARCHAR	30	文字列	○				表示用
4	月額料金	monthly_price	INT	7	数値	○				円（税抜）
5	広告表示フラグ	is_ad_enabled	BOOLEAN	1	フラグ	○	true/false			true=広告あり
6	プッシュ通知上限	push_limit	INT	3	数値	△				将来拡張用
7	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false			廃止管理

オブジェクト		企業契約管理								
API 参照名		Company_Subscription　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	契約ID	subscription_id	CHAR	26	主キー	○			○	ULID
2	拠点アカウントID	company_account_id	CHAR	26	参照	○				No.02 FK
3	企業プランID	company_plan_id	CHAR	2	参照	○	2001/2002/2003			No.11 FK
4	契約ステータス	status	CHAR	1	選択	○	1:有効 / 2:停止 / 3:解約予約 / 4:解約済			制御用
5	契約開始日	start_date	DATE	10	日付	○				
6	契約終了日	end_date	DATE	10	日付	△				解約時のみ
7	自動更新フラグ	is_auto_renew	BOOLEAN	1	フラグ	○	true/false			
8	クーポンコード	coupon_code	VARCHAR	20	文字列	△			○	No.18 Coupon FK

オブジェクト		一般消費者契約管理								
API 参照名		User_Subscription　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	契約ID	subscription_id	CHAR	26	主キー	○			○	ULID
2	消費者ID	user_id	CHAR	26	参照	○				No.01 FK
3	消費者プランID	user_plan_id	CHAR	2	参照	○				No.12 FK
4	契約ステータス	status	CHAR	1	選択	○	1:有効 / 2:停止 / 3:解約予約 / 4:解約済			制御用
5	契約開始日	start_date	DATE	10	日付	○				
6	契約終了日	end_date	DATE	10	日付	△				解約時のみ
7	自動更新フラグ	is_auto_renew	BOOLEAN	1	フラグ	○	true/false			
8	クーポンコード	coupon_code	VARCHAR	20	文字列	△			○	初回登録用

オブジェクト		企業請求管理								
API 参照名		Company_Billing								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	請求ID	payment_id	CHAR	26	主キー	○			○	ULID
2	拠点アカウントID	company_account_id	CHAR	26	参照	○				No.02 FK
3	契約ID	subscription_id	CHAR	26	参照	○				No.13 FK
4	請求対象年月	billing_month	CHAR	6	文字列	○	YYYYMM			例：202504
5	請求金額	amount	INT	9	数値	○				税込金額
6	割引額	discount_amount	INT	9	数値	△				クーポン適用
7	最終請求額	final_amount	INT	9	数式	○		amount - discount_amount		
8	支払状態	payment_status	paid_at	1	選択	○	1:未請求 / 2:請求済 / 3:支払済 / 4:失敗			制御用
9	支払期限	due_date	DATE	10	日付	△				
10	支払日	paid_at	DATETIME	19	日時	△				成功時
11	決済トランザクションID	transaction_id	VARCHAR	64	文字列	△			○	決済API連携


オブジェクト		消費者請求管理								
API 参照名		User_Payment_Status								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	請求ID	payment_id	CHAR	26	主キー	○			○	ULID
2	消費者ID	user_id	CHAR	26	参照	○				No.01 FK
3	契約ID	user_subscription_id	CHAR	26	参照	△				No.14 FK
4	請求対象年月	billing_month	DATE	10	日付	○				月初固定（例:2025-04-01）
5	請求金額	amount	INT	10,0	数値	○				税込
6	割引額	discount_amount	INT	10,0	数値	△				クーポン適用
7	最終請求額	final_amount	INT	10,0	数式	○		amount - COALESCE(discount_amount,0)		
8	支払状態	payment_status	CHAR	1	選択	○	1:未請求 / 2:請求済 / 3:支払済 / 4:失敗			制御用
9	支払期限	due_date	DATE	10	日付	△				
10	支払日	paid_at	DATETIME	19	日時	△				成功時
11	決済トランザクションID	transaction_id	VARCHAR	64	文字列	△			○	外部決済API連携


オブジェクト		イベント一覧						
API 参照名		EventPost_c						
                                
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式
1	投稿ID	post_id	CHAR	26	主キー	○		
2	テンプレートID	template_id	CHAR	26	参照	○		
3	拠点アカウントID	company_account_id	CHAR	26	参照	○		
4	タイトル	title	VARCHAR	20	文字列	○		
5	説明概要	summary	VARCHAR	80	文字列	○		
6	詳細説明	description	TEXT	1000	テキスト	△		
7	予約URL	reservation_url	VARCHAR	255	文字列	△		
8	住所	address	CHAR	26	参照	○		
9	開催日	event_date	DATE	10	日付	○		
10	開始時間	event_start_time	TIME	8	時間	○		
11	終了時間	event_end_time	TIME	8	時間	○		
12	カテゴリーID	category_id	CHAR	26	参照	○		
13	公開状態	status	CHAR	1	選択	○	1:公開前 / 2:公開中 / 3:終了	
14	いいね数	like_count	INT	9	数値	○		COUNT(No.24)


オブジェクト		クーポン							
API 参照名		Plan_Coupon							
                                    
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID
1	クーポンID	coupon_id	CHAR	26	主キー	○			○
2	クーポンコード	coupon_code	VARCHAR	20	文字列	○			○
3	対象種別	target_type	CHAR	1	選択	○	1:企業 / 2:消費者		
4	割引種別	discount_type	CHAR	1	選択	○	1:金額 / 2:率		
6	無料期間日数	free_days	INT	3	数値	△			

オブジェクト		イベントテンプレート								
API 参照名		Event_Template_c								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	テンプレートID	template_id	CHAR	26	主キー	○			○	ULID
2	拠点アカウントID	company_account_id	CHAR	26	参照	○				No.02 FK
3	タイトル	title	VARCHAR	20	文字列	○				一覧・投稿生成元
4	説明概要	summary	VARCHAR	80	文字列	○				一覧表示用
5	詳細説明	description	TEXT	1000	テキスト	△				
6	予約URL	reservation_url	VARCHAR	255	文字列	△				外部予約導線
7	住所ID	location_id	CHAR	26	参照	○				No.23 FK
8	開始時間	event_start_time	TIME	8	時間	○				開催時間帯
9	終了時間	event_end_time	TIME	8	時間	○				
10	カテゴリーID	category_id	CHAR	26	参照	○				No.20 FK
11	テンプレ状態	status	CHAR	1	選択	○	1:下書き / 2:使用可 / 3:停止			投稿可否制御

オブジェクト		カテゴリー						
API 参照名		EventCategory_c						
                                
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式
1	カテゴリーID	category_id	CHAR	2	主キー	○		
2	カテゴリーコード	category_code	VARCHAR	20	文字列	○		
3	カテゴリー名	category_name	VARCHAR	20	文字列	○		

オブジェクト		イベントメディア								
API 参照名		EventMedia_c								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	メディアID	media_id	CHAR	26	主キー	○			○	ULID
2	テンプレートID	template_id	CHAR	26	参照	△				No.19 FK（テンプレ用）
3	投稿ID	post_id	CHAR	26	参照	△				No.17 FK（投稿用）
4	画像URL	image_url	VARCHAR	255	文字列	○				S3パス
5	表示順	sort_no	SMALLINT	2	数値	○				1〜3

オブジェクト		イベント開催日程								
API 参照名		EventSchedule_c								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	開催日程ID	schedule_id	CHAR	26	主キー	○			○	ULID
2	テンプレートID	template_id	CHAR	26	参照	○				No.19 FK
3	拠点アカウントID	company_account_id	CHAR	26	参照	○				No.02 FK
4	開催日	event_date	DATE	10	日付	○				カレンダー選択日
5	投稿予定日	scheduled_post_date	DATE	10	日付	○				通常はevent_date-2日
6	投稿状態	post_status	CHAR	1	選択	○	1:未生成 / 2:生成済 / 3:停止			バッチ制御

オブジェクト		イベント集計								
API 参照名		EventPreview_c　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	アクションID	action_id	CHAR	26	主キー	○			○	ULID
2	投稿ID	post_id	CHAR	26	参照	○				No.17 FK
3	消費者ID	consumer_id	CHAR	26	参照	○				No.01 FK
4	いいねフラグ	is_liked	BOOLEAN	1	フラグ	○	true / false			即時反映
5	お気に入りフラグ	is_favorited	BOOLEAN	1	フラグ	○	true / false			
6	閲覧者フラグ	view_count	INT	1	フラグ	○				


オブジェクト		デフォルト検索条件								
API 参照名		Default_Search　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	検索条件ID	search_id	CHAR	26	主キー	○			○	ULID
2	消費者ID	user_id	CHAR	26	参照	△			○	No.01 FK（UNIQUE）
3	拠点アカウントID	company_account_id	CHAR	26	参照	△			○	
4	キーワード	keyword	VARCHAR	100	文字列	△				部分一致
5	カテゴリーID	category_id	CHAR	26	参照	△				No.20 FK
6	地域ID	region_id	CHAR	2	参照	△				No.27 FK
7	市区町村ID	city_id	CHAR	6	参照	△				No.28 FK
8	開始時間	event_start_time	TIME	8	時間	○				
9	終了時間	event_end_time	TIME	8	時間	○				

オブジェクト		都道府県リスト								
API 参照名		Region_List　								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	都道府県ID	region_id	CHAR	2	主キー	○			○	JISコード
2	都道府県名	region_name	VARCHAR	10	文字列	○				表示名
3	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false			将来削除用

オブジェクト		市町村リスト						
API 参照名		City_List						
                                
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式
1	市町村ID	city_id	CHAR	6	主キー	○		
2	都道府県ID	region_id	CHAR	2	参照	○		
3	市町村名	city_name	VARCHAR	30	文字列	○		
4	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false	

オブジェクト		お気に入り情報								
API 参照名		User_Favorite								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	お気に入りID	favorite_id	CHAR	26	主キー	○			○	ULID
2	投稿ID	post_id	CHAR	26	参照	○				No.17 FK
3	消費者ID	consumer_id	CHAR	26	参照	○				No.01 FK

オブジェクト		消費者通知								
API 参照名		User_Notification								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	通知条件ID	notification_setting_id	CHAR	26	主キー	○			○	ULID
2	消費者ID	consumer_id	CHAR	26	参照	○				No.01 FK
3	拠点アカウントID	company_account_id 	CHAR	26	参照	△				No.02 FK（企業限定通知用）
4	カテゴリーID	category_id	CHAR	26	参照	△				No.20 FK
5	都道府県ID	region_id	CHAR	2	参照	△				No.27 FK
6	市町村ID	city_id	CHAR	5	参照	△				No.28 FK
7	通知種別	notification_type	CHAR	1	選択	○	1:Push / 2:Mail			
8	有効フラグ	is_active	BOOLEAN	1	フラグ	○	true/false			通知ON/OFF

オブジェクト		企業通知								
API 参照名		Company_Notification								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	通知設定ID	notification_setting_id	CHAR	26	主キー	○			○	ULID
2	拠点アカウントID	company_account_id 	CHAR	26	参照	○				No.02 FK
3	実行機能コード	function_code	VARCHAR	20	文字列	○	EVT-B-01 等			No.05 function_code
4	通知有効フラグ	is_enabled	BOOLEAN	1	フラグ	○	true/false			機能単位通知ON/OFF
5	通知種別	notification_type	CHAR	1	選択	○	1:メール / 2:Push / 3:両方			
オブジェクト		企業実行履歴								
API 参照名		Company_Execution_History								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	履歴ID	history_id	CHAR	26	主キー	○			○	ULID
2	拠点アカウントID	company_account_id 	CHAR	26	参照	○				No.02 FK
4	実行機能コード	function_code	VARCHAR	20	文字列	○	例: EVT-B-01			No.05連携
5	実行種別	execution_type	CHAR	1	選択	○	1:API / 2:Batch / 3:Admin			
6	実行対象種別	target_type	CHAR	1	選択	○	1:投稿 / 2:契約 / 3:請求 / 4:通知			
8	実行結果	result_status	CHAR	1	選択	○	1:成功 / 2:失敗			
9	エラーメッセージ	error_message	VARCHAR	200	文字列	△				失敗時のみ

オブジェクト		お問い合わせ情報							
API 参照名		InquiryHistory							
                                    
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID
1	問い合わせID	inquiry_id	CHAR	26	主キー	○			○
2	問い合わせ種別	inquiry_type	CHAR	1	選択	○	1:消費者 / 2:企業		
3	消費者ID	user_id	CHAR	26	参照	△			No.01 FK
4	企業ID	company_id	CHAR	26	参照	△			No.02 FK
5	件名	subject	VARCHAR	100	文字列	○			
6	内容	message	TEXT	1500	テキスト	○			
7	対応状態	inquiry_status	CHAR	1	選択	○	1:未対応 / 2:対応中 / 3:完了		
8	担当運営ユーザーID	admin_user_id	CHAR	26	参照	△			No.34 FK

オブジェクト		運営情報								
API 参照名		AdminUser								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	運営ユーザーID	admin_user_id	CHAR	26	主キー	○			○	ULID
2	企業権限ID	company_role_id 	VARCHAR	50	文字列	○				一意制約
3	権限種別	role_type	CHAR	1	選択	○	1:管理者 / 2:オペレータ			
4	運営ユーザー名	admin_display_name 	VARCHAR	40	テキスト					UI用（省略可）
5	郵便番号	postal_code	CHAR	7	テキスト					ハイフンなし
6	都道府県コード	prefecture_code	CHAR	2	選択	○	都道府県			JIS想定
7	市区町村	city	VARCHAR	30	テキスト	○				
8	住所詳細	address_line	VARCHAR	60	テキスト					
9	電話番号	phone_number	VARCHAR	15	テキスト					表示・発信
10	メールアドレス	contact_email	VARCHAR	80	テキスト					通知先

オブジェクト		チケット数管理								
API 参照名		Company_Ticket								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	チケット管理ID	ticket_id	CHAR	26	主キー	○			○	ULID
2	企業ID	company_id	CHAR	26	参照	○			No.02 FK	企業単位で1レコード（UNIQUE推奨）
3	デイリー付与数	daily_granted	INT	4	数値	○				契約プラン基準値
4	デイリー使用数	daily_used	INT	4	数値	○				当日投稿消費数
5	デイリー残数	daily_remaining	INT	4	数式	○		daily_granted - daily_used		DB保持せずAPI算出推奨
6	デイリー最終リセット日	daily_reset_at	DATE	10	日付	○				日次バッチ更新
7	マンスリー付与数	monthly_granted	INT	6	数値	○				契約プラン基準
8	マンスリー使用数	monthly_used	INT	6	数値	○				当月投稿消費数
9	マンスリー残数	monthly_remaining	INT	6	数式	○		monthly_granted - monthly_used		API算出推奨
10	対象年月	monthly_target	CHAR	6	文字列	○	YYYYMM形式			例:202504
7	マンスリー付与数	monthly_granted	INT	6	数値	○				契約プラン基準
8	マンスリー使用数	monthly_used	INT	6	数値	○				当月投稿消費数
9	マンスリー残数	monthly_remaining	INT	6	数式	○		monthly_granted - monthly_used		API算出推奨

オブジェクト		一般消費者								
API 参照名		User_Account								
                                        
No	論理名	物理名	データ型	桁数	項目タイプ	必須	選択リスト	数式	外部 ID	備考
1	ユーザーID	user_id	CHAR	26	主キー	必須				UUID(v4)
2	外部認証ID	auth_sub	CHAR	36	文字列	必須			○	Cognito sub
3	ログイン種別	login_type	VARCHAR	10	選択	必須	email / phone / google / line			
4	ニックネーム	user_name	VARCHAR	15	文字列	必須				UI表示名
5	メールアドレス	user_email	VARCHAR	254	文字列	条件				RFC準拠最大
6	電話番号	phone_number	VARCHAR	15	文字列	条件				E.164
7	性別	user_gender	CHAR	1	選択	任意	M / F / O			初回登録時
8	生年	birth_year	CHAR	8	数値	任意				レポート用
9	利用規約同意	terms_agreed	BOOLEAN	1	フラグ	必須	true / false			
10	アクティブ状態	is_active	BOOLEAN	1	フラグ	必須	true / false			論理削除用

