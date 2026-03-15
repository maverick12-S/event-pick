package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.BillingService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.BillingAddressDto;
import com.eventpick.backend.restapi.dto.BillingDataDto;
import com.eventpick.backend.restapi.dto.request.BillingCheckoutSessionPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingCouponApplyPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingPlanChangePostRequest;
import com.eventpick.backend.restapi.dto.response.BillingCheckoutSessionPostResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 請求コントローラー。
 * 7エンドポイント: billing, checkout-session, plan/change, cancel, address(GET/PUT), coupon/apply
 */
@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping
    public CommonResponse<BillingDataDto> getBillingData() {
        return CommonResponse.ok(billingService.getBillingData());
    }

    @PostMapping("/checkout-session")
    public CommonResponse<BillingCheckoutSessionPostResponse> createCheckoutSession(
            @RequestBody @Valid BillingCheckoutSessionPostRequest request) {
        return CommonResponse.ok(billingService.createCheckoutSession(request));
    }

    @PostMapping("/plan/change")
    public CommonResponse<Void> changePlan(@RequestBody @Valid BillingPlanChangePostRequest request) {
        billingService.changePlan(request);
        return CommonResponse.ok();
    }

    @PostMapping("/cancel")
    public CommonResponse<Void> cancelSubscription() {
        billingService.cancelSubscription();
        return CommonResponse.ok();
    }

    @GetMapping("/address")
    public CommonResponse<BillingAddressDto> getBillingAddress() {
        return CommonResponse.ok(billingService.getBillingAddress());
    }

    @PutMapping("/address")
    public CommonResponse<Void> updateBillingAddress(@RequestBody @Valid BillingAddressDto request) {
        billingService.updateBillingAddress(request);
        return CommonResponse.ok();
    }

    @PostMapping("/coupon/apply")
    public CommonResponse<Void> applyCoupon(@RequestBody @Valid BillingCouponApplyPostRequest request) {
        billingService.applyCoupon(request);
        return CommonResponse.ok();
    }
}
