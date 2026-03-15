package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ticket_histories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistory extends BaseEntity {

    @Id
    @Column(name = "history_id", length = 26)
    private String historyId;

    @Column(name = "ticket_id", length = 26, nullable = false)
    private String ticketId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "post_id", length = 26)
    private String postId;

    @Column(name = "action", length = 20, nullable = false)
    private String action;

    @Column(name = "amount", nullable = false)
    private Integer amount;
}
