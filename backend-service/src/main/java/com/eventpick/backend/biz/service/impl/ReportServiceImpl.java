package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.ReportService;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.EventPost;
import com.eventpick.backend.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final CompanyRepository companyRepository;
    private final EventPostRepository eventPostRepository;
    private final UserAccountRepository userAccountRepository;
    private final EventPreviewRepository eventPreviewRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Override
    @Cacheable(value = "reports", key = "'summary'")
    public Object getSummary() {
        long totalCompanies = companyRepository.count();
        long totalEvents = eventPostRepository.count();
        long totalUsers = userAccountRepository.count();
        long activeSubscriptions = subscriptionRepository.findByStatusAndAutoRenewTrue("active").size();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalCompanies", totalCompanies);
        summary.put("totalEvents", totalEvents);
        summary.put("totalUsers", totalUsers);
        summary.put("activeSubscriptions", activeSubscriptions);
        return summary;
    }

    @Override
    public Object searchReports(String q, Integer limit, Integer page) {
        // 企業ごとのイベント数レポート
        String sub = SecurityUtils.getCurrentUserSub().orElse(null);
        if (sub == null) {
            return Collections.emptyList();
        }
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElse(null);
        if (company == null) {
            return Collections.emptyList();
        }
        List<EventPost> events = eventPostRepository.findByCompanyAccountIdAndIsDeletedFalse(company.getCompanyId());
        return events.stream().map(event -> {
            long views = eventPreviewRepository.countViewsByPostId(event.getPostId());
            long likes = eventPreviewRepository.countLikesByPostId(event.getPostId());
            long favorites = eventPreviewRepository.countFavoritesByPostId(event.getPostId());

            Map<String, Object> report = new LinkedHashMap<>();
            report.put("eventId", event.getPostId());
            report.put("title", event.getTitle());
            report.put("status", event.getStatus());
            report.put("eventDate", event.getEventDate());
            report.put("viewCount", views);
            report.put("likeCount", likes);
            report.put("favoriteCount", favorites);
            return report;
        }).toList();
    }

    @Override
    @Cacheable(value = "reports", key = "'account-' + #accountId")
    public Object getAccountReport(String accountId) {
        Company company = companyRepository.findByCompanyIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", accountId));

        List<EventPost> events = eventPostRepository.findByCompanyAccountIdAndIsDeletedFalse(accountId);
        long totalViews = events.stream()
                .mapToLong(e -> eventPreviewRepository.countViewsByPostId(e.getPostId()))
                .sum();
        long totalLikes = events.stream()
                .mapToLong(e -> eventPreviewRepository.countLikesByPostId(e.getPostId()))
                .sum();
        long publishedCount = events.stream()
                .filter(e -> "2".equals(e.getStatus()))
                .count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("companyId", accountId);
        report.put("companyName", company.getCompanyName());
        report.put("totalEvents", events.size());
        report.put("publishedEvents", publishedCount);
        report.put("totalViews", totalViews);
        report.put("totalLikes", totalLikes);
        return report;
    }

    @Override
    @Cacheable(value = "reports", key = "'event-' + #accountId + '-' + #eventId")
    public Object getEventReport(String accountId, String eventId) {
        EventPost event = eventPostRepository.findByPostIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("EventPost", "postId", eventId));

        long views = eventPreviewRepository.countViewsByPostId(eventId);
        long likes = eventPreviewRepository.countLikesByPostId(eventId);
        long favorites = eventPreviewRepository.countFavoritesByPostId(eventId);

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("eventId", eventId);
        report.put("companyId", accountId);
        report.put("title", event.getTitle());
        report.put("status", event.getStatus());
        report.put("eventDate", event.getEventDate());
        report.put("publishedAt", event.getPublishedAt());
        report.put("viewCount", views);
        report.put("likeCount", likes);
        report.put("favoriteCount", favorites);
        report.put("storedViewCount", event.getViewCount());
        report.put("storedFavoriteCount", event.getFavoriteCount());
        return report;
    }
}
