package com.eventpick.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

/**
 * OpenAPI (Swagger) 設定。
 * <p>
 * 全110エンドポイントのドキュメント生成基盤。
 * springdoc-openapi が Controller の @Tag/@Operation アノテーションと連携して
 * Swagger UI を自動生成する。
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:eventpick-backend}")
    private String appName;

    @Bean
    @SuppressWarnings("rawtypes")
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("EventPick Backend API")
                        .version("1.0.0")
                        .description("""
                                EventPick SPA バックエンドAPI。
                                
                                ## 認証
                                AWS Cognito JWT Bearer Token による認証。
                                `/api/v1/auth/login` で取得した `access_token` を `Authorization: Bearer <token>` ヘッダーで送信。
                                
                                ## エラーレスポンス体系
                                | コード範囲 | 分類 | 説明 |
                                |-----------|------|------|
                                | E1xxx | 認証・認可 | 認証失敗, トークン期限切れ, アクセス拒否 |
                                | E2xxx | バリデーション | 入力チェック, パラメータ不正, JSON不正 |
                                | E3xxx | ビジネスロジック | リソース未検出, 競合, 楽観ロック |
                                | E5xxx | サービス利用不可 | 外部サービス障害, メンテナンス |
                                | E9xxx | システム | 予期しないエラー |
                                
                                ## 共通レスポンス形式
                                ```json
                                {
                                  "success": true/false,
                                  "data": { ... },
                                  "error": { "code": "Exxxx", "message": "...", "details": [...] },
                                  "timestamp": "2025-01-01T00:00:00"
                                }
                                ```
                                """)
                        .contact(new Contact()
                                .name("EventPick Development Team")
                                .email("dev@eventpick.co.jp")))
                .servers(List.of(
                        new Server().url("/").description("Current Environment")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("AWS Cognito JWT Access Token"))
                        .addSchemas("CommonResponseVoid", new Schema<>()
                                .type("object")
                                .description("データなし成功レスポンス")
                                .addProperty("success", new Schema<>().type("boolean").example(true))
                                .addProperty("timestamp", new Schema<>().type("string").format("date-time")))
                        .addSchemas("ErrorResponse", new Schema<>()
                                .type("object")
                                .description("エラーレスポンス")
                                .addProperty("success", new Schema<>().type("boolean").example(false))
                                .addProperty("error", new Schema<>()
                                        .type("object")
                                        .addProperty("code", new Schema<>().type("string").example("E2001"))
                                        .addProperty("message", new Schema<>().type("string"))
                                        .addProperty("details", new Schema<>().type("array")
                                                .items(new Schema<>().type("string"))))
                                .addProperty("timestamp", new Schema<>().type("string").format("date-time")))
                        .addResponses("BadRequest", new ApiResponse()
                                .description("400 - バリデーションエラー (E2xxx)")
                                .content(new Content().addMediaType("application/json",
                                        new MediaType().schema(new Schema<>().$ref("#/components/schemas/ErrorResponse")))))
                        .addResponses("Unauthorized", new ApiResponse()
                                .description("401 - 認証失敗 (E1001)"))
                        .addResponses("Forbidden", new ApiResponse()
                                .description("403 - アクセス拒否 (E1003)")
                                .content(new Content().addMediaType("application/json",
                                        new MediaType().schema(new Schema<>().$ref("#/components/schemas/ErrorResponse")))))
                        .addResponses("NotFound", new ApiResponse()
                                .description("404 - リソース未検出 (E3001)")
                                .content(new Content().addMediaType("application/json",
                                        new MediaType().schema(new Schema<>().$ref("#/components/schemas/ErrorResponse")))))
                        .addResponses("Conflict", new ApiResponse()
                                .description("409 - データ競合 (E3002)")
                                .content(new Content().addMediaType("application/json",
                                        new MediaType().schema(new Schema<>().$ref("#/components/schemas/ErrorResponse")))))
                        .addResponses("InternalServerError", new ApiResponse()
                                .description("500 - システムエラー (E9999)")
                                .content(new Content().addMediaType("application/json",
                                        new MediaType().schema(new Schema<>().$ref("#/components/schemas/ErrorResponse"))))))
                .tags(List.of(
                        new Tag().name("認証 (Auth)").description("ログイン, ログアウト, トークン更新, MFA, パスワード管理 - 8エンドポイント"),
                        new Tag().name("企業 (Company)").description("企業CRUD, 自社情報, レビュー, 下書き - 11エンドポイント"),
                        new Tag().name("拠点アカウント (CompanyAccount)").description("拠点アカウントCRUD - 3エンドポイント"),
                        new Tag().name("イベント (Event)").description("イベントCRUD, 検索, 公開制御, メディア管理 - 16エンドポイント"),
                        new Tag().name("チケット (Ticket)").description("チケット情報取得 - 1エンドポイント"),
                        new Tag().name("請求 (Billing)").description("Stripe連携, プラン変更, クーポン - 7エンドポイント"),
                        new Tag().name("通知 (Notification)").description("通知一覧, 既読処理 - 3エンドポイント"),
                        new Tag().name("レポート (Report)").description("レポート集計, 検索 - 4エンドポイント"),
                        new Tag().name("ユーザー (User)").description("ユーザー管理, アカウント停止 - 3エンドポイント"),
                        new Tag().name("マスタ (Master)").description("都道府県, 市区町村マスタ (認証不要) - 2エンドポイント"),
                        new Tag().name("Maps").description("Google Maps 検索連携 - 1エンドポイント"),
                        new Tag().name("お問い合わせ (Inquiry)").description("お問い合わせ送信 - 2エンドポイント"),
                        new Tag().name("アップロード (Upload)").description("S3 Presigned URL 発行 - 1エンドポイント"),
                        new Tag().name("法人番号 (Corporation)").description("法人番号バリデーション (認証不要) - 1エンドポイント"),
                        new Tag().name("同意記録 (Agreement)").description("利用規約同意ログ記録 - 1エンドポイント"),
                        new Tag().name("監査ログ (Audit)").description("監査ログ一覧 - 1エンドポイント"),
                        new Tag().name("実行履歴 (ExecutionHistory)").description("実行履歴一覧 - 1エンドポイント"),
                        new Tag().name("Webhook").description("Stripe Webhook (認証不要) - 1エンドポイント"),
                        new Tag().name("管理 (Admin)").description("システム管理者向け全管理機能 - 約40エンドポイント")));
    }
}
