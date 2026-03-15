package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BadRequestException;
import com.eventpick.backend.biz.exception.MessageEnum;
import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.BillingService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.*;
import com.eventpick.backend.domain.repository.*;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BillingServiceImpl implements BillingService {

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BillingAddressRepository billingAddressRepository;
    private final CompanyBillingRepository companyBillingRepository;
    private final PlanRepository planRepository;
    private final AuditLogHelper auditLogHelper;

    @Override
    @Transactional(readOnly = true)
    public BillingDataDto getBillingData() {
        Company company = getCurrentCompany();
        Subscription subscription = subscriptionRepository.findByCompanyId(company.getCompanyId()).orElse(null);

        // プラン名の取得
        String planName = null;
        if (subscription != null) {
            planName = planRepository.findById(subscription.getPlanId())
                    .map(Plan::getPlanName).orElse(null);
        }

        // 請求履歴の取得
        List<BillingDataDto.InvoiceInfo> invoices = companyBillingRepository
                .findByCompanyIdOrderByCreatedAtDesc(company.getCompanyId())
                .stream().map(b -> BillingDataDto.InvoiceInfo.builder()
                        .id(b.getBillingId())
                        .date(b.getCreatedAt() != null ? b.getCreatedAt().toString() : null)
                        .amount(b.getAmount() != null ? b.getAmount().intValue() : 0)
                        .status(b.getStatus())
                        .build())
                .toList();

        // 請求先住所
        BillingAddressDto billingAddress = billingAddressRepository.findByCompanyId(company.getCompanyId())
                .map(addr -> BillingAddressDto.builder()
                        .postalCode(addr.getPostalCode())
                        .prefecture(addr.getPrefecture())
                        .city(addr.getCity())
                        .address1(addr.getAddressLine1())
                        .address2(addr.getAddressLine2())
                        .build())
                .orElse(null);

        return BillingDataDto.builder()
                .company(BillingDataDto.BillingCompanyInfo.builder()
                        .companyName(company.getCompanyName())
                        .planName(planName)
                        .build())
                .subscription(subscription != null ? BillingDataDto.BillingSubscriptionInfo.builder()
                        .id(subscription.getSubscriptionId())
                        .planName(planName)
                        .status(subscription.getStatus())
                        .renewalDate(subscription.getCurrentPeriodEnd() != null
                                ? subscription.getCurrentPeriodEnd().toString() : null)
                        .build() : null)
                .billingAddress(billingAddress)
                .paymentMethods(Collections.emptyList()) // TODO: Stripe PaymentMethod一覧取得
                .invoices(invoices)
                .build();
    }

    @Override
    public BillingCheckoutSessionPostResponse createCheckoutSession(BillingCheckoutSessionPostRequest request) {
        Company company = getCurrentCompany();

        // 既にアクティブなサブスクリプションがある場合はエラー
        subscriptionRepository.findByCompanyIdAndStatus(company.getCompanyId(), "active")
                .ifPresent(s -> {
                    throw new BadRequestException(MessageEnum.BUSINESS_ERROR)
                            .context("companyId", company.getCompanyId(), "既にアクティブなサブスクリプションが存在します");
                });

        log.info("Creating checkout session for company: {}, priceId: {}", company.getCompanyId(), request.getPriceId());
        // TODO: Stripe Checkout Session作成 (NAT Gateway経由)
        // Stripe.checkout.sessions.create({ priceId, customerId, successUrl, cancelUrl })

        auditLogHelper.log(company.getCompanyId(), "company", "CHECKOUT_SESSION_CREATE",
                "B", company.getCompanyId(), "チェックアウトセッション作成: priceId=" + request.getPriceId());

        return BillingCheckoutSessionPostResponse.builder()
                .sessionUrl("https://checkout.stripe.com/stub-session-url")
                .build();
    }

    @Override
    public void changePlan(BillingPlanChangePostRequest request) {
        Company company = getCurrentCompany();
        Subscription subscription = subscriptionRepository.findByCompanyIdAndStatus(company.getCompanyId(), "active")
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "companyId", company.getCompanyId()));

        String oldPlanId = subscription.getPlanId();
        subscription.setPlanId(request.getPlanId());
        subscriptionRepository.save(subscription);

        // TODO: Stripe Subscription.update({ subscriptionId, items: [{ priceId }] })

        auditLogHelper.log(company.getCompanyId(), "company", "PLAN_CHANGE",
                "S", subscription.getSubscriptionId(),
                "プラン変更: " + oldPlanId + " → " + request.getPlanId());
        log.info("Plan change requested: company={}, oldPlan={}, newPlan={}",
                company.getCompanyId(), oldPlanId, request.getPlanId());
    }

    @Override
    public void cancelSubscription() {
        Company company = getCurrentCompany();
        Subscription subscription = subscriptionRepository.findByCompanyIdAndStatus(company.getCompanyId(), "active")
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "companyId", company.getCompanyId()));

        subscription.setStatus("canceled");
        subscription.setCanceledAt(LocalDateTime.now());
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);

        // TODO: Stripe Subscription.cancel({ subscriptionId })

        auditLogHelper.log(company.getCompanyId(), "company", "SUBSCRIPTION_CANCEL",
                "S", subscription.getSubscriptionId(), "サブスクリプション解約");
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
        Company company = getCurrentCompany();
        log.info("Coupon apply requested: code={}, company={}", request.getCouponCode(), company.getCompanyId());
        // TODO: Stripe coupon適用
        // Stripe.customers.update(customerId, { coupon: couponCode })
        auditLogHelper.log(company.getCompanyId(), "company", "COUPON_APPLY",
                "B", company.getCompanyId(), "クーポン適用: " + request.getCouponCode());
    }

    private Company getCurrentCompany() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        return companyRepository.findByCognitoSubAndIsDeletedFalse(sub)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "cognitoSub", sub));
    }
}
