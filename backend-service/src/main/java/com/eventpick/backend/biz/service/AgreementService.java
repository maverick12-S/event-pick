package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.request.AgreementLogPostRequest;

/**
 * 同意ログサービスインタフェース。
 */
public interface AgreementService {
    void recordAgreement(AgreementLogPostRequest request);
}
