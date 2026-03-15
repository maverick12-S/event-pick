package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * ログイン種別 CHAR(1)。
 * 1:email / 2:phone / 3:google / 4:line
 */
@Getter
@RequiredArgsConstructor
public enum LoginType {

    EMAIL("1", "email"),
    PHONE("2", "phone"),
    GOOGLE("3", "google"),
    LINE("4", "line");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static LoginType fromCode(String code) {
        for (LoginType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid LoginType code: " + code);
    }
}
