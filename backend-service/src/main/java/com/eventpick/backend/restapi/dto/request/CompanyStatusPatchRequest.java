package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 企業ステータス変更リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class CompanyStatusPatchRequest {
    @NotNull private String status;
}
