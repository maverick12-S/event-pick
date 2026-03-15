package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 企業ロール CHAR(2)。
 * 01:親企業 / 02:子拠点 / 03:運営
 */
@Getter
@RequiredArgsConstructor
public enum Roles {

    PARENT("01", "親企業"),
    CHILD("02", "子拠点"),
    ADMIN("03", "運営");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static Roles fromCode(String code) {
        for (Roles r : values()) {
            if (r.code.equals(code)) return r;
        }
        throw new IllegalArgumentException("Invalid Roles code: " + code);
    }
}
