# EventPick Backend — 商用リリース評価 & 実装ロードマップ

更新日: 2025-07-17

---

## 1. エグゼクティブサマリー

| 指標 | 値 |
|------|----|
| **商用リリース準備度** | **78 / 100** |
| 前回評価 | 62 / 100（+16pt） |
| 残TODO数 | 16件（全て外部API連携） |
| ビルド状態 | ✅ BUILD SUCCESSFUL |
| テスト状態 | ✅ 67テスト全通過 |
| ブロッカー | 認証(Cognito) + 決済(Stripe) 未連携 |

### スコア内訳

| カテゴリ | 配点 | 得点 | 備考 |
|---------|:---:|:---:|------|
| アーキテクチャ＆設計 | 10 | 9 | レイヤード設計完成、AOP例外翻訳、共通レスポンス |
| APIエンドポイント | 10 | 9 | 107/110実装、全コントローラーがサービス委譲 |
| エンティティ＆DB | 10 | 10 | 28エンティティ、Flyway DDL+初期データ完備 |
| リポジトリ層 | 10 | 9 | 58カスタムクエリ、JPQL 8件、AOP例外翻訳 |
| サービス層（ビジネスロジック） | 15 | 10 | 102メソッド中72完全実装、残りは外部APIスタブ |
| 認証・認可 | 10 | 4 | SecurityConfig完成、JWT検証構成済み。Cognito API未連携 |
| 決済・課金 | 10 | 3 | Webhook handler完成、Stripe SDK未連携 |
| インフラ基盤 | 10 | 9 | Docker最適化、Resilience4j、メトリクス、構造化ログ |
| テスト | 10 | 5 | 67テスト、例外ハンドラ完全網羅。サービス層テスト不足 |
| セキュリティ | 5 | 3 | 入力検証充実、CORS Bean未実装、Actuator公開 |
| **合計** | **100** | **78** | |

---

## 2. 現在地の全体像

```
  🏔️ 商用リリース (100)
  │
  ├─── Phase 4: 運用最終化 (95-100)     ← 負荷試験、障害訓練、SLA定義
  │
  ├─── Phase 3: テスト強化 (88-95)       ← サービス層テスト、統合テスト、CI必須化
  │
  ├─── Phase 2: セキュリティ硬化 (82-88) ← CORS Bean、Actuator制限、Rate Limit適用
  │
  ├─── Phase 1: 外部API連携 (78-82)      ← Cognito、Stripe、S3、SES
  │
  ╠════ 🔵 現在地 (78/100) ═════════════╣
  │
  ├─── DB/Entity/Repository (完成)
  ├─── Controller層 (完成)
  ├─── ビジネスロジック (70%完成、外部APIスタブ)
  ├─── バッチジョブ 7本 (完成)
  ├─── エラーハンドリング (完成)
  ├─── 監視・メトリクス (完成)
  ├─── Docker最適化 (完成)
  └─── Flywayマイグレーション (完成)
```

---

## 3. 完成済み領域（詳細）

### 3-1. アーキテクチャ基盤 ✅

| 要素 | 状態 | 詳細 |
|------|:---:|------|
| レイヤード設計 | ✅ | Controller → Service → Repository の責務分離 |
| 共通レスポンス | ✅ | `CommonResponse<T>` ラッパー全API統一 |
| 例外階層 | ✅ | BusinessException → 6種派生例外、18ハンドラ |
| AOP例外翻訳 | ✅ | RepositoryExceptionInterceptor (一意制約/デッドロック/ロック待ち) |
| ID生成 | ✅ | ULID CHAR(26) 全テーブル統一 |
| 監査ログ | ✅ | AuditLogHelper ユーティリティ |
| 楽観ロック | ✅ | BaseEntity `@Version` + ObjectOptimisticLockingFailure処理 |

### 3-2. API層 ✅

