package com.eventpick.backend.restapi.converter;

import com.eventpick.backend.restapi.dto.enums.CompanyType;
import org.springframework.stereotype.Component;

/**
 * 企業系DTO変換コンバーター。
 */
@Component
public class CompanyConverter {

    /**
     * 企業種別文字列をenum変換する。
     */
    public CompanyType convertCompanyType(String code) {
        return CompanyType.fromCode(code);
    }
}
