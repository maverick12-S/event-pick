package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 企業エンティティ。
 * テーブル: companies
 */
@Entity
@Table(name = "companies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company extends BaseEntity {

    @Id
    @Column(name = "company_id", length = 26)
    private String companyId;

    @Column(name = "company_code", length = 16)
    private String companyCode;

    @Column(name = "company_name", length = 80, nullable = false)
    private String companyName;

    @Column(name = "display_name", length = 40)
    private String displayName;

    /** 企業種別 CHAR(1) 1:法人 / 2:個人事業 */
    @Column(name = "company_type", length = 1)
    private String companyType;

    @Column(name = "representative_name", length = 40)
    private String representativeName;

    @Column(name = "admin_email", length = 128)
    private String adminEmail;

    @Column(name = "admin_phone", length = 15)
    private String adminPhone;

    /** ロール CHAR(2) 01:親企業 / 02:子拠点 / 03:運営 */
    @Column(name = "role_code", length = 2)
    private String roleCode;

    /** アカウントステータス CHAR(1) 1:有効 / 2:停止 */
    @Column(name = "account_status", length = 1, nullable = false)
    private String accountStatus;

    /** 審査ステータス CHAR(1) */
    @Column(name = "review_status", length = 1)
    private String reviewStatus;

    /** 親企業ID (拠点の場合) */
    @Column(name = "parent_company_id", length = 26)
    private String parentCompanyId;

    @Column(name = "stripe_customer_id", length = 64)
    private String stripeCustomerId;

    @Column(name = "cognito_sub", length = 128)
    private String cognitoSub;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
