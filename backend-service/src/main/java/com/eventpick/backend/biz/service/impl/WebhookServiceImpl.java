package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.WebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class WebhookServiceImpl implements WebhookService {

    @Override
    public void processStripeWebhook(String payload, String sigHeader) {
        log.info("Processing Stripe webhook. Signature header present: {}", sigHeader != null);
        // TODO: Stripe webhook署名検証 + イベント処理
        // 1. Stripe.Webhook.constructEvent(payload, sigHeader, webhookSecret)
        // 2. イベント種別に応じた処理分岐
        //   - checkout.session.completed → Subscription作成
        //   - invoice.payment_succeeded → 支払い成功記録
        //   - customer.subscription.updated → プラン変更反映
        //   - customer.subscription.deleted → サブスクリプション解約
    }
}
