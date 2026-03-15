package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 企業DTO — Company エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {

    /** 企業ID ULID CHAR(26) */
    @JsonProperty("company_id")
    private String companyId;

    /** 法人コード */
    @Size(max = 16)
    @JsonProperty("company_code")
    private String companyCode;

    /** 企業名（正式） */
    @Size(max = 80)
    @JsonProperty("company_name")
    private String companyName;

    /** 企業名（表示用） */
    @Size(max = 40)
    @JsonProperty("display_name")
    private String displayName;

    /** 企業種別 CHAR(1) 1:法人/2:個人事業 */
    @JsonProperty("company_type")
    private String companyType;

    /** 代表者名 */
    @Size(max = 40)
    @JsonProperty("representative_name")
    private String representativeName;

    /** 管理用メール */
    @Email
    @Size(max = 128)
    @JsonProperty("admin_email")
    private String adminEmail;

    /** 管理用電話番号 */
    @Size(max = 15)
    @JsonProperty("admin_phone")
    private String adminPhone;
}
