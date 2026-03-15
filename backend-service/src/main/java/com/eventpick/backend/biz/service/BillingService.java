package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.BillingAddressDto;
import com.eventpick.backend.restapi.dto.BillingDataDto;
import com.eventpick.backend.restapi.dto.request.BillingCheckoutSessionPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingCouponApplyPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingPlanChangePostRequest;
import com.eventpick.backend.restapi.dto.response.BillingCheckoutSessionPostResponse;

/**
 * 請求サービスインタフェース。
 */
public interface BillingService {
    BillingDataDto getBillingData();
    BillingCheckoutSessionPostResponse createCheckoutSession(BillingCheckoutSessionPostRequest request);
    void changePlan(BillingPlanChangePostRequest request);
    void cancelSubscription();
    BillingAddressDto getBillingAddress();
    void updateBillingAddress(BillingAddressDto request);
    void applyCoupon(BillingCouponApplyPostRequest request);
}
