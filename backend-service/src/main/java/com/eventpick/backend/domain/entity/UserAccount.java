package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 一般ユーザーアカウントエンティティ。
 * テーブル: user_accounts
 */
@Entity
@Table(name = "user_accounts", indexes = {
    @Index(name = "idx_user_accounts_email", columnList = "user_email"),
    @Index(name = "idx_user_accounts_auth_sub", columnList = "auth_sub", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAccount extends BaseEntity {

    @Id
    @Column(name = "user_id", length = 26)
    private String userId;

    @Column(name = "auth_sub", length = 128, unique = true)
    private String authSub;

    /** ログイン種別 CHAR(1) */
    @Column(name = "login_type", length = 1)
    private String loginType;

    @Column(name = "user_name", length = 15)
    private String userName;

    @Column(name = "user_email", length = 254)
    private String userEmail;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    /** 性別 CHAR(1) */
    @Column(name = "user_gender", length = 1)
    private String userGender;

    @Column(name = "birth_year", length = 4)
    private String birthYear;

    @Column(name = "terms_agreed", nullable = false)
    @Builder.Default
    private Boolean termsAgreed = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
