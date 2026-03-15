package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * サブスクリプション状態。
 */
@Getter
@RequiredArgsConstructor
public enum SubscriptionStatus {

    ACTIVE("active"),
    PAST_DUE("past_due"),
    CANCELED("canceled"),
    TRIALING("trialing");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    public static SubscriptionStatus fromValue(String value) {
        for (SubscriptionStatus s : values()) {
            if (s.value.equals(value)) return s;
        }
        throw new IllegalArgumentException("Invalid SubscriptionStatus: " + value);
    }
}
