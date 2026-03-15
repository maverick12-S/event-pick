package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.CorporationService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.CorporationsValidatePostRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 法人番号コントローラー。
 */
@RestController
@RequestMapping("/api/v1/corporations")
@RequiredArgsConstructor
@Validated
public class CorporationController {

    private final CorporationService corporationService;

    /** POST /api/v1/corporations/validate - 法人番号バリデーション (認証不要) */
    @PostMapping("/validate")
    public CommonResponse<Void> validate(@RequestBody @Valid CorporationsValidatePostRequest request) {
        corporationService.validateCorporation(request);
        return CommonResponse.ok();
    }
}
