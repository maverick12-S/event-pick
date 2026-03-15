package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 同意ログエンティティ。
 * テーブル: agreement_logs
 */
@Entity
@Table(name = "agreement_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgreementLog extends BaseEntity {

    @Id
    @Column(name = "agreement_id", length = 26)
    private String agreementId;

    @Column(name = "user_id", length = 26)
    private String userId;

    @Column(name = "company_id", length = 26)
    private String companyId;

    @Column(name = "agreement_type", length = 30, nullable = false)
    private String agreementType;

    @Column(name = "agreed_version", length = 20)
    private String agreedVersion;

    @Column(name = "agreed_at", nullable = false)
    private LocalDateTime agreedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;
}
