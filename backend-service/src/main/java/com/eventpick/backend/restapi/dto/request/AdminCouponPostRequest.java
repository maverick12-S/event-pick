package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** [管理] クーポン作成リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminCouponPostRequest {
    @NotNull private String code;
    /** 割引種別 1:金額/2:率 */
    @NotNull private String discountType;
    @NotNull private BigDecimal discountValue;
}
