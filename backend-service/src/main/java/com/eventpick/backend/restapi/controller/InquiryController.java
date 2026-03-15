package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.InquiryService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.InquiryPostRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inquiries")
@RequiredArgsConstructor
@Tag(name = "お問い合わせ (Inquiry)", description = "お問い合わせ送信")
public class InquiryController {

    private final InquiryService inquiryService;

    @Operation(summary = "お問い合わせ一覧")
    @GetMapping
    public CommonResponse<Object> getInquiries() {
        return CommonResponse.ok(inquiryService.getInquiries());
    }

    @Operation(summary = "お問い合わせ作成", description = "新規お問い合わせを送信する。SESで通知メール送信。")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createInquiry(@RequestBody @Valid InquiryPostRequest request) {
        inquiryService.createInquiry(request);
        return CommonResponse.ok();
    }
}
