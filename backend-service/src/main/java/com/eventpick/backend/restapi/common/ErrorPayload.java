package com.eventpick.backend.restapi.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * APIエラーペイロード。
 * エラーコード体系: E1xxx(認証), E2xxx(バリデーション), E3xxx(ビジネス), E9xxx(システム)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorPayload {

    /** エラーコード（E1xxx〜） */
    private String code;

    /** エラーメッセージ */
    private String message;

    /** フィールド単位の詳細エラーリスト */
    private List<String> details;
}
