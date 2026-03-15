package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 一般消費者DTO — User_Account エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountDto {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("auth_sub")
    private String authSub;

    /** ログイン種別 CHAR(1) 1:email/2:phone/3:google/4:line */
    @JsonProperty("login_type")
    private String loginType;

    @Size(max = 15)
    @JsonProperty("user_name")
    private String userName;

    @Email
    @Size(max = 254)
    @JsonProperty("user_email")
    private String userEmail;

    @Size(max = 15)
    @JsonProperty("phone_number")
    private String phoneNumber;

    /** 性別 CHAR(1) 1:男性/2:女性/3:その他 */
    @JsonProperty("user_gender")
    private String userGender;

    @JsonProperty("birth_year")
    private String birthYear;

    @JsonProperty("terms_agreed")
    private Boolean termsAgreed;

    @JsonProperty("is_active")
    private Boolean isActive;
}
