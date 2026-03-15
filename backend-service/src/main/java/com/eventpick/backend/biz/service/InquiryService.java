package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.request.InquiryPostRequest;

/**
 * お問い合わせサービスインタフェース。
 */
public interface InquiryService {
    Object getInquiries();
    void createInquiry(InquiryPostRequest request);
}
