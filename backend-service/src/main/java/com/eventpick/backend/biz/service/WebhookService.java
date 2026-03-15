package com.eventpick.backend.biz.service;

/**
 * Webhookサービスインタフェース。
 */
public interface WebhookService {
    void processStripeWebhook(String payload, String sigHeader);
}
