package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 請求先住所エンティティ。
 * テーブル: billing_addresses
 */
@Entity
@Table(name = "billing_addresses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingAddress extends BaseEntity {

    @Id
    @Column(name = "billing_address_id", length = 26)
    private String billingAddressId;

    @Column(name = "company_id", length = 26, nullable = false, unique = true)
    private String companyId;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "prefecture", length = 10)
    private String prefecture;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "address_line1", length = 100)
    private String addressLine1;

    @Column(name = "address_line2", length = 100)
    private String addressLine2;

    @Column(name = "building_name", length = 100)
    private String buildingName;
}
