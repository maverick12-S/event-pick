# EventPick Backend LoadMap

更新日: 2026-03-15

## 1. 目的
このドキュメントは、現在のバックエンドの進捗を「商用リリースまでのロードマップ」として整理するためのものです。
対象は、フォルダ構成、技術構成、主要設定値の効果、残タスク、実装順序、商用リリース可否判定です。

## 2. 現在のフォルダ構成（要点）

- ルート
  - build.gradle
  - Dockerfile
  - src/
- アプリ本体
  - src/main/java/com/eventpick/backend/
    - biz/（業務ロジック）
    - config/（各種設定）
    - domain/（Entity/Repository）
    - restapi/（Controller/DTO/Exception/Filter）
- 設定・運用
  - src/main/resources/
    - application.yaml
    - application-local.yaml
    - application-st.yaml
    - application-prd.yaml
    - logback-spring.xml
    - db/migration/
- テスト
  - src/test/java/
  - src/test/resources/application-test.yaml

## 3. 現在の実装進捗（定量）

- Controller: 19
- APIエンドポイント注釈数: 110
- Service Interface: 19
- Service Impl: 19
- DTO: 52
- Entity: 22
- Repository: 22
- Converter: 5
- Testクラス: 9
- TODOマーカー: 23

現状のポイント:
- API面は主要仕様を満たしている
- インフラ基盤（監視・耐障害・AWS接続土台）は導入済み
- ただし、外部連携ロジック中心にTODOが23件残っている

## 4. 技術構成

- 言語/実行基盤
  - Java 21
  - Spring Boot 3.5.11
  - Gradle
- Web/API
  - Spring Web
  - Spring Validation
  - Springdoc OpenAPI
- 認証/認可
  - Spring Security
  - OAuth2 Resource Server（Cognito JWT検証）
- データ
  - Spring Data JPA
  - PostgreSQL
  - Redis
  - Flyway
- 可観測性
  - Spring Actuator
  - Micrometer + Prometheus
  - Micrometer Tracing + OpenTelemetry
  - logstash-logback-encoder（JSONログ）
- 耐障害
  - Resilience4j（CircuitBreaker/Retry）
- AWS SDK
  - S3
  - SES
  - CognitoIdentityProvider
- コンテナ
  - Docker（マルチステージ、JREランタイム、非root）

## 5. 主要設定値と効果

### 5-1. application.yaml（共通）

- server.tomcat.threads.max: 400
  - 効果: 同時リクエスト処理能力の上限を引き上げる
- server.tomcat.max-connections: 10000
  - 効果: 接続待ちの取りこぼしを抑える
- spring.datasource.hikari.maximum-pool-size: 50
  - 効果: DB接続並列数を確保しつつ枯渇を抑える
- spring.data.redis.timeout: 2000ms
  - 効果: Redis遅延時の待ち時間を制限
- management.endpoints.web.exposure.include: health,info,metrics,prometheus
  - 効果: ヘルス・メトリクス監視を外部公開可能
- management.tracing.sampling.probability: 0.1
  - 効果: 10%サンプリングでトレース量とコストをバランス
- resilience4j.circuitbreaker/retry
  - 効果: 外部API障害時の連鎖障害抑止、短時間回復

### 5-2. profile別の差分

- local
  - ddl-auto: update
  - flyway.enabled: false
  - 効果: ローカル開発速度を優先
- st
  - ddl-auto: validate
  - flyway.enabled: true
  - tracing sampling: 0.5
  - 効果: 検証環境でスキーマ厳密化と高めの観測性を確保
- prd
  - tomcat.threads.max: 800
  - hikari.maximum-pool-size: 100
  - max-connections: 20000
  - springdoc無効化
  - cors.allowed-origins制限
  - tracing sampling: 0.05
  - 効果: 本番スループットとセキュリティを優先
- test
  - H2, create-drop
  - Redis自動設定除外
  - flyway無効
  - 効果: テスト実行の独立性と速度を確保

### 5-3. セキュリティ設定の効果

