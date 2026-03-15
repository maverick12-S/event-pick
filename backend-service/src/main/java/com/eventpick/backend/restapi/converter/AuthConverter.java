package com.eventpick.backend.restapi.converter;

import org.springframework.stereotype.Component;

/**
 * 認証系DTO変換コンバーター。
 * HTTPリクエストパラメータをService層のDTOに変換する責務を持つ。
 */
@Component
public class AuthConverter {
    // Bean Validationで十分な場合はConverterの介入なし
    // 将来的にenum変換やデフォルト値適用が必要な場合に拡張
}
