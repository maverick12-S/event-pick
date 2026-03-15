package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.CompanyAccountService;
import com.eventpick.backend.domain.entity.CompanyAccount;
import com.eventpick.backend.domain.repository.CompanyAccountRepository;
import com.eventpick.backend.restapi.dto.CompanyAccountDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CompanyAccountServiceImpl implements CompanyAccountService {

    private final CompanyAccountRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<CompanyAccountDto> getCompanyAccounts(Integer limit, Integer page) {
        return repository.findByIsDeletedFalse(PageRequest.of(page - 1, limit))
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyAccountDto getCompanyAccount(String accountId) {
        CompanyAccount account = repository.findByAccountIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyAccount", "accountId", accountId));
        return toDto(account);
    }

    @Override
    public void updateCompanyAccount(String accountId, CompanyAccountDto request) {
        CompanyAccount account = repository.findByAccountIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanyAccount", "accountId", accountId));
        if (request.getBranchName() != null) account.setAccountName(request.getBranchName());
        if (request.getContactEmail() != null) account.setAccountEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) account.setAccountPhone(request.getPhoneNumber());
        repository.save(account);
    }

    private CompanyAccountDto toDto(CompanyAccount e) {
        return CompanyAccountDto.builder()
                .companyAccountId(e.getAccountId())
                .companyId(e.getCompanyId())
                .companyRoleId(e.getRoleCode())
                .branchName(e.getAccountName())
                .contactEmail(e.getAccountEmail())
                .phoneNumber(e.getAccountPhone())
                .status(e.getAccountStatus())
                .build();
    }
}
