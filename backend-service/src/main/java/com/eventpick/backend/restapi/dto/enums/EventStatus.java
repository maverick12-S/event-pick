package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * イベント公開状態 CHAR(1)。
 * 1:公開前 / 2:公開中 / 3:終了
 */
@Getter
@RequiredArgsConstructor
public enum EventStatus {

    BEFORE_PUBLISH("1", "公開前"),
    PUBLISHED("2", "公開中"),
    ENDED("3", "終了");

    private final String code;
    private final String label;

    @JsonValue
    public String getCode() {
        return code;
    }

    public static EventStatus fromCode(String code) {
        for (EventStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Invalid EventStatus code: " + code);
    }
}
