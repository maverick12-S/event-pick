package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.WebhookService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.domain.entity.*;
import com.eventpick.backend.domain.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class WebhookServiceImpl implements WebhookService {

    private final SubscriptionRepository subscriptionRepository;
    private final CompanyBillingRepository companyBillingRepository;
    private final CompanyTicketRepository companyTicketRepository;
    private final PlanRepository planRepository;
    private final CompanyNotificationRepository notificationRepository;
    private final AuditLogHelper auditLogHelper;
    private final ObjectMapper objectMapper;

    @Override
    public void processStripeWebhook(String payload, String sigHeader) {
        log.info("Processing Stripe webhook. Signature header present: {}", sigHeader != null);

        // TODO: Stripe署名検証
        // Stripe.Webhook.constructEvent(payload, sigHeader, webhookSecret)
        // 署名検証失敗時はBadRequestExceptionをスロー

        try {
            JsonNode root = objectMapper.readTree(payload);
            String eventType = root.path("type").asText();
            JsonNode data = root.path("data").path("object");

            switch (eventType) {
                case "checkout.session.completed" -> handleCheckoutCompleted(data);
                case "invoice.payment_succeeded" -> handlePaymentSucceeded(data);
                case "customer.subscription.updated" -> handleSubscriptionUpdated(data);
                case "customer.subscription.deleted" -> handleSubscriptionDeleted(data);
                default -> log.info("Unhandled Stripe event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Stripe webhook processing failed", e);
            throw new RuntimeException("Webhook処理に失敗しました", e);
        }
    }

    /**
     * checkout.session.completed: サブスクリプション作成 + チケット付与
     */
    private void handleCheckoutCompleted(JsonNode data) {
        String stripeSubscriptionId = data.path("subscription").asText(null);
        String stripeCustomerId = data.path("customer").asText(null);
        String clientReferenceId = data.path("client_reference_id").asText(null); // companyId

        if (stripeSubscriptionId == null || clientReferenceId == null) {
            log.warn("checkout.session.completed: missing subscription or client_reference_id");
            return;
        }

        // メタデータからplanIdを取得
        String planId = data.path("metadata").path("plan_id").asText(null);
        Plan plan = planId != null ? planRepository.findById(planId).orElse(null) : null;

        // サブスクリプション作成
        Subscription subscription = Subscription.builder()
                .subscriptionId(IdGenerator.generateUlid())
                .companyId(clientReferenceId)
                .planId(planId != null ? planId : "unknown")
                .stripeSubscriptionId(stripeSubscriptionId)
                .status("active")
                .autoRenew(true)
                .currentPeriodStart(LocalDateTime.now())
                .currentPeriodEnd(LocalDateTime.now().plusMonths(1))
                .build();
        subscriptionRepository.save(subscription);

        // 初回チケット付与
        int dailyLimit = plan != null ? plan.getDailyTicketLimit() : 1;
        CompanyTicket ticket = companyTicketRepository.findByCompanyId(clientReferenceId)
                .orElse(CompanyTicket.builder()
                        .ticketId(IdGenerator.generateUlid())
                        .companyId(clientReferenceId)
                        .build());
        ticket.setTotalTickets(dailyLimit);
        ticket.setRemainingTickets(dailyLimit);
        ticket.setUsedTickets(0);
        ticket.setTicketDate(java.time.LocalDate.now());
        companyTicketRepository.save(ticket);

        // 通知
        sendNotification(clientReferenceId,
                "サブスクリプション開始",
                "サブスクリプションが有効になりました。" + (plan != null ? "プラン: " + plan.getPlanName() : ""));

        auditLogHelper.log(clientReferenceId, "system", "SUBSCRIPTION_CREATE",
                "S", subscription.getSubscriptionId(), "Stripe checkout completed");
        log.info("Subscription created: companyId={}, subscriptionId={}", clientReferenceId, subscription.getSubscriptionId());
    }

    /**
     * invoice.payment_succeeded: 請求記録作成
     */
    private void handlePaymentSucceeded(JsonNode data) {
        String stripeInvoiceId = data.path("id").asText(null);
        String stripeSubscriptionId = data.path("subscription").asText(null);
        long amountPaid = data.path("amount_paid").asLong(0);
        long tax = data.path("tax").asLong(0);

        Subscription subscription = stripeSubscriptionId != null
                ? subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId).orElse(null)
                : null;

        if (subscription == null) {
            log.warn("invoice.payment_succeeded: subscription not found for stripeSubscriptionId={}", stripeSubscriptionId);
            return;
        }

        // 請求記録作成
        CompanyBilling billing = CompanyBilling.builder()
                .billingId(IdGenerator.generateUlid())
                .companyId(subscription.getCompanyId())
                .subscriptionId(subscription.getSubscriptionId())
                .stripeInvoiceId(stripeInvoiceId)
                .amount(BigDecimal.valueOf(amountPaid))
                .taxAmount(BigDecimal.valueOf(tax))
                .status("paid")
                .billingPeriodStart(subscription.getCurrentPeriodStart())
                .billingPeriodEnd(subscription.getCurrentPeriodEnd())
                .paidAt(LocalDateTime.now())
                .build();
        companyBillingRepository.save(billing);

        sendNotification(subscription.getCompanyId(),
                "お支払い完了",
                "¥" + amountPaid + " のお支払いが完了しました。");

        auditLogHelper.log(subscription.getCompanyId(), "system", "PAYMENT_SUCCESS",
                "B", billing.getBillingId(), "Stripe invoice paid: " + stripeInvoiceId);
        log.info("Payment succeeded: companyId={}, amount={}", subscription.getCompanyId(), amountPaid);
    }

    /**
     * customer.subscription.updated: プラン変更・期間更新反映
     */
    private void handleSubscriptionUpdated(JsonNode data) {
        String stripeSubscriptionId = data.path("id").asText(null);
        String status = data.path("status").asText("active");

        Subscription subscription = stripeSubscriptionId != null
                ? subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId).orElse(null)
                : null;

        if (subscription == null) {
            log.warn("customer.subscription.updated: subscription not found for {}", stripeSubscriptionId);
            return;
        }

        subscription.setStatus(status);

        // 期間更新
        long periodStart = data.path("current_period_start").asLong(0);
        long periodEnd = data.path("current_period_end").asLong(0);
        if (periodStart > 0) {
            subscription.setCurrentPeriodStart(
                    LocalDateTime.ofInstant(Instant.ofEpochSecond(periodStart), ZoneId.of("Asia/Tokyo")));
        }
        if (periodEnd > 0) {
            subscription.setCurrentPeriodEnd(
                    LocalDateTime.ofInstant(Instant.ofEpochSecond(periodEnd), ZoneId.of("Asia/Tokyo")));
        }
        subscriptionRepository.save(subscription);

        auditLogHelper.log(subscription.getCompanyId(), "system", "SUBSCRIPTION_UPDATE",
                "S", subscription.getSubscriptionId(), "Stripe subscription updated: status=" + status);
        log.info("Subscription updated: companyId={}, status={}", subscription.getCompanyId(), status);
    }

    /**
     * customer.subscription.deleted: サブスクリプション解約
     */
    private void handleSubscriptionDeleted(JsonNode data) {
        String stripeSubscriptionId = data.path("id").asText(null);

        Subscription subscription = stripeSubscriptionId != null
                ? subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId).orElse(null)
                : null;

        if (subscription == null) {
            log.warn("customer.subscription.deleted: subscription not found for {}", stripeSubscriptionId);
            return;
        }

        subscription.setStatus("canceled");
        subscription.setCanceledAt(LocalDateTime.now());
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);

        sendNotification(subscription.getCompanyId(),
                "サブスクリプション解約",
                "サブスクリプションが解約されました。");

        auditLogHelper.log(subscription.getCompanyId(), "system", "SUBSCRIPTION_CANCEL",
                "S", subscription.getSubscriptionId(), "Stripe subscription deleted");
        log.info("Subscription canceled via webhook: companyId={}", subscription.getCompanyId());
    }

    private void sendNotification(String companyId, String title, String message) {
        CompanyNotification notification = CompanyNotification.builder()
                .notificationId(IdGenerator.generateUlid())
                .companyId(companyId)
                .title(title)
                .message(message)
                .notificationType("2") // 課金関連
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
