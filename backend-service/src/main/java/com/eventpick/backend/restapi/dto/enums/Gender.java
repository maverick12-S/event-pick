package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 性別 CHAR(1)。
 * 1:男性 / 2:女性 / 3:その他
 */
@Getter
@RequiredArgsConstructor
public enum Gender {

    MALE("1", "男性"),
    FEMALE("2", "女性"),
    OTHER("3", "その他");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static Gender fromCode(String code) {
        for (Gender g : values()) {
            if (g.code.equals(code)) return g;
        }
        throw new IllegalArgumentException("Invalid Gender code: " + code);
    }
}
