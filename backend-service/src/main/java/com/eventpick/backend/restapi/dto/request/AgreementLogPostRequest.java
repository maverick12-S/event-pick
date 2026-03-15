package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 同意ログ記録リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AgreementLogPostRequest {
    /** enum: PRIVACY_POLICY, TERMS_OF_SERVICE, LICENSE_AGREEMENT */
    @NotNull private String agreementType;
}
