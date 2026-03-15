package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 企業チケットエンティティ。
 * テーブル: company_tickets
 */
@Entity
@Table(name = "company_tickets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyTicket extends BaseEntity {

    @Id
    @Column(name = "ticket_id", length = 26)
    private String ticketId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "total_tickets", nullable = false)
    @Builder.Default
    private Integer totalTickets = 0;

    @Column(name = "used_tickets", nullable = false)
    @Builder.Default
    private Integer usedTickets = 0;

    @Column(name = "remaining_tickets", nullable = false)
    @Builder.Default
    private Integer remainingTickets = 0;

    @Column(name = "ticket_date")
    private java.time.LocalDate ticketDate;
}