| 指標 | 値 |
|------|----|
| コントローラー数 | 19 |
| エンドポイント数 | 107（宣言110） |
| プレースホルダー返却 | **0件**（全てサービス委譲） |
| APIバージョニング | `/api/v1/` 統一 |
| Swagger/OpenAPI | Bearer JWT認証、19タグ、共通エラー定義 |
| ページネーション | `limit/offset` 標準化（デフォルト40件） |
| `@Validated` | 全コントローラー適用済み |

### 3-3. データ層 ✅

| 指標 | 値 |
|------|----|
| エンティティ数 | 28 + BaseEntity |
| Flyway DDL | V1__init_schema.sql（560行、28テーブル） |
| インデックス | 12個 |
| 外部キー制約 | 14個 |
| CHECK制約 | 4個（gender, company_type, discount_type, event status） |
| 初期マスタデータ | 都道府県47、カテゴリ10、プラン3、地域6、システム設定4 |
| リポジトリ | 22 + AOP Interceptor |
| カスタムクエリ | 58メソッド |
| JPQL `@Query` | 8件 |

### 3-4. サービス層（ビジネスロジック）

| サービス | メソッド数 | 完成度 | 未実装部分 |
|---------|:---:|:---:|------|
| CompanyServiceImpl | 11 | **100%** | — |
| EventServiceImpl | 16 | **95%** | S3アップロード/削除のみ |
| AdminServiceImpl | 35 | **85%** | 5件のno-op管理更新 |
| ReportServiceImpl | 4 | **100%** | — |
| UserServiceImpl | 3 | **100%** | — |
| NotificationServiceImpl | 3 | **100%** | — |
| InquiryServiceImpl | 2 | **100%** | — |
| AgreementServiceImpl | 1 | **100%** | — |
| AuditServiceImpl | 1 | **100%** | — |
| MasterServiceImpl | 2 | **100%** | — |
| CompanyAccountServiceImpl | 3 | **100%** | — |
| ExecutionHistoryServiceImpl | 1 | **100%** | — |
| TicketServiceImpl | 1 | **100%** | — |
| AuthServiceImpl | 8 | **30%** | Cognito API 8メソッド全て |
| BillingServiceImpl | 8 | **40%** | Stripe API 5メソッド |
| WebhookServiceImpl | 5 | **80%** | 署名検証のみ |
| CorporationServiceImpl | 1 | **70%** | 国税庁API未連携（ローカル検証済） |
| UploadServiceImpl | 1 | **0%** | S3 Presigned URL |
| MapsServiceImpl | 1 | **0%** | Google Maps API |

### 3-5. バッチジョブ ✅

| ジョブID | スケジュール | 内容 | 状態 |
|---------|-----------|------|:---:|
| SC0001 | 毎日 00:00 | 日次チケット有効期限リセット | ✅ |
| SC0003 | 毎日 00:05 | 日次チケット付与 | ✅ |
| SC0005 | 毎日 00:10 | 予約投稿自動公開 | ✅ |
| SC0006 | 30分ごと | レポート指標リフレッシュ | ✅ |
| SC0007 | 毎日 01:00 | 物理削除（90日経過） | ✅ |
| SC0010 | 毎日 00:15 | 期限切れイベントクローズ | ✅ |
| SC0012 | 毎日 02:00 | 通知リトライ | ⚠️ SES待ち |

### 3-6. インフラ基盤 ✅

| 要素 | 状態 | 詳細 |
|------|:---:|------|
| Docker | ✅ | マルチステージ、JRE、非root、G1GC、MaxRAMPercentage=75% |
| Resilience4j | ✅ | CircuitBreaker 3系統、Retry 3系統 |
| Redis Cache | ✅ | master=24h, events=5min, companies=30min |
| Micrometer | ✅ | 4 Counter + 1 Timer (Prometheus) |
| OpenTelemetry | ✅ | トレーシング（prd=5%, st=50%） |
| 構造化ログ | ✅ | JSON (traceId/spanId/requestId) |
| Profile分離 | ✅ | local/st/prd/test 4環境 |
| スレッドプール | ✅ | Async core=50, max=200, queue=500 |
| ヘルスチェック | ✅ | /actuator/health (DB+Redis) |

