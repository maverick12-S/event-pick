package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** お問い合わせ送信リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class InquiryPostRequest {
    @NotNull private String type;
    @NotNull private String subject;
    @NotNull private String body;
}
