package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "company_billings", indexes = {
    @Index(name = "idx_company_billings_company", columnList = "company_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyBilling extends BaseEntity {

    @Id
    @Column(name = "billing_id", length = 26)
    private String billingId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "subscription_id", length = 26)
    private String subscriptionId;

    @Column(name = "stripe_invoice_id", length = 64)
    private String stripeInvoiceId;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "tax_amount", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "status", length = 20, nullable = false)
    @Builder.Default
    private String status = "pending";

    @Column(name = "billing_period_start")
    private LocalDateTime billingPeriodStart;

    @Column(name = "billing_period_end")
    private LocalDateTime billingPeriodEnd;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
