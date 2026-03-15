package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 企業種別 CHAR(1)。
 * 1:法人 / 2:個人事業
 */
@Getter
@RequiredArgsConstructor
public enum CompanyType {

    CORPORATION("1", "法人"),
    SOLE_PROPRIETOR("2", "個人事業");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static CompanyType fromCode(String code) {
        for (CompanyType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid CompanyType code: " + code);
    }
}
