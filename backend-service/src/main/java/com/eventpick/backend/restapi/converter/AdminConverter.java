package com.eventpick.backend.restapi.converter;

import com.eventpick.backend.restapi.dto.enums.DiscountType;
import org.springframework.stereotype.Component;

/**
 * 管理系DTO変換コンバーター。
 */
@Component
public class AdminConverter {

    /**
     * 割引種別文字列をenum変換する。
     */
    public DiscountType convertDiscountType(String code) {
        return DiscountType.fromCode(code);
    }
}
