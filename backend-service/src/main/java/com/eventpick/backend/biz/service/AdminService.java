package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.request.*;

/**
 * 管理サービスインタフェース。
 */
public interface AdminService {
    // 企業管理
    Object getAdminCompanies();
    Object getAdminCompany(String companyId);
    void updateAdminCompanyStatus(String companyId, AdminCompanyStatusPatchRequest request);
    void reviewAdminCompany(String companyId);

    // イベント管理
    Object getAdminEvents();
    void deleteAdminEvent(String eventId);
    void hideAdminEvent(String eventId);

    // ユーザー管理
    Object getAdminUsers();
    Object getAdminUser(String userId);
    void deleteAdminUser(String userId);
    void suspendAdminUser(String userId);

    // レポート
    Object getAdminReportsOverview();

    // クーポン
    Object getAdminCoupons();
    void createAdminCoupon(AdminCouponPostRequest request);
    void deleteAdminCoupon(String couponId);

    // お問い合わせ
    Object getAdminInquiries();
    Object getAdminInquiry(String inquiryId);
    void replyAdminInquiry(String inquiryId, AdminInquiryReplyPostRequest request);
    void closeAdminInquiry(String inquiryId);

    // カテゴリ
    Object getAdminCategories();
    void createAdminCategory(AdminCategoryPostRequest request);
    void deleteAdminCategory(String id);

    // プラン
    Object getAdminPlans();
    void updateAdminPlan(String id);

    // レビュー
    Object getAdminReviews();
    Object getAdminReview(String reviewId);
    void approveAdminReview(String reviewId);
    void rejectAdminReview(String reviewId, AdminReviewRejectPostRequest request);

    // 設定
    Object getAdminSettings();
    void updateAdminSettings(AdminSettingsPutRequest request);

    // ログ
    Object getAdminAuthLogs(Integer limit, Integer page);
    Object getAdminActivityLogs(Integer limit, Integer page);

    // 一般ユーザー
    Object getAdminConsumers();
    Object getAdminConsumer(String userId);
    void suspendAdminConsumer(String userId);
    void scheduleDeleteAdminConsumer(String userId);

    // 拠点アカウント
    Object getAdminLocationAccounts();
    Object getAdminLocationAccount(String companyId);
    void suspendAdminLocationAccount(String companyId);
    void scheduleDeleteAdminLocationAccount(String companyId);

    // 地域マスタ
    Object getAdminRegions();
    void createAdminRegion();
    void updateAdminRegion(String id);
    void deleteAdminRegion(String id);
}
