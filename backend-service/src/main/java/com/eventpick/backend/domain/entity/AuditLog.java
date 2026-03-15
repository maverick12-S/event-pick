package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 監査ログエンティティ。
 * テーブル: audit_logs
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_logs_actor", columnList = "actor_id"),
    @Index(name = "idx_audit_logs_created", columnList = "created_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog extends BaseEntity {

    @Id
    @Column(name = "log_id", length = 26)
    private String logId;

    @Column(name = "actor_id", length = 26)
    private String actorId;

    @Column(name = "actor_type", length = 20)
    private String actorType;

    @Column(name = "action", length = 50, nullable = false)
    private String action;

    /** 対象種別 CHAR(1) */
    @Column(name = "target_type", length = 1)
    private String targetType;

    @Column(name = "target_id", length = 26)
    private String targetId;

    @Column(name = "details", length = 2000)
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;
}