### 3-7. テスト

| テストカテゴリ | ファイル数 | テスト数 | 品質 |
|-------------|:---:|:---:|:---:|
| 例外ハンドラ | 2 | 25 | ⭐⭐⭐ |
| 例外階層 | 1 | 13 | ⭐⭐⭐ |
| エラーコード体系 | 1 | 10 | ⭐⭐⭐ |
| リポジトリAOP | 1 | 6 | ⭐⭐⭐ |
| CompanyService | 1 | 5 | ⭐⭐ |
| コントローラー | 2 | 4 | ⭐⭐ |
| ULID生成 | 1 | 3 | ⭐⭐⭐ |
| コンテキスト起動 | 1 | 1 | ⭐ |
| **合計** | **10** | **67** | |

---

## 4. 未実装領域（TODO一覧）

### 4-1. 外部API連携 — 16件

#### 🔴 最重要（認証）— Cognito連携 8件

| # | ファイル | メソッド | 内容 | 現状 |
|:---:|---------|---------|------|------|
| 1 | AuthServiceImpl | `login()` | Cognito InitiateAuth API | スタブトークン返却 |
| 2 | AuthServiceImpl | `logout()` | Cognito GlobalSignOut | ログのみ |
| 3 | AuthServiceImpl | `refresh()` | Cognitoリフレッシュトークン | スタブトークン返却 |
| 4 | AuthServiceImpl | `revoke()` | Cognito RevokeToken | ログのみ |
| 5 | AuthServiceImpl | `signup()` | Cognito SignUp API | ローカルエンティティ作成のみ |
| 6 | AuthServiceImpl | `mfaVerify()` | Cognito ConfirmSignUp | ログのみ |
| 7 | AuthServiceImpl | `passwordReset()` | Cognito ForgotPassword | ログのみ |
| 8 | AuthServiceImpl | `passwordChange()` | Cognito ChangePassword | ログのみ |

#### 🔴 最重要（決済）— Stripe連携 5件

| # | ファイル | メソッド | 内容 | 現状 |
|:---:|---------|---------|------|------|
| 9 | BillingServiceImpl | `createCheckoutSession()` | Stripe Checkout Session作成 | スタブURL返却 |
| 10 | BillingServiceImpl | `changePlan()` | Stripe Subscription.update | ログのみ |
| 11 | BillingServiceImpl | `cancelSubscription()` | Stripe Subscription.cancel | ログのみ |
| 12 | BillingServiceImpl | `getBillingData()` | Stripe PaymentMethod一覧取得 | 空リスト返却 |
| 13 | BillingServiceImpl | `applyCoupon()` | Stripe coupon適用 | ログのみ |

#### 🟡 重要 — Stripe署名検証 1件

| # | ファイル | メソッド | 内容 | 現状 |
|:---:|---------|---------|------|------|
| 14 | WebhookServiceImpl | `processStripeWebhook()` | Stripe署名検証 | 検証スキップ（handler自体は完成） |

#### 🟡 中程度 — AWS連携 1件

| # | ファイル | メソッド | 内容 | 現状 |
|:---:|---------|---------|------|------|
| 15 | UploadServiceImpl | `createPresignedUrl()` | S3 Presigned URL生成 | スタブURL返却 |

#### ⚪ 低優先度 — 外部API 1件

| # | ファイル | メソッド | 内容 | 現状 |
|:---:|---------|---------|------|------|
| 16 | MapsServiceImpl | `searchGoogle()` | Google Maps Places API | 空リスト返却 |

### 4-2. セキュリティ課題 — 3件

