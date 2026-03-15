package com.eventpick.backend.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * カスタムビジネスメトリクス設定。
 * Prometheus / CloudWatch 向けのアプリケーション固有メトリクス。
 */
@Configuration
public class MetricsConfig {

    @Bean
    public Counter eventCreatedCounter(MeterRegistry registry) {
        return Counter.builder("eventpick.events.created")
                .description("イベント作成件数")
                .register(registry);
    }

    @Bean
    public Counter ticketPurchasedCounter(MeterRegistry registry) {
        return Counter.builder("eventpick.tickets.purchased")
                .description("チケット購入件数")
                .register(registry);
    }

    @Bean
    public Counter userSignupCounter(MeterRegistry registry) {
        return Counter.builder("eventpick.users.signup")
                .description("ユーザー登録件数")
                .register(registry);
    }

    @Bean
    public Timer externalApiTimer(MeterRegistry registry) {
        return Timer.builder("eventpick.external.api.duration")
                .description("外部API呼び出し所要時間")
                .register(registry);
    }

    @Bean
    public Counter billingFailureCounter(MeterRegistry registry) {
        return Counter.builder("eventpick.billing.failures")
                .description("決済失敗件数")
                .register(registry);
    }
}
