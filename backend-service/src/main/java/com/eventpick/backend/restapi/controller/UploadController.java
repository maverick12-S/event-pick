package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.UploadService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.PresignedUrlPostRequest;
import com.eventpick.backend.restapi.dto.response.PresignedUrlPostResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * アップロードコントローラー。
 */
@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@Tag(name = "アップロード (Upload)", description = "S3 Presigned URL発行")
public class UploadController {

    private final UploadService uploadService;

    @Operation(summary = "Presigned URL発行", description = "S3ファイルアップロード用のPresigned URLを発行する。")
    @PostMapping("/presigned-url")
    public CommonResponse<PresignedUrlPostResponse> createPresignedUrl(
            @RequestBody @Valid PresignedUrlPostRequest request) {
        return CommonResponse.ok(uploadService.createPresignedUrl(request));
    }
}
