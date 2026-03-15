package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 企業通知設定DTO — Company_Notification エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyNotificationDto {

    /** 通知設定ID CHAR(26) ULID */
    @Size(max = 26)
    @JsonProperty("notification_setting_id")
    private String notificationSettingId;

    @Size(max = 26)
    @JsonProperty("company_account_id")
    private String companyAccountId;

    /** 実行機能コード VARCHAR(20) */
    @Size(max = 20)
    @JsonProperty("function_code")
    private String functionCode;

    @JsonProperty("is_enabled")
    private Boolean isEnabled;

    /** 通知種別 CHAR(1) 1:メール/2:Push/3:両方 */
    @JsonProperty("notification_type")
    private String notificationType;
}