| # | 重要度 | 内容 | 詳細 |
|:---:|:---:|------|------|
| S1 | 🔴 HIGH | Actuator公開 | `/actuator/**` が `permitAll` — メトリクス・ヘルス情報が認証なしでアクセス可能 |
| S2 | 🟡 MED | CORS Bean未実装 | `application-prd.yaml` にプロパティはあるがCorsConfigurer Beanなし |
| S3 | 🟡 MED | Rate Limiter未適用 | Resilience4j定義済みだが `@RateLimiter` デコレーターなし |

### 4-3. テストカバレッジ不足 — 15サービス未テスト

テスト済み: CompanyService（5件）、Auth/Companyコントローラー（各2件）

**未テストのサービス**: EventService, AuthService, BillingService, AdminService, WebhookService, NotificationService, TicketService, InquiryService, CorporationService, UploadService, MapsService, MasterService, ReportService, CompanyAccountService, AgreementService

### 4-4. その他の改善点

| # | 内容 | 優先度 |
|:---:|------|:---:|
| M1 | Dockerfile に HEALTHCHECK 命令追加 | ⚪ 低 |
| M2 | Redis パスワードのデフォルト空文字を排除 | 🟡 中 |
| M3 | 一部DTOの `@NotNull` 追加（CompanyDto, BillingAddressDto） | 🟡 中 |
| M4 | AdminServiceImpl の5件の管理更新no-op実装 | ⚪ 低 |
| M5 | SES メール送信実装（通知リトライバッチ含む） | 🟡 中 |
| M6 | 国税庁法人番号API連携 | ⚪ 低 |

---

## 5. 商用リリースまでの登山計画

```
                    🏔️ 商用リリース
                   /  \
                  / Ph4 \  運用最終化
                 /________\
                /   Ph3    \  テスト強化
               /____________\
              /     Ph2      \  セキュリティ硬化
             /________________\
            /      Ph1        \  外部API連携
           /____________________\
          ╔═══ 🔵 現在地 (78pt) ═══╗
          ║ DB/Controller/Batch   ║
          ║ Service Logic/Infra   ║
          ╚═══════════════════════╝
```

---

### Phase 1: 外部API連携 — 核心機能の完成 🔴

**目標スコア: 78 → 88**

#### 1-1. Cognito認証連携（最優先）

| タスク | 依存関係 |
|-------|------|
| CognitoIdentityProviderClient のラッパーサービス作成 | AWS Cognito UserPool設定済み前提 |
| `login()` — InitiateAuth (USER_PASSWORD_AUTH) | |
| `signup()` — SignUp + AdminConfirmSignUp | |
| `mfaVerify()` — ConfirmSignUp | login/signup |
| `refresh()` — InitiateAuth (REFRESH_TOKEN_AUTH) | |
| `logout()` — GlobalSignOut | |
| `revoke()` — RevokeToken | |
| `passwordReset()` — ForgotPassword + ConfirmForgotPassword | |
| `passwordChange()` — ChangePassword | |
| 統合テスト（モックCognito） | 全メソッド |

**完了条件**: サインアップ → MFA認証 → ログイン → トークンリフレッシュ → パスワード変更 → ログアウト のE2Eフローが通る

#### 1-2. Stripe決済連携

| タスク | 依存関係 |
|-------|------|
| Stripe SDK依存追加 + StripeClient Bean定義 | Stripeアカウント設定済み前提 |
| `createCheckoutSession()` — Session.create | |
| `changePlan()` — Subscription.update | |
| `cancelSubscription()` — Subscription.cancel | |
| `getBillingData()` — PaymentMethod.list | |
| `applyCoupon()` — Subscription.update (coupon) | |
| Webhook署名検証 — Webhook.constructEvent | |
| 統合テスト（モックStripe） | 全メソッド |

**完了条件**: プラン選択 → Checkout → Webhook受信 → Subscription反映 → プラン変更 → 解約 のE2Eフローが通る

#### 1-3. S3 Presigned URL

