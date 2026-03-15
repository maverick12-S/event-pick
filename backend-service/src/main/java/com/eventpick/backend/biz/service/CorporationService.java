package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.request.CorporationsValidatePostRequest;

/**
 * 法人番号サービスインタフェース。
 */
public interface CorporationService {
    void validateCorporation(CorporationsValidatePostRequest request);
}
