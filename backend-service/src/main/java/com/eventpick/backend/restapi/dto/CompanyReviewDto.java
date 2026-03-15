package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 法人審査DTO — Company_Review エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyReviewDto {

    @JsonProperty("review_id")
    private String reviewId;

    @JsonProperty("company_id")
    private String companyId;

    /** 申請種別 CHAR(1) 1:新規/2:更新/3:再申請 */
    @JsonProperty("review_type")
    private String reviewType;

    /** 審査ステータス CHAR(1) 1:申請中/2:承認/3:差戻し/4:却下 */
    @JsonProperty("review_status")
    private String reviewStatus;

    @JsonProperty("applied_at")
    private LocalDateTime appliedAt;

    @JsonProperty("reviewed_at")
    private LocalDateTime reviewedAt;

    @JsonProperty("reviewer_id")
    private String reviewerId;

    @Size(max = 200)
    @JsonProperty("review_comment")
    private String reviewComment;

    @JsonProperty("is_active")
    private Boolean isActive;
}
