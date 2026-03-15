package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.CorporationService;
import com.eventpick.backend.restapi.dto.request.CorporationsValidatePostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CorporationServiceImpl implements CorporationService {

    @Override
    public void validateCorporation(CorporationsValidatePostRequest request) {
        log.info("Corporation validation requested: {}", request.getCompanyCode());
        // TODO: 国税庁 法人番号API呼び出しで検証
    }
}
