package com.eventpick.backend.biz.service;

/**
 * 監査ログサービスインタフェース。
 */
public interface AuditService {
    Object getAuditLogs(Integer limit, Integer page);
}
