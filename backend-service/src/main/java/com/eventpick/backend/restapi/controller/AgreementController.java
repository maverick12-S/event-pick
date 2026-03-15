package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AgreementService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.AgreementLogPostRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/agreement-logs")
@RequiredArgsConstructor
public class AgreementController {

    private final AgreementService agreementService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> recordAgreement(@RequestBody @Valid AgreementLogPostRequest request) {
        agreementService.recordAgreement(request);
        return CommonResponse.ok();
    }
}
