package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 拠点アカウントエンティティ。
 * テーブル: company_accounts
 */
@Entity
@Table(name = "company_accounts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAccount extends BaseEntity {

    @Id
    @Column(name = "account_id", length = 26)
    private String accountId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "account_name", length = 80)
    private String accountName;

    @Column(name = "account_email", length = 128)
    private String accountEmail;

    @Column(name = "account_phone", length = 15)
    private String accountPhone;

    /** ロール CHAR(2) */
    @Column(name = "role_code", length = 2)
    private String roleCode;

    /** アカウントステータス CHAR(1) */
    @Column(name = "account_status", length = 1, nullable = false)
    private String accountStatus;

    @Column(name = "cognito_sub", length = 128)
    private String cognitoSub;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
