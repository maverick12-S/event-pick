package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.BillingService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.BillingAddressDto;
import com.eventpick.backend.restapi.dto.BillingDataDto;
import com.eventpick.backend.restapi.dto.request.BillingCheckoutSessionPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingCouponApplyPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingPlanChangePostRequest;
import com.eventpick.backend.restapi.dto.response.BillingCheckoutSessionPostResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "請求 (Billing)", description = "Stripe連携, プラン変更, クーポン")
public class BillingController {

    private final BillingService billingService;

    @Operation(summary = "請求情報取得", description = "現在の請求情報・プラン・支払履歴を取得する。")
    @GetMapping
    public CommonResponse<BillingDataDto> getBillingData() {
        return CommonResponse.ok(billingService.getBillingData());
    }

    @Operation(summary = "チェックアウトセッション作成", description = "Stripe Checkoutセッションを作成し、リダイレクトURLを返す。")
    @PostMapping("/checkout-session")
    public CommonResponse<BillingCheckoutSessionPostResponse> createCheckoutSession(
            @RequestBody @Valid BillingCheckoutSessionPostRequest request) {
        return CommonResponse.ok(billingService.createCheckoutSession(request));
    }

    @Operation(summary = "プラン変更", description = "現在のサブスクリプションプランを変更する。")
    @PostMapping("/plan/change")
    public CommonResponse<Void> changePlan(@RequestBody @Valid BillingPlanChangePostRequest request) {
        billingService.changePlan(request);
        return CommonResponse.ok();
    }

    @Operation(summary = "サブスクリプションキャンセル", description = "現在のサブスクリプションをキャンセルする。")
    @PostMapping("/cancel")
    public CommonResponse<Void> cancelSubscription() {
        billingService.cancelSubscription();
        return CommonResponse.ok();
    }

    @Operation(summary = "請求先住所取得")
    @GetMapping("/address")
    public CommonResponse<BillingAddressDto> getBillingAddress() {
        return CommonResponse.ok(billingService.getBillingAddress());
    }

    @Operation(summary = "請求先住所更新")
    @PutMapping("/address")
    public CommonResponse<Void> updateBillingAddress(@RequestBody @Valid BillingAddressDto request) {
        billingService.updateBillingAddress(request);
        return CommonResponse.ok();
    }

    @Operation(summary = "クーポン適用", description = "クーポンコードを検証し適用する。")
    @PostMapping("/coupon/apply")
    public CommonResponse<Void> applyCoupon(@RequestBody @Valid BillingCouponApplyPostRequest request) {
        billingService.applyCoupon(request);
        return CommonResponse.ok();
    }
}
