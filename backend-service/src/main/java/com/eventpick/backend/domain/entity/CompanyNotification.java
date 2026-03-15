package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 企業通知エンティティ。
 * テーブル: company_notifications
 */
@Entity
@Table(name = "company_notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyNotification extends BaseEntity {

    @Id
    @Column(name = "notification_id", length = 26)
    private String notificationId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "message", length = 500)
    private String message;

    /** 通知種別 CHAR(1) */
    @Column(name = "notification_type", length = 1)
    private String notificationType;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;
}
