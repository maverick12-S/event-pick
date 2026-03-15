package com.eventpick.backend.biz.exception;

import lombok.Getter;
import org.slf4j.event.Level;

/**
 * 例外メッセージ列挙。
 * 各例外の代表メッセージ、ログレベル、スタックトレース出力方針を統一管理する。
 *
 * 設計方針:
 * - 例外ごとの運用上の重さをコードで統一
 * - ExceptionLogger と組み合わせて構造化ログを出力
 */
@Getter
public enum MessageEnum {

    // ── E1xxx: 認証・認可 ──
    AUTHENTICATION_FAILED("E1001", "認証に失敗しました", Level.INFO, false),
    TOKEN_EXPIRED("E1002", "トークンの有効期限が切れています", Level.INFO, false),
    ACCESS_DENIED("E1003", "アクセス権限がありません", Level.WARN, false),
    MFA_REQUIRED("E1004", "多要素認証が必要です", Level.INFO, false),
    ACCOUNT_LOCKED("E1005", "アカウントがロックされています", Level.WARN, false),

    // ── E2xxx: バリデーション ──
    VALIDATION_ERROR("E2001", "バリデーションエラー", Level.INFO, false),
    ILLEGAL_ARGUMENT("E2002", "不正なパラメータです", Level.INFO, false),
    MISSING_PARAMETER("E2003", "必須パラメータが不足しています", Level.INFO, false),
    TYPE_MISMATCH("E2004", "パラメータの型が不正です", Level.INFO, false),
    UPLOAD_SIZE_EXCEEDED("E2005", "アップロードファイルサイズが上限を超えています", Level.WARN, false),
    INPUT_CHECK_ERROR("E2006", "入力チェックエラー", Level.INFO, false),
    JSON_PARSE_ERROR("E2007", "リクエストボディのJSON形式が不正です", Level.INFO, false),
    METHOD_NOT_SUPPORTED("E2008", "サポートされていないHTTPメソッドです", Level.WARN, false),

    // ── E3xxx: ビジネスロジック ──
    RESOURCE_NOT_FOUND("E3001", "リソースが見つかりません", Level.WARN, false),
    CONFLICT("E3002", "データの競合が発生しました", Level.WARN, false),
    OPTIMISTIC_LOCK("E3003", "データが他のユーザーにより更新されました", Level.WARN, false),
    DATA_INTEGRITY_VIOLATION("E3004", "データの整合性エラーが発生しました", Level.WARN, true),
    BUSINESS_ERROR("E3005", "業務エラーが発生しました", Level.WARN, false),
    UNIQUE_CONSTRAINT_VIOLATION("E3006", "一意制約違反が発生しました", Level.ERROR, true),
    LOCKED("E3007", "リソースがロックされています", Level.ERROR, false),

    // ── E5xxx: サービス利用不可 ──
    SERVICE_UNAVAILABLE("E5001", "サービスが一時的に利用できません", Level.ERROR, false),
    MAINTENANCE("E5002", "メンテナンス中です", Level.INFO, false),
    EXTERNAL_SERVICE_ERROR("E5003", "外部サービスとの通信に失敗しました", Level.ERROR, true),

    // ── E9xxx: システム ──
    SYSTEM_ERROR("E9999", "システムエラーが発生しました", Level.ERROR, true);

    private final String code;
    private final String defaultMessage;
    private final Level logLevel;
    private final boolean printStackTrace;

    MessageEnum(String code, String defaultMessage, Level logLevel, boolean printStackTrace) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.logLevel = logLevel;
        this.printStackTrace = printStackTrace;
    }
}
