package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AdminService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 管理コントローラー。
 * 全管理エンドポイント（約40件）を集約。
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final AdminService adminService;

    // ── 企業管理 ──

    /** GET /api/v1/admin/companies - [管理] 企業一覧 */
    @GetMapping("/companies")
    public CommonResponse<Object> getCompanies() {
        return CommonResponse.ok(adminService.getAdminCompanies());
    }

    /** GET /api/v1/admin/companies/{companyId} - [管理] 企業詳細 */
    @GetMapping("/companies/{companyId}")
    public CommonResponse<Object> getCompany(@PathVariable String companyId) {
        return CommonResponse.ok(adminService.getAdminCompany(companyId));
    }

    /** PATCH /api/v1/admin/companies/{companyId}/status - [管理] 企業ステータス変更 */
    @PatchMapping("/companies/{companyId}/status")
    public CommonResponse<Void> updateCompanyStatus(
            @PathVariable String companyId,
            @RequestBody @Valid AdminCompanyStatusPatchRequest request) {
        adminService.updateAdminCompanyStatus(companyId, request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/admin/companies/{companyId}/review - [管理] 企業レビュー */
    @PostMapping("/companies/{companyId}/review")
    public CommonResponse<Void> reviewCompany(@PathVariable String companyId) {
        adminService.reviewAdminCompany(companyId);
        return CommonResponse.ok();
    }

    // ── イベント管理 ──

    /** GET /api/v1/admin/events - [管理] イベント一覧 */
    @GetMapping("/events")
    public CommonResponse<Object> getEvents() {
        return CommonResponse.ok(adminService.getAdminEvents());
    }

    /** DELETE /api/v1/admin/events/{eventId} - [管理] イベント削除 */
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String eventId) {
        adminService.deleteAdminEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/v1/admin/events/{eventId}/hide - [管理] イベント非公開 */
    @PostMapping("/events/{eventId}/hide")
    public CommonResponse<Void> hideEvent(@PathVariable String eventId) {
        adminService.hideAdminEvent(eventId);
        return CommonResponse.ok();
    }

    // ── ユーザー管理 ──

    /** GET /api/v1/admin/users - [管理] ユーザー一覧 */
    @GetMapping("/users")
    public CommonResponse<Object> getUsers() {
        return CommonResponse.ok(adminService.getAdminUsers());
    }

    /** GET /api/v1/admin/users/{userId} - [管理] ユーザー詳細 */
    @GetMapping("/users/{userId}")
    public CommonResponse<Object> getUser(@PathVariable String userId) {
        return CommonResponse.ok(adminService.getAdminUser(userId));
    }

    /** DELETE /api/v1/admin/users/{userId} - [管理] ユーザー削除 */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteAdminUser(userId);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/v1/admin/users/{userId}/suspend - [管理] ユーザー停止 */
    @PostMapping("/users/{userId}/suspend")
    public CommonResponse<Void> suspendUser(@PathVariable String userId) {
        adminService.suspendAdminUser(userId);
        return CommonResponse.ok();
    }

    // ── レポート ──

    /** GET /api/v1/admin/reports/overview - [管理] レポート概要 */
    @GetMapping("/reports/overview")
    public CommonResponse<Object> getReportsOverview() {
        return CommonResponse.ok(adminService.getAdminReportsOverview());
    }

    // ── クーポン ──

    /** GET /api/v1/admin/coupons - [管理] クーポン一覧 */
    @GetMapping("/coupons")
    public CommonResponse<Object> getCoupons() {
        return CommonResponse.ok(adminService.getAdminCoupons());
    }

    /** POST /api/v1/admin/coupons - [管理] クーポン作成 */
    @PostMapping("/coupons")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createCoupon(@RequestBody @Valid AdminCouponPostRequest request) {
        adminService.createAdminCoupon(request);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/admin/coupons/{couponId} - [管理] クーポン削除 */
    @DeleteMapping("/coupons/{couponId}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable String couponId) {
        adminService.deleteAdminCoupon(couponId);
        return ResponseEntity.noContent().build();
    }

    // ── お問い合わせ ──

    /** GET /api/v1/admin/inquiries - [管理] お問い合わせ一覧 */
    @GetMapping("/inquiries")
    public CommonResponse<Object> getInquiries() {
        return CommonResponse.ok(adminService.getAdminInquiries());
    }

    /** GET /api/v1/admin/inquiries/{inquiryId} - [管理] お問い合わせ詳細 */
    @GetMapping("/inquiries/{inquiryId}")
    public CommonResponse<Object> getInquiry(@PathVariable String inquiryId) {
        return CommonResponse.ok(adminService.getAdminInquiry(inquiryId));
    }

    /** POST /api/v1/admin/inquiries/{inquiryId}/reply - [管理] お問い合わせ返信 */
    @PostMapping("/inquiries/{inquiryId}/reply")
    public CommonResponse<Void> replyInquiry(
            @PathVariable String inquiryId,
            @RequestBody @Valid AdminInquiryReplyPostRequest request) {
        adminService.replyAdminInquiry(inquiryId, request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/admin/inquiries/{inquiryId}/close - [管理] お問い合わせクローズ */
    @PostMapping("/inquiries/{inquiryId}/close")
    public CommonResponse<Void> closeInquiry(@PathVariable String inquiryId) {
        adminService.closeAdminInquiry(inquiryId);
        return CommonResponse.ok();
    }

    // ── カテゴリ ──

    /** GET /api/v1/admin/categories - [管理] カテゴリ一覧 */
    @GetMapping("/categories")
    public CommonResponse<Object> getCategories() {
        return CommonResponse.ok(adminService.getAdminCategories());
    }

    /** POST /api/v1/admin/categories - [管理] カテゴリ作成 */
    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createCategory(@RequestBody @Valid AdminCategoryPostRequest request) {
        adminService.createAdminCategory(request);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/admin/categories/{id} - [管理] カテゴリ削除 */
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        adminService.deleteAdminCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ── プラン ──

    /** GET /api/v1/admin/plans - [管理] プラン一覧 */
    @GetMapping("/plans")
    public CommonResponse<Object> getPlans() {
        return CommonResponse.ok(adminService.getAdminPlans());
    }

    /** PUT /api/v1/admin/plans/{id} - [管理] プラン更新 */
    @PutMapping("/plans/{id}")
    public CommonResponse<Void> updatePlan(@PathVariable String id) {
        adminService.updateAdminPlan(id);
        return CommonResponse.ok();
    }

    // ── レビュー ──

    /** GET /api/v1/admin/reviews - [管理] レビュー一覧 */
    @GetMapping("/reviews")
    public CommonResponse<Object> getReviews() {
        return CommonResponse.ok(adminService.getAdminReviews());
    }

    /** GET /api/v1/admin/reviews/{reviewId} - [管理] レビュー詳細 */
    @GetMapping("/reviews/{reviewId}")
    public CommonResponse<Object> getReview(@PathVariable String reviewId) {
        return CommonResponse.ok(adminService.getAdminReview(reviewId));
    }

    /** POST /api/v1/admin/reviews/{reviewId}/approve - [管理] レビュー承認 */
    @PostMapping("/reviews/{reviewId}/approve")
    public CommonResponse<Void> approveReview(@PathVariable String reviewId) {
        adminService.approveAdminReview(reviewId);
        return CommonResponse.ok();
    }

    /** POST /api/v1/admin/reviews/{reviewId}/reject - [管理] レビュー却下 */
    @PostMapping("/reviews/{reviewId}/reject")
    public CommonResponse<Void> rejectReview(
            @PathVariable String reviewId,
            @RequestBody(required = false) @Valid AdminReviewRejectPostRequest request) {
        adminService.rejectAdminReview(reviewId, request);
        return CommonResponse.ok();
    }

    // ── 設定 ──

    /** GET /api/v1/admin/settings - [管理] 設定取得 */
    @GetMapping("/settings")
    public CommonResponse<Object> getSettings() {
        return CommonResponse.ok(adminService.getAdminSettings());
    }

    /** PUT /api/v1/admin/settings - [管理] 設定更新 */
    @PutMapping("/settings")
    public CommonResponse<Void> updateSettings(@RequestBody @Valid AdminSettingsPutRequest request) {
        adminService.updateAdminSettings(request);
        return CommonResponse.ok();
    }

    // ── ログ ──

    /** GET /api/v1/admin/auth-logs - [管理] 認証ログ一覧 */
    @GetMapping("/auth-logs")
    public CommonResponse<Object> getAuthLogs(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(adminService.getAdminAuthLogs(limit, page));
    }

    /** GET /api/v1/admin/activity-logs - [管理] アクティビティログ一覧 */
    @GetMapping("/activity-logs")
    public CommonResponse<Object> getActivityLogs(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(adminService.getAdminActivityLogs(limit, page));
    }

    // ── 一般ユーザー（消費者） ──

    /** GET /api/v1/admin/consumers - [管理] 一般ユーザー一覧 */
    @GetMapping("/consumers")
    public CommonResponse<Object> getConsumers() {
        return CommonResponse.ok(adminService.getAdminConsumers());
    }

    /** GET /api/v1/admin/consumers/{userId} - [管理] 一般ユーザー詳細 */
    @GetMapping("/consumers/{userId}")
    public CommonResponse<Object> getConsumer(@PathVariable String userId) {
        return CommonResponse.ok(adminService.getAdminConsumer(userId));
    }

    /** POST /api/v1/admin/consumers/{userId}/suspend - [管理] 一般ユーザー停止 */
    @PostMapping("/consumers/{userId}/suspend")
    public CommonResponse<Void> suspendConsumer(@PathVariable String userId) {
        adminService.suspendAdminConsumer(userId);
        return CommonResponse.ok();
    }

    /** POST /api/v1/admin/consumers/{userId}/delete-schedule - [管理] 一般ユーザー削除予約 */
    @PostMapping("/consumers/{userId}/delete-schedule")
    public CommonResponse<Void> scheduleDeleteConsumer(@PathVariable String userId) {
        adminService.scheduleDeleteAdminConsumer(userId);
        return CommonResponse.ok();
    }

    // ── 拠点アカウント ──

    /** GET /api/v1/admin/location-accounts - [管理] 拠点アカウント一覧 */
    @GetMapping("/location-accounts")
    public CommonResponse<Object> getLocationAccounts() {
        return CommonResponse.ok(adminService.getAdminLocationAccounts());
    }

    /** GET /api/v1/admin/location-accounts/{companyId} - [管理] 拠点アカウント詳細 */
    @GetMapping("/location-accounts/{companyId}")
    public CommonResponse<Object> getLocationAccount(@PathVariable String companyId) {
        return CommonResponse.ok(adminService.getAdminLocationAccount(companyId));
    }

    /** POST /api/v1/admin/location-accounts/{companyId}/suspend - [管理] 拠点アカウント停止 */
    @PostMapping("/location-accounts/{companyId}/suspend")
    public CommonResponse<Void> suspendLocationAccount(@PathVariable String companyId) {
        adminService.suspendAdminLocationAccount(companyId);
        return CommonResponse.ok();
    }

    /** POST /api/v1/admin/location-accounts/{companyId}/delete-schedule - [管理] 拠点アカウント削除予約 */
    @PostMapping("/location-accounts/{companyId}/delete-schedule")
    public CommonResponse<Void> scheduleDeleteLocationAccount(@PathVariable String companyId) {
        adminService.scheduleDeleteAdminLocationAccount(companyId);
        return CommonResponse.ok();
    }

    // ── 地域マスタ ──

    /** GET /api/v1/admin/master/regions - [管理] 地域マスタ一覧 */
    @GetMapping("/master/regions")
    public CommonResponse<Object> getRegions() {
        return CommonResponse.ok(adminService.getAdminRegions());
    }

    /** POST /api/v1/admin/master/regions - [管理] 地域マスタ作成 */
    @PostMapping("/master/regions")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createRegion() {
        adminService.createAdminRegion();
        return CommonResponse.ok();
    }

    /** PUT /api/v1/admin/master/regions/{id} - [管理] 地域マスタ更新 */
    @PutMapping("/master/regions/{id}")
    public CommonResponse<Void> updateRegion(@PathVariable String id) {
        adminService.updateAdminRegion(id);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/admin/master/regions/{id} - [管理] 地域マスタ削除 */
    @DeleteMapping("/master/regions/{id}")
    public ResponseEntity<Void> deleteRegion(@PathVariable String id) {
        adminService.deleteAdminRegion(id);
        return ResponseEntity.noContent().build();
    }
}
