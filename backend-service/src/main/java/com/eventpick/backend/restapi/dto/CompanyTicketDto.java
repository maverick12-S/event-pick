package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * チケット残量DTO — Company_Ticket エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyTicketDto {

    @JsonProperty("ticket_id")
    private String ticketId;

    @JsonProperty("company_id")
    private String companyId;

    @JsonProperty("daily_granted")
    private Integer dailyGranted;

    @JsonProperty("daily_used")
    private Integer dailyUsed;

    @JsonProperty("daily_remaining")
    private Integer dailyRemaining;

    /** 日次リセット日 DATE(10) */
    @JsonProperty("daily_reset_at")
    private LocalDate dailyResetAt;

    @JsonProperty("monthly_granted")
    private Integer monthlyGranted;

    @JsonProperty("monthly_used")
    private Integer monthlyUsed;

    @JsonProperty("monthly_remaining")
    private Integer monthlyRemaining;

    /** 対象年月 YYYYMM */
    @JsonProperty("monthly_target")
    private String monthlyTarget;
}
