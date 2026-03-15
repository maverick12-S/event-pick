package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** [管理] カテゴリ作成リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class AdminCategoryPostRequest {
    @NotNull private String categoryCode;
    @NotNull private String categoryName;
}
