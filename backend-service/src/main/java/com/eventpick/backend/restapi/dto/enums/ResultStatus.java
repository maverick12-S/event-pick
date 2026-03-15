package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 結果ステータス CHAR(1)。
 * 1:成功 / 2:失敗
 */
@Getter
@RequiredArgsConstructor
public enum ResultStatus {

    SUCCESS("1", "成功"),
    FAILURE("2", "失敗");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static ResultStatus fromCode(String code) {
        for (ResultStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Invalid ResultStatus code: " + code);
    }
}
