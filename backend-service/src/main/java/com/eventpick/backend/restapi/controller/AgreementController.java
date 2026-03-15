package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AgreementService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.AgreementLogPostRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/agreement-logs")
@RequiredArgsConstructor
@Tag(name = "同意記録 (Agreement)", description = "利用規約同意ログ記録")
public class AgreementController {

    private final AgreementService agreementService;

    @Operation(summary = "同意記録", description = "利用規約への同意をログ記録する。")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> recordAgreement(@RequestBody @Valid AgreementLogPostRequest request) {
        agreementService.recordAgreement(request);
        return CommonResponse.ok();
    }
}
