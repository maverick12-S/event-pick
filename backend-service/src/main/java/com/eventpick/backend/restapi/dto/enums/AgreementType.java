package com.eventpick.backend.restapi.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 同意種別。
 */
@Getter
@RequiredArgsConstructor
public enum AgreementType {

    PRIVACY_POLICY("PRIVACY_POLICY"),
    TERMS_OF_SERVICE("TERMS_OF_SERVICE"),
    LICENSE_AGREEMENT("LICENSE_AGREEMENT");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    public static AgreementType fromValue(String value) {
        for (AgreementType t : values()) {
            if (t.value.equals(value)) return t;
        }
        throw new IllegalArgumentException("Invalid AgreementType: " + value);
    }
}
