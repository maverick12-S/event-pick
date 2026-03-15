package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions", indexes = {
    @Index(name = "idx_sessions_auth_sub", columnList = "auth_sub")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session extends BaseEntity {

    @Id
    @Column(name = "session_id", length = 26)
    private String sessionId;

    @Column(name = "user_type", length = 10, nullable = false)
    private String userType;

    @Column(name = "consumer_id", length = 26)
    private String consumerId;

    @Column(name = "company_id", length = 26)
    private String companyId;

    @Column(name = "auth_sub", length = 128, nullable = false)
    private String authSub;

    @Column(name = "device_type", length = 20)
    private String deviceType;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "login_at", nullable = false)
    private LocalDateTime loginAt;

    @Column(name = "logout_at")
    private LocalDateTime logoutAt;
}
