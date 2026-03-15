package com.eventpick.backend.restapi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** [管理] レビュー却下リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminReviewRejectPostRequest {
    private String reason;
}
