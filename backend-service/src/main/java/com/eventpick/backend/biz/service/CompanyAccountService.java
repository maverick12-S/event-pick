package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.CompanyAccountDto;

import java.util.List;

/**
 * 拠点アカウントサービスインタフェース。
 */
public interface CompanyAccountService {
    List<CompanyAccountDto> getCompanyAccounts(Integer limit, Integer page);
    CompanyAccountDto getCompanyAccount(String accountId);
    void updateCompanyAccount(String accountId, CompanyAccountDto request);
}
