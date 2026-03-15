package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * クーポンエンティティ。
 * テーブル: coupons
 */
@Entity
@Table(name = "coupons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon extends BaseEntity {

    @Id
    @Column(name = "coupon_id", length = 26)
    private String couponId;

    @Column(name = "coupon_code", length = 32, nullable = false, unique = true)
    private String couponCode;

    @Column(name = "description", length = 200)
    private String description;

    /** 割引種別 CHAR(1) 1:金額 / 2:率 */
    @Column(name = "discount_type", length = 1, nullable = false)
    private String discountType;

    @Column(name = "discount_value", precision = 10, scale = 2, nullable = false)
    private BigDecimal discountValue;

    @Column(name = "valid_from")
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    @Column(name = "max_usage")
    private Integer maxUsage;

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
