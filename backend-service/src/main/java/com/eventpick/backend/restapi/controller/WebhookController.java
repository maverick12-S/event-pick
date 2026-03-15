package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.WebhookService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Webhookコントローラー。Stripe Webhook (認証不要)
 */
@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Tag(name = "Webhook", description = "Stripe Webhook受信 (認証不要)")
public class WebhookController {

    private final WebhookService webhookService;

    @Operation(summary = "Stripe Webhook受信", description = "Stripe決済イベントを受信し処理する。Stripe-Signatureヘッダーで署名検証。認証不要。")
    @PostMapping("/stripe")
    public CommonResponse<Void> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        webhookService.processStripeWebhook(payload, sigHeader);
        return CommonResponse.ok();
    }
}
