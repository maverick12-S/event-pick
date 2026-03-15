package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.request.PresignedUrlPostRequest;
import com.eventpick.backend.restapi.dto.response.PresignedUrlPostResponse;

/**
 * アップロードサービスインタフェース。
 */
public interface UploadService {
    PresignedUrlPostResponse createPresignedUrl(PresignedUrlPostRequest request);
}
