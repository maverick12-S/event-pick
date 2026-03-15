package com.eventpick.backend.restapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * S3署名付きURL取得レスポンス。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlPostResponse {
    private String uploadUrl;
    private String publicUrl;
}
