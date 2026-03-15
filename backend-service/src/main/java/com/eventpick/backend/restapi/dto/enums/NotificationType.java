package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 通知種別 CHAR(1)。
 * 1:メール / 2:Push / 3:両方
 */
@Getter
@RequiredArgsConstructor
public enum NotificationType {

    EMAIL("1", "メール"),
    PUSH("2", "Push"),
    BOTH("3", "両方");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static NotificationType fromCode(String code) {
        for (NotificationType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid NotificationType code: " + code);
    }
}
