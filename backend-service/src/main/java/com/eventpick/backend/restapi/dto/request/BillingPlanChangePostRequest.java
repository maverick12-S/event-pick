package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** プラン変更リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class BillingPlanChangePostRequest {
    @NotNull private String planId;
}
