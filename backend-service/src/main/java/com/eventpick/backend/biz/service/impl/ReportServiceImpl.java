package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.ReportService;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.EventPostRepository;
import com.eventpick.backend.domain.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final CompanyRepository companyRepository;
    private final EventPostRepository eventPostRepository;
    private final UserAccountRepository userAccountRepository;

    @Override
    public Object getSummary() {
        long totalCompanies = companyRepository.count();
        long totalEvents = eventPostRepository.count();
        long totalUsers = userAccountRepository.count();
        return Map.of(
                "totalCompanies", totalCompanies,
                "totalEvents", totalEvents,
                "totalUsers", totalUsers
        );
    }

    @Override
    public Object searchReports(String q, Integer limit, Integer page) {
        // TODO: レポート検索実装
        return Collections.emptyList();
    }

    @Override
    public Object getAccountReport(String accountId) {
        // TODO: アカウントレポート実装
        return Map.of("accountId", accountId, "status", "stub");
    }

    @Override
    public Object getEventReport(String accountId, String eventId) {
        // TODO: イベントレポート実装
        return Map.of("accountId", accountId, "eventId", eventId, "status", "stub");
    }
}
