package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Stripeチェックアウトセッション作成リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class BillingCheckoutSessionPostRequest {
    @NotNull private String priceId;
}
