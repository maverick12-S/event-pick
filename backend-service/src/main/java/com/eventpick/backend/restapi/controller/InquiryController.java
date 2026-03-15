package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.InquiryService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.request.InquiryPostRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public CommonResponse<Object> getInquiries() {
        return CommonResponse.ok(inquiryService.getInquiries());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createInquiry(@RequestBody @Valid InquiryPostRequest request) {
        inquiryService.createInquiry(request);
        return CommonResponse.ok();
    }
}
