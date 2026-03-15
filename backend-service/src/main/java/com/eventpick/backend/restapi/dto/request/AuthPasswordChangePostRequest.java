package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** パスワード変更リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AuthPasswordChangePostRequest {
    @NotNull private String currentPassword;
    @NotNull private String newPassword;
}
