package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BadRequestException;
import com.eventpick.backend.biz.exception.MessageEnum;
import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.CompanyService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.CompanyNotification;
import com.eventpick.backend.domain.entity.CompanyReview;
import com.eventpick.backend.domain.repository.CompanyNotificationRepository;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.CompanyReviewRepository;
import com.eventpick.backend.restapi.dto.CompanyDto;
import com.eventpick.backend.restapi.dto.CompanyNotificationDto;
import com.eventpick.backend.restapi.dto.CompanyReviewDto;
import com.eventpick.backend.restapi.dto.request.CompanyStatusPatchRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyNotificationRepository notificationRepository;
    private final CompanyReviewRepository reviewRepository;
    private final AuditLogHelper auditLogHelper;

    @Override
    @Cacheable(value = "companies", key = "#root.methodName")
    @Transactional(readOnly = true)
    public CompanyDto getMyCompany() {
        String sub = SecurityUtils.getCurrentUserSub()
                .orElseThrow(() -> new ResourceNotFoundException("Company", "cognitoSub", "current user"));
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "cognitoSub", sub));
        return toDto(company);
    }

    @Override
    @CacheEvict(value = "companies", allEntries = true)
    public void updateMyCompany(CompanyDto request) {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "cognitoSub", sub));
        updateEntityFromDto(company, request);
        companyRepository.save(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyNotificationDto> getMyNotifications() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElseThrow();
        return notificationRepository.findByCompanyIdOrderByCreatedAtDesc(company.getCompanyId())
                .stream().map(this::toNotificationDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getCompanies(Integer limit, Integer page) {
        return companyRepository.findByIsDeletedFalse(PageRequest.of(page - 1, limit))
                .stream().map(this::toDto).toList();
    }

    @Override
    public void createCompany(CompanyDto request) {
        // 法人番号の重複チェック
        if (request.getCompanyCode() != null) {
            companyRepository.findByCompanyCodeAndIsDeletedFalse(request.getCompanyCode())
                    .ifPresent(existing -> {
                        throw new BadRequestException(MessageEnum.CONFLICT)
                                .context("companyCode", request.getCompanyCode(), "この法人番号は既に登録されています");
                    });
        }

        Company company = Company.builder()
                .companyId(IdGenerator.generateUlid())
                .companyCode(request.getCompanyCode())
                .companyName(request.getCompanyName())
                .displayName(request.getDisplayName())
                .companyType(request.getCompanyType())
                .representativeName(request.getRepresentativeName())
                .adminEmail(request.getAdminEmail())
                .adminPhone(request.getAdminPhone())
                .accountStatus("1") // 有効
                .reviewStatus("0")  // 未審査
                .isDeleted(false)
                .build();
        companyRepository.save(company);
        auditLogHelper.log(company.getCompanyId(), "company", "COMPANY_CREATE",
                "C", company.getCompanyId(), "企業登録: " + company.getCompanyName());
        log.info("Company created: {}", company.getCompanyId());
    }

    @Override
    @Cacheable(value = "companies", key = "#companyId")
    @Transactional(readOnly = true)
    public CompanyDto getCompany(String companyId) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        return toDto(company);
    }

    @Override
    @CacheEvict(value = "companies", allEntries = true)
    public void updateCompany(String companyId, CompanyDto request) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        updateEntityFromDto(company, request);
        companyRepository.save(company);
    }

    @Override
    @CacheEvict(value = "companies", allEntries = true)
    public void deleteCompany(String companyId) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        company.setIsDeleted(true);
        companyRepository.save(company);
        auditLogHelper.log(companyId, "company", "COMPANY_DELETE",
                "C", companyId, "企業論理削除: " + company.getCompanyName());
        log.info("Company soft deleted: {}", companyId);
    }

    @Override
    public void updateCompanyStatus(String companyId, CompanyStatusPatchRequest request) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        String oldStatus = company.getAccountStatus();
        company.setAccountStatus(request.getStatus());
        companyRepository.save(company);
        auditLogHelper.log(companyId, "admin", "COMPANY_STATUS_CHANGE",
                "C", companyId, "ステータス変更: " + oldStatus + " → " + request.getStatus());
    }

    @Override
    public void submitCompanyReview(String companyId, CompanyReviewDto request) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));

        // 既に審査中の申請がないかチェック
        List<CompanyReview> pending = reviewRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        boolean hasPending = pending.stream()
                .anyMatch(r -> "1".equals(r.getReviewStatus())); // 1:申請中
        if (hasPending) {
            throw new BadRequestException(MessageEnum.BUSINESS_ERROR)
                    .context("companyId", companyId, "審査中の申請が既に存在します");
        }

        CompanyReview review = CompanyReview.builder()
                .reviewId(IdGenerator.generateUlid())
                .companyId(companyId)
                .reviewType(request.getReviewType())
                .reviewStatus("1") // 申請中
                .submittedAt(LocalDateTime.now())
                .build();
        reviewRepository.save(review);

        // 企業の審査ステータスも更新
        company.setReviewStatus("1"); // 審査中
        companyRepository.save(company);

        // 企業へ通知送信
        CompanyNotification notification = CompanyNotification.builder()
                .notificationId(IdGenerator.generateUlid())
                .companyId(companyId)
                .title("審査申請を受け付けました")
                .message("審査申請（種別: " + request.getReviewType() + "）を受け付けました。結果は後日通知いたします。")
                .notificationType("1") // 審査関連
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        auditLogHelper.log(companyId, "company", "REVIEW_SUBMIT",
                "R", review.getReviewId(), "審査申請: 種別=" + request.getReviewType());
        log.info("Company review submitted: companyId={}, reviewId={}", companyId, review.getReviewId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getDraftCompanies() {
        return companyRepository.findDraftCompanies()
                .stream().map(this::toDto).toList();
    }

    // ── Private helpers ──

    private CompanyDto toDto(Company entity) {
        return CompanyDto.builder()
                .companyId(entity.getCompanyId())
                .companyCode(entity.getCompanyCode())
                .companyName(entity.getCompanyName())
                .displayName(entity.getDisplayName())
                .companyType(entity.getCompanyType())
                .representativeName(entity.getRepresentativeName())
                .adminEmail(entity.getAdminEmail())
                .adminPhone(entity.getAdminPhone())
                .build();
    }

    private CompanyNotificationDto toNotificationDto(CompanyNotification entity) {
        return CompanyNotificationDto.builder()
                .notificationSettingId(entity.getNotificationId())
                .notificationType(entity.getNotificationType())
                .isEnabled(!entity.getIsRead())
                .build();
    }

    private void updateEntityFromDto(Company entity, CompanyDto dto) {
        if (dto.getCompanyName() != null) entity.setCompanyName(dto.getCompanyName());
        if (dto.getDisplayName() != null) entity.setDisplayName(dto.getDisplayName());
        if (dto.getCompanyType() != null) entity.setCompanyType(dto.getCompanyType());
        if (dto.getRepresentativeName() != null) entity.setRepresentativeName(dto.getRepresentativeName());
        if (dto.getAdminEmail() != null) entity.setAdminEmail(dto.getAdminEmail());
        if (dto.getAdminPhone() != null) entity.setAdminPhone(dto.getAdminPhone());
    }
}
