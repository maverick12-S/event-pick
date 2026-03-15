package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 割引種別 CHAR(1)。
 * 1:金額 / 2:率
 */
@Getter
@RequiredArgsConstructor
public enum DiscountType {

    AMOUNT("1", "金額"),
    PERCENTAGE("2", "率");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static DiscountType fromCode(String code) {
        for (DiscountType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Invalid DiscountType code: " + code);
    }
}
