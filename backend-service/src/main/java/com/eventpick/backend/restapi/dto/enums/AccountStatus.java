package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * アカウントステータス CHAR(1)。
 * 1:有効 / 2:停止
 */
@Getter
@RequiredArgsConstructor
public enum AccountStatus {

    ACTIVE("1", "有効"),
    SUSPENDED("2", "停止");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static AccountStatus fromCode(String code) {
        for (AccountStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Invalid AccountStatus code: " + code);
    }
}
