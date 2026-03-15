package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.CompanyService;
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
                .isDeleted(false)
                .build();
        companyRepository.save(company);
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
        log.info("Company soft deleted: {}", companyId);
    }

    @Override
    public void updateCompanyStatus(String companyId, CompanyStatusPatchRequest request) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        company.setAccountStatus(request.getStatus());
        companyRepository.save(company);
    }

    @Override
    public void submitCompanyReview(String companyId, CompanyReviewDto request) {
        companyRepository.findByCompanyIdAndIsDeletedFalse(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", companyId));
        CompanyReview review = CompanyReview.builder()
                .reviewId(IdGenerator.generateUlid())
                .companyId(companyId)
                .reviewType(request.getReviewType())
                .reviewStatus("1") // 申請中
                .submittedAt(LocalDateTime.now())
                .build();
        reviewRepository.save(review);
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
