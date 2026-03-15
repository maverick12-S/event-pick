package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 拠点アカウントDTO — Company_Account エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAccountDto {

    @JsonProperty("company_account_id")
    private String companyAccountId;

    @JsonProperty("company_id")
    private String companyId;

    /** 企業ロールID CHAR(2) 01:親企業/02:子拠点/03:運営 */
    @JsonProperty("company_role_id")
    private String companyRoleId;

    @Size(max = 10)
    @JsonProperty("branch_code")
    private String branchCode;

    @Size(max = 40)
    @JsonProperty("branch_name")
    private String branchName;

    @Size(max = 40)
    @JsonProperty("branch_display_name")
    private String branchDisplayName;

    @Size(max = 7)
    @JsonProperty("postal_code")
    private String postalCode;

    @Size(max = 2)
    @JsonProperty("prefecture_code")
    private String prefectureCode;

    @Size(max = 30)
    @JsonProperty("city")
    private String city;

    @Size(max = 60)
    @JsonProperty("address_line")
    private String addressLine;

    @Size(max = 15)
    @JsonProperty("phone_number")
    private String phoneNumber;

    @Size(max = 80)
    @JsonProperty("contact_email")
    private String contactEmail;

    /** ステータス CHAR(1) 1:有効/2:停止 */
    @JsonProperty("status")
    private String status;
}
