package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 対象種別 CHAR(1)。
 * 1:投稿 / 2:アカウント / 3:設定
 */
@Getter
@RequiredArgsConstructor
public enum TargetType {

    POST("1", "投稿"),
    ACCOUNT("2", "アカウント"),
    SETTING("3", "設定");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static TargetType fromCode(String code) {
        for (TargetType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid TargetType code: " + code);
    }
}
