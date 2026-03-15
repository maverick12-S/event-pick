package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.CompanyService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.CompanyDto;
import com.eventpick.backend.restapi.dto.CompanyNotificationDto;
import com.eventpick.backend.restapi.dto.CompanyReviewDto;
import com.eventpick.backend.restapi.dto.request.CompanyStatusPatchRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 企業コントローラー。
 * 11エンドポイント: me(GET/PUT), me/notifications, companies(GET/POST), {companyId}(GET/PUT/DELETE), status, review, drafts
 */
@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Validated
@Tag(name = "企業 (Company)", description = "企業CRUD, 自社情報, レビュー, 下書き")
public class CompanyController {

    private final CompanyService companyService;

    /** GET /api/v1/companies/me - 自社情報取得 */
    @Operation(summary = "自社情報取得", description = "JWTから特定した自社の企業情報を取得する。")
    @GetMapping("/me")
    public CommonResponse<CompanyDto> getMyCompany() {
        return CommonResponse.ok(companyService.getMyCompany());
    }

    /** PUT /api/v1/companies/me - 自社情報更新 */
    @Operation(summary = "自社情報更新", description = "自社の企業情報を更新する。")
    @PutMapping("/me")
    public CommonResponse<Void> updateMyCompany(@RequestBody @Valid CompanyDto request) {
        companyService.updateMyCompany(request);
        return CommonResponse.ok();
    }

    /** GET /api/v1/companies/me/notifications - 自社通知一覧 */
    @Operation(summary = "自社通知一覧", description = "自社向けの通知一覧を取得する。")
    @GetMapping("/me/notifications")
    public CommonResponse<List<CompanyNotificationDto>> getMyNotifications() {
        return CommonResponse.ok(companyService.getMyNotifications());
    }

    /** GET /api/v1/companies - 企業一覧 */
    @Operation(summary = "企業一覧", description = "ページネーション付きで企業一覧を取得する。")
    @GetMapping
    public CommonResponse<List<CompanyDto>> getCompanies(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(companyService.getCompanies(limit, page));
    }

    /** POST /api/v1/companies - 企業作成 */
    @Operation(summary = "企業作成", description = "新規企業を登録する。")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createCompany(@RequestBody @Valid CompanyDto request) {
        companyService.createCompany(request);
        return CommonResponse.ok();
    }

    /** GET /api/v1/companies/{companyId} - 企業詳細 */
    @Operation(summary = "企業詳細", description = "指定企業IDの詳細情報を取得する。")
    @GetMapping("/{companyId}")
    public CommonResponse<CompanyDto> getCompany(@PathVariable String companyId) {
        return CommonResponse.ok(companyService.getCompany(companyId));
    }

    /** PUT /api/v1/companies/{companyId} - 企業更新 */
    @Operation(summary = "企業更新", description = "指定企業の情報を更新する。")
    @PutMapping("/{companyId}")
    public CommonResponse<Void> updateCompany(
            @PathVariable String companyId,
            @RequestBody @Valid CompanyDto request) {
        companyService.updateCompany(companyId, request);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/companies/{companyId} - 企業削除 */
    @Operation(summary = "企業削除", description = "指定企業を論理削除する。")
    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable String companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }

    /** PATCH /api/v1/companies/{companyId}/status - 企業ステータス変更 */
    @Operation(summary = "企業ステータス変更", description = "企業のアカウントステータスを変更する。")
    @PatchMapping("/{companyId}/status")
    public CommonResponse<Void> updateCompanyStatus(
            @PathVariable String companyId,
            @RequestBody @Valid CompanyStatusPatchRequest request) {
        companyService.updateCompanyStatus(companyId, request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/companies/{companyId}/review - 企業レビュー申請 */
    @Operation(summary = "企業レビュー申請", description = "企業情報のレビュー申請を行う。")
    @PostMapping("/{companyId}/review")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> submitCompanyReview(
            @PathVariable String companyId,
            @RequestBody @Valid CompanyReviewDto request) {
        companyService.submitCompanyReview(companyId, request);
        return CommonResponse.ok();
    }

    /** GET /api/v1/companies/drafts - 下書き企業一覧 */
    @Operation(summary = "下書き企業一覧", description = "下書きステータスの企業一覧を取得する。")
    @GetMapping("/drafts")
    public CommonResponse<List<CompanyDto>> getDraftCompanies() {
        return CommonResponse.ok(companyService.getDraftCompanies());
    }
}
