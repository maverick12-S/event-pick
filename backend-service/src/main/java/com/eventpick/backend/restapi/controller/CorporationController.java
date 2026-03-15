package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.CorporationService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.CorporationsValidatePostRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "法人番号 (Corporation)", description = "法人番号バリデーション (認証不要)")
public class CorporationController {

    private final CorporationService corporationService;

    /** POST /api/v1/corporations/validate - 法人番号バリデーション (認証不要) */
    @Operation(summary = "法人番号バリデーション", description = "法人番号の存在確認を行う。認証不要。")
    @PostMapping("/validate")
    public CommonResponse<Void> validate(@RequestBody @Valid CorporationsValidatePostRequest request) {
        corporationService.validateCorporation(request);
        return CommonResponse.ok();
    }
}
