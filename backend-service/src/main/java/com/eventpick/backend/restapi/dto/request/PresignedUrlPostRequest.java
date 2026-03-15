package com.eventpick.backend.restapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** S3署名付きURL取得リクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class PresignedUrlPostRequest {
    @NotNull private String fileName;
    @NotNull private String contentType;
}
