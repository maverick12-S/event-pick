package com.eventpick.backend.biz.util;

import com.eventpick.backend.domain.entity.AuditLog;
import com.eventpick.backend.domain.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * 監査ログ記録ヘルパー。
 * サービス層から非同期で監査ログを書き込む。
 */
@Component
@RequiredArgsConstructor
public class AuditLogHelper {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String actorId, String actorType, String action,
                    String targetType, String targetId, String details) {
        AuditLog entry = AuditLog.builder()
                .logId(IdGenerator.generateUlid())
                .actorId(actorId)
                .actorType(actorType)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }
}
