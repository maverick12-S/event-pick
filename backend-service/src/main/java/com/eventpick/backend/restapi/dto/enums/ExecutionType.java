package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 実行種別 CHAR(1)。
 * 1:自動 / 2:手動 / 3:システム
 */
@Getter
@RequiredArgsConstructor
public enum ExecutionType {

    AUTO("1", "自動"),
    MANUAL("2", "手動"),
    SYSTEM("3", "システム");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static ExecutionType fromCode(String code) {
        for (ExecutionType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid ExecutionType code: " + code);
    }
}
