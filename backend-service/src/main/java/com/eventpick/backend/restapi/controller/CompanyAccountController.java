package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.CompanyAccountService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.CompanyAccountDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 拠点アカウントコントローラー。
 */
@RestController
@RequestMapping("/api/v1/company-accounts")
@RequiredArgsConstructor
@Validated
public class CompanyAccountController {

    private final CompanyAccountService companyAccountService;

    /** GET /api/v1/company-accounts - 拠点アカウント一覧 */
    @GetMapping
    public CommonResponse<List<CompanyAccountDto>> getCompanyAccounts(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(companyAccountService.getCompanyAccounts(limit, page));
    }

    /** GET /api/v1/company-accounts/{accountId} - 拠点アカウント詳細 */
    @GetMapping("/{accountId}")
    public CommonResponse<CompanyAccountDto> getCompanyAccount(@PathVariable String accountId) {
        return CommonResponse.ok(companyAccountService.getCompanyAccount(accountId));
    }

    /** PUT /api/v1/company-accounts/{accountId} - 拠点アカウント更新 */
    @PutMapping("/{accountId}")
    public CommonResponse<Void> updateCompanyAccount(
            @PathVariable String accountId,
            @RequestBody @Valid CompanyAccountDto request) {
        companyAccountService.updateCompanyAccount(accountId, request);
        return CommonResponse.ok();
    }
}
