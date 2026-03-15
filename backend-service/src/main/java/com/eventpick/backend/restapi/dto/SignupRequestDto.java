package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 新規登録リクエストDTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDto {

    /** 法人コード VARCHAR(16) */
    @NotNull
    @Size(max = 16)
    @JsonProperty("company_code")
    private String companyCode;

    /** 企業名 VARCHAR(80) */
    @NotNull
    @Size(max = 80)
    @JsonProperty("company_name")
    private String companyName;

    /** 代表者名 VARCHAR(40) */
    @NotNull
    @Size(max = 40)
    @JsonProperty("representative_name")
    private String representativeName;

    /** 企業種別 CHAR(1) 1:法人/2:個人事業 */
    @NotNull
    @JsonProperty("company_type")
    private String companyType;

    /** 管理用メール VARCHAR(128) */
    @NotNull
    @Email
    @Size(max = 128)
    @JsonProperty("admin_email")
    private String adminEmail;

    /** 管理用電話番号 VARCHAR(15) */
    @Size(max = 15)
    @JsonProperty("admin_phone")
    private String adminPhone;

    /** ログイン種別 CHAR(1) 1:email/2:phone/3:google/4:line */
    @NotNull
    @JsonProperty("login_type")
    private String loginType;
}
