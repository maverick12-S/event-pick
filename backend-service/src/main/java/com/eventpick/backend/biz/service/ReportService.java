package com.eventpick.backend.biz.service;

/**
 * レポートサービスインタフェース。
 */
public interface ReportService {
    Object getSummary();
    Object searchReports(String q, Integer limit, Integer page);
    Object getAccountReport(String accountId);
    Object getEventReport(String accountId, String eventId);
}