- OAuth2 Resource ServerでCognito JWTを検証
- cognito:groups -> ROLE_権限に変換
- /actuator/** を permitAll
- 効果:
  - Cognito利用時でもSpring SecurityでAPI保護が成立
  - ロールベース認可をサーバ側で一元管理

### 5-4. エラーハンドリング設定の効果

- GlobalExceptionHandlerで業務例外/バリデーション/競合/システム障害を統一応答
- 400/403/404/405/409/413/500/503 を明示
- 効果:
  - フロント側のエラー判定を安定化
  - 障害解析のログ一貫性を向上

### 5-5. ログ・監視設定の効果

- local: 可読重視ログ
- st/prd: JSON構造化ログ（traceId/spanId/requestId含む）
- RequestLoggingFilter + Interceptorでリクエスト追跡
- 効果:
  - CloudWatch等での検索・相関分析が容易
  - インシデント時の調査時間短縮

## 6. ヘルスチェック確認結果

- エンドポイント: /actuator/health
- 実測結果:
  - PostgreSQLのみ起動時: 503 DOWN（Redis未起動）
  - PostgreSQL + Redis起動時: 200 UP
- 判定:
  - ヘルスチェック機構は正常
  - 依存コンポーネントが揃えば運用監視に利用可能

## 7. 未実装/残課題（重要）

### 7-1. TODOが残る主要サービス

- AuthServiceImpl
  - Cognito認証、サインアップ、パスワード系、MFA、トークン失効
- BillingServiceImpl
  - Stripe Checkout/Subscription/Coupon適用
- UploadServiceImpl
  - S3 Presigned URL生成
- WebhookServiceImpl
  - Stripe署名検証とイベント処理
- MapsServiceImpl
  - Google Maps Places API
- CorporationServiceImpl
  - 法人番号API照合
- ReportServiceImpl
  - レポート検索/集計
- AdminServiceImpl
  - 一部管理系更新処理

### 7-2. DBマイグレーション

- Flywayは導入済みだが、V1はプレースホルダー
- 実DDL（22 Entity対応）が未整備

### 7-3. テスト

- Testクラスは存在するが、機能全体に対して網羅不足
- 認証、外部連携、障害系、回帰系の自動テストが不足

## 8. 商用リリースまでの実装手順（推奨順）

### Phase 1: 認証・決済・アップロードの中核完了

1. AuthServiceImplでCognito API連携を実装
2. BillingServiceImplでStripe連携を実装
3. UploadServiceImplでS3 Presigned URL発行を実装
4. WebhookServiceImplで署名検証と冪等処理を実装

完了条件:
- ログイン/サインアップ/パスワード再設定がE2Eで通る
- 決済開始からWebhook反映まで一連で通る

### Phase 2: スキーマ確定とデータ整合性

1. Flyway初期DDLをEntity準拠で作成
2. インデックス・ユニーク制約・FK方針を明文化
3. マイグレーションのロールフォワード手順を確立

完了条件:
- 新規環境でFlywayだけで起動可能
- ddl-autoに依存せずスキーマ再現できる

### Phase 3: テスト強化

1. 認証/決済/Webhook/アップロードの統合テスト追加
2. 主要Controllerの正常系・異常系テスト追加
3. 重要Serviceの単体テスト追加
4. CIで test + smoke health check を必須化

完了条件:
- 回帰試験を自動化
- デプロイ前に重大不具合を検知可能

### Phase 4: 運用最終化

1. アラート閾値（エラー率、遅延、5xx）定義
2. 秘密情報の完全外部化（環境変数/Secret Manager）
3. 負荷試験（接続数、DBプール、Redis）
4. 障害訓練（DB停止、Redis停止、外部APIタイムアウト）

完了条件:
- SLA/SLOと監視運用手順が確定
- ロールバック/再実行手順が確立

## 9. 商用リリース下地の判定

結論: 下地は「概ね良好」。ただし現時点は「基盤完成・機能未完」の段階。

- 良い点（商用土台として十分）
  - セキュリティ、監視、トレーシング、構造化ログ、耐障害、Docker最適化まで実装済み
  - profile分離と本番向け制約（CORS、Swagger無効化）も整っている
- 未達点（このままでは本番投入不可）
  - 認証/決済/アップロード/Webhookなど中核業務ロジックにTODO残存
  - Flywayの実DDL未整備
  - 自動テスト網羅不足

最終判定:
- 商用リリース準備度: 80-85%
- Go条件:
  - Phase 1〜3を完了
  - 本番相当負荷試験と障害試験を通過

## 10. 直近2週間の実行プラン（短期）

- Week 1
  - Auth + Billing + Uploadの実装完了
  - Flyway V1実DDL作成
- Week 2
  - Webhook冪等処理 + 主要統合テスト
  - 負荷試験1回目 + 監視アラート調整

この計画を完了できれば、商用リリース判定は「実行可能」に到達します。
