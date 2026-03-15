package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * プランエンティティ。
 * テーブル: plans
 */
@Entity
@Table(name = "plans")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plan extends BaseEntity {

    @Id
    @Column(name = "plan_id", length = 26)
    private String planId;

    @Column(name = "plan_name", length = 40, nullable = false)
    private String planName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "billing_cycle", length = 20)
    private String billingCycle;

    @Column(name = "stripe_price_id", length = 64)
    private String stripePriceId;

    @Column(name = "daily_ticket_limit", nullable = false)
    @Builder.Default
    private Integer dailyTicketLimit = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
