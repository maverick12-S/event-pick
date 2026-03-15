package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 申請種別 CHAR(1)。
 * 1:新規 / 2:更新 / 3:再申請
 */
@Getter
@RequiredArgsConstructor
public enum ReviewType {

    NEW("1", "新規"),
    UPDATE("2", "更新"),
    REAPPLY("3", "再申請");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static ReviewType fromCode(String code) {
        for (ReviewType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid ReviewType code: " + code);
    }
}
