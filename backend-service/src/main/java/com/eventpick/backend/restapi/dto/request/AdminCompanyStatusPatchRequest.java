package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** [管理] 企業ステータス変更リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminCompanyStatusPatchRequest {
    @NotNull private String status;
}
