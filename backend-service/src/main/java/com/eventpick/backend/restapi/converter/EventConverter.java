package com.eventpick.backend.restapi.converter;

import com.eventpick.backend.restapi.dto.enums.EventStatus;
import org.springframework.stereotype.Component;

/**
 * イベント系DTO変換コンバーター。
 */
@Component
public class EventConverter {

    /**
     * イベントステータス文字列をenum変換する。
     */
    public EventStatus convertEventStatus(String code) {
        return EventStatus.fromCode(code);
    }
}
