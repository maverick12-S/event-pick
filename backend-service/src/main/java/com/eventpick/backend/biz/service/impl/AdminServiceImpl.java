package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.AdminService;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.domain.entity.*;
import com.eventpick.backend.domain.repository.*;
import com.eventpick.backend.restapi.dto.request.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final CompanyRepository companyRepository;
    private final CompanyAccountRepository companyAccountRepository;
    private final EventPostRepository eventPostRepository;
    private final UserAccountRepository userAccountRepository;
    private final CouponRepository couponRepository;
    private final InquiryRepository inquiryRepository;
    private final CategoryRepository categoryRepository;
    private final PlanRepository planRepository;
    private final CompanyReviewRepository reviewRepository;
    private final SystemSettingRepository settingRepository;
    private final AuditLogRepository auditLogRepository;
    private final RegionRepository regionRepository;
    private final CompanyTicketRepository ticketRepository;

    // ── 企業管理 ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminCompanies() {
        return companyRepository.findByIsDeletedFalse(PageRequest.of(0, 100, Sort.by("createdAt").descending())).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminCompany(String companyId) {
        return companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
    }

    @Override
    public void updateAdminCompanyStatus(String companyId, AdminCompanyStatusPatchRequest request) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        company.setAccountStatus(request.getStatus());
        companyRepository.save(company);
        log.info("[Admin] Company status updated: {} -> {}", companyId, request.getStatus());
    }

    @Override
    public void reviewAdminCompany(String companyId) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        company.setReviewStatus("2"); // 承認
        companyRepository.save(company);
        log.info("[Admin] Company reviewed: {}", companyId);
    }

    // ── イベント管理 ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminEvents() {
        return eventPostRepository.findByIsDeletedFalse(PageRequest.of(0, 100, Sort.by("createdAt").descending())).getContent();
    }

    @Override
    public void deleteAdminEvent(String eventId) {
        EventPost event = eventPostRepository.findByPostIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("EventPost", "postId", eventId));
        event.setIsDeleted(true);
        eventPostRepository.save(event);
        log.info("[Admin] Event deleted: {}", eventId);
    }

    @Override
    public void hideAdminEvent(String eventId) {
        EventPost event = eventPostRepository.findByPostIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("EventPost", "postId", eventId));
        event.setStatus("1"); // 公開前
        eventPostRepository.save(event);
        log.info("[Admin] Event hidden: {}", eventId);
    }

    // ── ユーザー管理 ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminUsers() {
        return userAccountRepository.findByIsDeletedFalse(PageRequest.of(0, 100)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminUser(String userId) {
        return userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
    }

    @Override
    public void deleteAdminUser(String userId) {
        UserAccount user = userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
        user.setIsDeleted(true);
        userAccountRepository.save(user);
        log.info("[Admin] User deleted: {}", userId);
    }

    @Override
    public void suspendAdminUser(String userId) {
        UserAccount user = userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
        user.setIsActive(false);
        userAccountRepository.save(user);
        log.info("[Admin] User suspended: {}", userId);
    }

    // ── レポート ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminReportsOverview() {
        return Map.of(
                "totalCompanies", companyRepository.count(),
                "totalEvents", eventPostRepository.count(),
                "totalUsers", userAccountRepository.count()
        );
    }

    // ── クーポン ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminCoupons() {
        return couponRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Override
    public void createAdminCoupon(AdminCouponPostRequest request) {
        Coupon coupon = Coupon.builder()
                .couponId(IdGenerator.generateUlid())
                .couponCode(request.getCode())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .usedCount(0)
                .isActive(true)
                .build();
        couponRepository.save(coupon);
        log.info("[Admin] Coupon created: {}", coupon.getCouponCode());
    }

    @Override
    public void deleteAdminCoupon(String couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "couponId", couponId));
        coupon.setIsActive(false);
        couponRepository.save(coupon);
        log.info("[Admin] Coupon deactivated: {}", couponId);
    }

    // ── お問い合わせ ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminInquiries() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 100)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminInquiry(String inquiryId) {
        return inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry", "inquiryId", inquiryId));
    }

    @Override
    public void replyAdminInquiry(String inquiryId, AdminInquiryReplyPostRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry", "inquiryId", inquiryId));
        inquiry.setReplyBody(request.getBody());
        inquiry.setRepliedAt(LocalDateTime.now());
        inquiry.setStatus("replied");
        inquiryRepository.save(inquiry);
        log.info("[Admin] Inquiry replied: {}", inquiryId);
    }

    @Override
    public void closeAdminInquiry(String inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry", "inquiryId", inquiryId));
        inquiry.setStatus("closed");
        inquiry.setClosedAt(LocalDateTime.now());
        inquiryRepository.save(inquiry);
        log.info("[Admin] Inquiry closed: {}", inquiryId);
    }

    // ── カテゴリ ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminCategories() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrder();
    }

    @Override
    public void createAdminCategory(AdminCategoryPostRequest request) {
        Category category = Category.builder()
                .categoryId(IdGenerator.generateUlid())
                .categoryName(request.getCategoryName())
                .isActive(true)
                .build();
        categoryRepository.save(category);
        log.info("[Admin] Category created: {}", category.getCategoryName());
    }

    @Override
    public void deleteAdminCategory(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", id));
        category.setIsActive(false);
        categoryRepository.save(category);
        log.info("[Admin] Category deactivated: {}", id);
    }

    // ── プラン ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminPlans() {
        return planRepository.findByIsActiveTrueOrderBySortOrder();
    }

    @Override
    public void updateAdminPlan(String id) {
        planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", "planId", id));
        // TODO: プラン更新の具体的な実装
        log.info("[Admin] Plan updated: {}", id);
    }

    // ── レビュー ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminReviews() {
        return reviewRepository.findByReviewStatus("1", PageRequest.of(0, 100)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminReview(String reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyReview", "reviewId", reviewId));
    }

    @Override
    public void approveAdminReview(String reviewId) {
        CompanyReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyReview", "reviewId", reviewId));
        review.setReviewStatus("2"); // 承認
        review.setReviewedAt(LocalDateTime.now());
        reviewRepository.save(review);
        // 企業のreviewStatusも更新
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(review.getCompanyId()).orElse(null);
        if (company != null) {
            company.setReviewStatus("2");
            companyRepository.save(company);
        }
        log.info("[Admin] Review approved: {}", reviewId);
    }

    @Override
    public void rejectAdminReview(String reviewId, AdminReviewRejectPostRequest request) {
        CompanyReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyReview", "reviewId", reviewId));
        review.setReviewStatus("4"); // 却下
        review.setReviewComment(request != null ? request.getReason() : null);
        review.setReviewedAt(LocalDateTime.now());
        reviewRepository.save(review);
        log.info("[Admin] Review rejected: {}", reviewId);
    }

    // ── 設定 ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminSettings() {
        return settingRepository.findAll();
    }

    @Override
    public void updateAdminSettings(AdminSettingsPutRequest request) {
        // TODO: 設定更新の具体的な実装
        log.info("[Admin] Settings updated");
    }

    // ── ログ ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminAuthLogs(Integer limit, Integer page) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc("AUTH", PageRequest.of(page - 1, limit)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminActivityLogs(Integer limit, Integer page) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, limit)).getContent();
    }

    // ── 一般ユーザー（消費者） ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminConsumers() {
        return userAccountRepository.findByIsDeletedFalse(PageRequest.of(0, 100)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminConsumer(String userId) {
        return userAccountRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "userId", userId));
    }

    @Override
    public void suspendAdminConsumer(String userId) {
        suspendAdminUser(userId);
    }

    @Override
    public void scheduleDeleteAdminConsumer(String userId) {
        log.info("[Admin] Consumer delete scheduled: {}", userId);
        // TODO: 削除予約タスク登録
    }

    // ── 拠点アカウント ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminLocationAccounts() {
        return companyAccountRepository.findByIsDeletedFalse(PageRequest.of(0, 100)).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Object getAdminLocationAccount(String companyId) {
        return companyAccountRepository.findByAccountIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyAccount", "accountId", companyId));
    }

    @Override
    public void suspendAdminLocationAccount(String companyId) {
        CompanyAccount account = companyAccountRepository.findByAccountIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyAccount", "accountId", companyId));
        account.setAccountStatus("2"); // 停止
        companyAccountRepository.save(account);
        log.info("[Admin] Location account suspended: {}", companyId);
    }

    @Override
    public void scheduleDeleteAdminLocationAccount(String companyId) {
        log.info("[Admin] Location account delete scheduled: {}", companyId);
        // TODO: 削除予約タスク登録
    }

    // ── 地域マスタ ──

    @Override
    @Transactional(readOnly = true)
    public Object getAdminRegions() {
        return regionRepository.findByIsActiveTrueOrderBySortOrder();
    }

    @Override
    public void createAdminRegion() {
        Region region = Region.builder()
                .regionId(IdGenerator.generateUlid())
                .regionName("新規地域")
                .isActive(true)
                .build();
        regionRepository.save(region);
        log.info("[Admin] Region created: {}", region.getRegionId());
    }

    @Override
    public void updateAdminRegion(String id) {
        regionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Region", "regionId", id));
        // TODO: 地域マスタ更新の具体的な実装
        log.info("[Admin] Region updated: {}", id);
    }

    @Override
    public void deleteAdminRegion(String id) {
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Region", "regionId", id));
        region.setIsActive(false);
        regionRepository.save(region);
        log.info("[Admin] Region deactivated: {}", id);
    }
}
