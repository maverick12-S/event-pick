package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.UploadService;
import com.eventpick.backend.restapi.dto.request.PresignedUrlPostRequest;
import com.eventpick.backend.restapi.dto.response.PresignedUrlPostResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    @Override
    public PresignedUrlPostResponse createPresignedUrl(PresignedUrlPostRequest request) {
        log.info("Presigned URL requested: fileName={}, contentType={}", request.getFileName(), request.getContentType());
        // TODO: AWS S3 presigned URL生成
        String key = "uploads/" + System.currentTimeMillis() + "/" + request.getFileName();
        return PresignedUrlPostResponse.builder()
                .uploadUrl("https://s3.ap-northeast-1.amazonaws.com/eventpick-uploads/" + key + "?presigned-stub")
                .publicUrl("https://cdn.eventpick.io/" + key)
                .build();
    }
}
