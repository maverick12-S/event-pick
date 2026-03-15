package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** パスワードリセット要求リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AuthPasswordResetPostRequest {
    @NotNull @Email private String email;
}
