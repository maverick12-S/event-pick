package com.eventpick.backend.restapi.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * API共通レスポンスラッパー。
 * すべてのAPIは本クラスで統一された形式を返す。
 *
 * @param <T> data部のペイロード型
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommonResponse<T> {

    /** 成功フラグ */
    private Boolean success;

    /** 成功時はオブジェクト、失敗時はnull */
    private T data;

    /** 失敗時のエラー情報 */
    private ErrorPayload error;

    /** レスポンス生成時刻（UTC ISO8601） */
    private LocalDateTime timestamp;

    /**
     * 成功レスポンス（データ付き）を生成する。
     */
    public static <T> CommonResponse<T> ok(T data) {
        return CommonResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now(ZoneOffset.UTC))
                .build();
    }

    /**
     * 成功レスポンス（データなし）を生成する。
     */
    public static CommonResponse<Void> ok() {
        return CommonResponse.<Void>builder()
                .success(true)
                .timestamp(LocalDateTime.now(ZoneOffset.UTC))
                .build();
    }

    /**
     * エラーレスポンスを生成する。
     */
    public static CommonResponse<Void> error(String code, String message, List<String> details) {
        return CommonResponse.<Void>builder()
                .success(false)
                .error(ErrorPayload.builder().code(code).message(message).details(details).build())
                .timestamp(LocalDateTime.now(ZoneOffset.UTC))
                .build();
    }
}
