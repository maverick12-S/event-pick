package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.CompanyDto;
import com.eventpick.backend.restapi.dto.CompanyNotificationDto;
import com.eventpick.backend.restapi.dto.CompanyReviewDto;
import com.eventpick.backend.restapi.dto.request.CompanyStatusPatchRequest;

import java.util.List;

/**
 * 企業サービスインタフェース。
 */
public interface CompanyService {
    CompanyDto getMyCompany();
    void updateMyCompany(CompanyDto request);
    List<CompanyNotificationDto> getMyNotifications();
    List<CompanyDto> getCompanies(Integer limit, Integer page);
    void createCompany(CompanyDto request);
    CompanyDto getCompany(String companyId);
    void updateCompany(String companyId, CompanyDto request);
    void deleteCompany(String companyId);
    void updateCompanyStatus(String companyId, CompanyStatusPatchRequest request);
    void submitCompanyReview(String companyId, CompanyReviewDto request);
    List<CompanyDto> getDraftCompanies();
}
