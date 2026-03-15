package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_credentials", indexes = {
    @Index(name = "idx_auth_credentials_sub", columnList = "auth_sub")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthCredential extends BaseEntity {

    @Id
    @Column(name = "auth_id", length = 26)
    private String authId;

    @Column(name = "user_id", length = 26)
    private String userId;

    @Column(name = "company_id", length = 26)
    private String companyId;

    @Column(name = "auth_sub", length = 128, nullable = false)
    private String authSub;

    @Column(name = "auth_provider", length = 20, nullable = false)
    @Builder.Default
    private String authProvider = "cognito";

    @Column(name = "is_enabled", nullable = false)
    @Builder.Default
    private Boolean isEnabled = false;

    @Column(name = "mfa_enabled", nullable = false)
    @Builder.Default
    private Boolean mfaEnabled = false;
}