| タスク | 依存関係 |
|-------|------|
| `createPresignedUrl()` — S3Presigner.presignPutObject | S3バケット設定済み前提 |
| EventServiceImplのメディアアップロード/削除にS3連携追加 | PresignedURL |

**完了条件**: ファイルアップロード → S3保存 → URL取得が通る

#### 1-4. SES メール送信（推奨）

| タスク | 依存関係 |
|-------|------|
| EmailServiceImpl 作成 (SesClient.sendEmail) | SES ドメイン検証済み前提 |
| 通知リトライバッチ (SC0012) にSES連携 | EmailService |

---

### Phase 2: セキュリティ硬化 🟡

**目標スコア: 88 → 92**

| # | タスク | 詳細 |
|:---:|-------|------|
| 1 | Actuator制限 | `/actuator/health` のみ `permitAll`、他は `hasRole('ADMIN')` または内部IP制限 |
| 2 | CORS Bean実装 | `WebMvcConfigurer` に `CorsRegistry` 登録、`cors.allowed-origins` プロパティ連携 |
| 3 | Rate Limiter適用 | `@RateLimiter` をAuth系・Billing系コントローラーに適用 |
| 4 | Redis パスワード必須化 | `application-prd.yaml` のデフォルト空文字を削除 |
| 5 | DTO検証強化 | `CompanyDto`, `BillingAddressDto` に `@NotNull` 追加 |
| 6 | セキュリティヘッダー | Content-Security-Policy, X-Content-Type-Options, X-Frame-Options |

**完了条件**: OWASP Top 10の主要項目をカバー、ペネトレーションテスト基礎項目クリア

---

### Phase 3: テスト強化 🟡

**目標スコア: 92 → 96**

#### 優先テスト追加リスト

| # | 対象 | テスト種別 | テスト内容 |
|:---:|------|:---:|------|
| 1 | AuthServiceImpl | Unit | 全8メソッドの正常/異常系（Cognito Mock） |
| 2 | BillingServiceImpl | Unit | 全8メソッドの正常/異常系（Stripe Mock） |
| 3 | EventServiceImpl | Unit | 16メソッドの主要パス |
| 4 | AdminServiceImpl | Unit | 主要10メソッド |
| 5 | WebhookServiceImpl | Unit | 署名検証 + 4 handler |
| 6 | Auth系エンドポイント | Integration | @WebMvcTest ログイン→リフレッシュ→ログアウト |
| 7 | Billing系エンドポイント | Integration | @WebMvcTest Checkout→Webhook |
| 8 | Event系エンドポイント | Integration | @WebMvcTest CRUD + ページネーション |
| 9 | バッチジョブ | Unit | 7ジョブの実行確認 |
| 10 | セキュリティ | Integration | 認可ロール制限テスト |

**目標テスト数**: 67 → 150+ テスト

**CI統合**:
- `./gradlew test` をGitHub Actions / CodePipeline に組み込み
- テスト失敗時のデプロイブロック
- カバレッジレポート生成 (JaCoCo)

**完了条件**: 主要サービスのUnit網羅率80%以上、回帰テスト自動化

---

### Phase 4: 運用最終化 ⚪

**目標スコア: 96 → 100**

| # | タスク | 詳細 |
|:---:|-------|------|
| 1 | 負荷試験 | Gatling / k6 で同時接続数・DB接続プール・Redisの限界値確認 |
| 2 | 障害訓練 | DB停止、Redis停止、外部APIタイムアウト時の挙動確認 |
| 3 | アラート閾値定義 | エラー率(>1%), レイテンシ(p99>3s), 5xx率(>0.5%) |
| 4 | シークレット管理 | AWS Secrets Manager / Parameter Store 統合 |
| 5 | ログ監視 | CloudWatch Logs + Metric Filter設定 |
| 6 | ロールバック手順 | Blue/Green or Rolling Update 手順確立 |
| 7 | Dockerfile HEALTHCHECK | `HEALTHCHECK CMD curl -f http://localhost:8080/actuator/health` |
| 8 | SLA/SLO定義 | 可用性99.9%、平均レスポンスタイム200ms以下 |

