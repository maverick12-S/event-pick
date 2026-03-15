package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.BillingService;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.BillingAddress;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.Subscription;
import com.eventpick.backend.domain.repository.BillingAddressRepository;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.SubscriptionRepository;
import com.eventpick.backend.restapi.dto.BillingAddressDto;
import com.eventpick.backend.restapi.dto.BillingDataDto;
import com.eventpick.backend.restapi.dto.request.BillingCheckoutSessionPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingCouponApplyPostRequest;
import com.eventpick.backend.restapi.dto.request.BillingPlanChangePostRequest;
import com.eventpick.backend.restapi.dto.response.BillingCheckoutSessionPostResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BillingServiceImpl implements BillingService {

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BillingAddressRepository billingAddressRepository;

    @Override
    @Transactional(readOnly = true)
    public BillingDataDto getBillingData() {
        Company company = getCurrentCompany();
        Subscription subscription = subscriptionRepository.findByCompanyId(company.getCompanyId()).orElse(null);
        return BillingDataDto.builder()
                .company(BillingDataDto.BillingCompanyInfo.builder()
                        .companyName(company.getCompanyName())
                        .build())
                .subscription(subscription != null ? BillingDataDto.BillingSubscriptionInfo.builder()
                        .id(subscription.getSubscriptionId())
                        .status(subscription.getStatus())
                        .build() : null)
                .paymentMethods(Collections.emptyList())
                .invoices(Collections.emptyList())
                .build();
    }

    @Override
    public BillingCheckoutSessionPostResponse createCheckoutSession(BillingCheckoutSessionPostRequest request) {
        Company company = getCurrentCompany();
        log.info("Creating checkout session for company: {}, priceId: {}", company.getCompanyId(), request.getPriceId());
        // TODO: Stripe Checkout Session作成 (NAT Gateway経由)
        return BillingCheckoutSessionPostResponse.builder()
                .sessionUrl("https://checkout.stripe.com/stub-session-url")
                .build();
    }

    @Override
    public void changePlan(BillingPlanChangePostRequest request) {
        Company company = getCurrentCompany();
        log.info("Plan change requested: company={}, newPlan={}", company.getCompanyId(), request.getPlanId());
        // TODO: Stripe Subscription更新
    }

    @Override
    public void cancelSubscription() {
        Company company = getCurrentCompany();
        Subscription subscription = subscriptionRepository.findByCompanyId(company.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "companyId", company.getCompanyId()));
        subscription.setStatus("canceled");
        subscriptionRepository.save(subscription);
        log.info("Subscription canceled for company: {}", company.getCompanyId());
    }

    @Override
    @Transactional(readOnly = true)
    public BillingAddressDto getBillingAddress() {
        Company company = getCurrentCompany();
        BillingAddress addr = billingAddressRepository.findByCompanyId(company.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("BillingAddress", "companyId", company.getCompanyId()));
        return BillingAddressDto.builder()
                .postalCode(addr.getPostalCode())
                .prefecture(addr.getPrefecture())
                .city(addr.getCity())
                .address1(addr.getAddressLine1())
                .address2(addr.getAddressLine2())
                .build();
    }

    @Override
    public void updateBillingAddress(BillingAddressDto request) {
        Company company = getCurrentCompany();
        BillingAddress addr = billingAddressRepository.findByCompanyId(company.getCompanyId())
                .orElseGet(() -> BillingAddress.builder()
                        .billingAddressId(IdGenerator.generateUlid())
                        .companyId(company.getCompanyId()).build());
        addr.setPostalCode(request.getPostalCode());
        addr.setPrefecture(request.getPrefecture());
        addr.setCity(request.getCity());
        addr.setAddressLine1(request.getAddress1());
        addr.setAddressLine2(request.getAddress2());
        billingAddressRepository.save(addr);
    }

    @Override
    public void applyCoupon(BillingCouponApplyPostRequest request) {
        log.info("Coupon apply requested: {}", request.getCouponCode());
        // TODO: Stripe coupon適用
    }

    private Company getCurrentCompany() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        return companyRepository.findByCognitoSubAndIsDeletedFalse(sub)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "cognitoSub", sub));
    }
}
