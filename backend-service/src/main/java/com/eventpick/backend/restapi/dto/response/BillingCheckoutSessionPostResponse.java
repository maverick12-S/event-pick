package com.eventpick.backend.restapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Stripeチェックアウトセッション作成レスポンス。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingCheckoutSessionPostResponse {
    private String sessionUrl;
}