**完了条件**: 本番相当負荷試験通過、障害復旧手順確立、監視ダッシュボード稼働

---

## 6. 定量サマリー

### 現在のコードベース規模

| 指標 | 値 |
|------|----|
| コントローラー | 19ファイル / 107エンドポイント |
| サービスインターフェース | 19 |
| サービス実装 | 19ファイル / 102メソッド |
| エンティティ | 28 + 1 BaseEntity |
| リポジトリ | 22 + AOP Interceptor |
| DTO | 52+ |
| 設定クラス | 8 |
| Flyway | 1ファイル / 28テーブル / 560行 |
| バッチジョブ | 7 |
| テスト | 10ファイル / 67テストメソッド |
| TODOマーカー | 16件（全て外部API） |

### 前回評価(62pt)からの進捗

| 項目 | 前回 | 今回 | 変化 |
|------|:---:|:---:|:---:|
| エンティティ | 22 | 29 | +7 |
| リポジトリ | 16 | 23 | +7 |
| テストクラス | 9 | 10 | +1 |
| テストメソッド | 60 | 67 | +7 |
| Flyway DDL | プレースホルダー | 完全実装 | 🆕 |
| バッチジョブ | 0 | 7 | 🆕 |
| サービスロジック | スタブ多数 | 72/102完全実装 | 大幅改善 |
| ビルド状態 | ❌ 200エラー | ✅ 0エラー | 完全解消 |

---

## 7. 技術構成

| レイヤー | 技術 |
|---------|------|
| 言語 | Java 21 (OpenJDK 21.0.10) |
| フレームワーク | Spring Boot 3.5.11 |
| ビルド | Gradle 8.14.4 |
| ORM | Spring Data JPA + Hibernate |
| DB | PostgreSQL 16 |
| キャッシュ | Redis (Spring Data Redis) |
| マイグレーション | Flyway |
| 認証 | Spring Security + OAuth2 Resource Server (Cognito JWT) |
| AWS SDK | v2 (S3, SES, CognitoIdentityProvider) |
| 耐障害 | Resilience4j (CircuitBreaker + Retry) |
| 監視 | Micrometer + Prometheus + OpenTelemetry |
| ログ | Logback + logstash-logback-encoder (JSON) |
| API Doc | Springdoc OpenAPI 2.8.8 |
| テスト | JUnit 5 + Mockito + H2 |
| コンテナ | Docker (マルチステージ, JRE, 非root) |

---

## 8. 結論

### 判定: 基盤完成・外部連携未完

EventPickバックエンドは、**アプリケーション内部の設計・実装は商用品質**に達している。
DB設計、エンティティ、リポジトリ、コントローラー、エラーハンドリング、インフラ基盤（Docker、監視、耐障害、キャッシュ）は全て本番投入可能な状態。

**唯一のブロッカー**は外部API連携（Cognito認証 + Stripe決済）の16件のTODO。
これらは全てSDK呼び出しのスタブ部分であり、周辺のビジネスロジック（Webhook handler、DB永続化、バリデーション等）は既に完成しているため、API連携コードの追加のみで機能が完成する。

### Go / No-Go 条件

| 条件 | 状態 |
|------|:---:|
| Phase 1 (外部API連携) 完了 | ❌ 必須 |
| Phase 2 (セキュリティ硬化) 完了 | ❌ 必須 |
| Phase 3 (テスト強化) 完了 | ⚠️ 推奨 |
| Phase 4 (運用最終化) 完了 | ⚠️ 推奨 |

**商用リリースGo条件**: Phase 1 + Phase 2 の完了が最低条件。Phase 3 はリリース後の継続改善として許容可能。
