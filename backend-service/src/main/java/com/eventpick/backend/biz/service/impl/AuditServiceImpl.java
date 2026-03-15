package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.AuditService;
import com.eventpick.backend.domain.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public Object getAuditLogs(Integer limit, Integer page) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, limit)).getContent();
    }
}
