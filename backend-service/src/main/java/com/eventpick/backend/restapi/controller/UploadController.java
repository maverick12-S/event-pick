package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.UploadService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.PresignedUrlPostRequest;
import com.eventpick.backend.restapi.dto.response.PresignedUrlPostResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * アップロードコントローラー。
 */
@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping("/presigned-url")
    public CommonResponse<PresignedUrlPostResponse> createPresignedUrl(
            @RequestBody @Valid PresignedUrlPostRequest request) {
        return CommonResponse.ok(uploadService.createPresignedUrl(request));
    }
}
