package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 審査ステータス CHAR(1)。
 * 1:申請中 / 2:承認 / 3:差戻し / 4:却下
 */
@Getter
@RequiredArgsConstructor
public enum ReviewStatus {

    PENDING("1", "申請中"),
    APPROVED("2", "承認"),
    RETURNED("3", "差戻し"),
    REJECTED("4", "却下");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static ReviewStatus fromCode(String code) {
        for (ReviewStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Invalid ReviewStatus code: " + code);
    }
}
