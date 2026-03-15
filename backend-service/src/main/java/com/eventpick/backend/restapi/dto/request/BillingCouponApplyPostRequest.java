package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** クーポン適用リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class BillingCouponApplyPostRequest {
    @NotNull private String couponCode;
}
