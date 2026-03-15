package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** MFA検証リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AuthMfaVerifyPostRequest {
    @NotNull private String code;
}
