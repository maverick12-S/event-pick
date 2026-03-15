package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.WebhookService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Webhookコントローラー。Stripe Webhook (認証不要)
 */
@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping("/stripe")
    public CommonResponse<Void> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        webhookService.processStripeWebhook(payload, sigHeader);
        return CommonResponse.ok();
    }
}
