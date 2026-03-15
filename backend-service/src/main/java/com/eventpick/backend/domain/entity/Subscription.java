package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * サブスクリプションエンティティ。
 * テーブル: subscriptions
 */
@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity {

    @Id
    @Column(name = "subscription_id", length = 26)
    private String subscriptionId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "plan_id", length = 26, nullable = false)
    private String planId;

    @Column(name = "stripe_subscription_id", length = 64)
    private String stripeSubscriptionId;

    /** サブスクリプション状態 */
    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "auto_renew", nullable = false)
    @Builder.Default
    private Boolean autoRenew = true;

    @Column(name = "current_period_start")
    private LocalDateTime currentPeriodStart;

    @Column(name = "current_period_end")
    private LocalDateTime currentPeriodEnd;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;
}
