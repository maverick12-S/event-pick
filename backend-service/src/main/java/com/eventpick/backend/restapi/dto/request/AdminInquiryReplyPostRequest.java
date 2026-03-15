package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** [管理] お問い合わせ返信リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminInquiryReplyPostRequest {
    @NotNull private String body;
}
