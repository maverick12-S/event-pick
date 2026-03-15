package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * お問い合わせエンティティ。
 * テーブル: inquiries
 */
@Entity
@Table(name = "inquiries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Inquiry extends BaseEntity {

    @Id
    @Column(name = "inquiry_id", length = 26)
    private String inquiryId;

    @Column(name = "company_id", length = 26)
    private String companyId;

    @Column(name = "user_id", length = 26)
    private String userId;

    @Column(name = "subject", length = 100, nullable = false)
    private String subject;

    @Column(name = "body", length = 2000, nullable = false)
    private String body;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "reply_body", length = 2000)
    private String replyBody;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;
}
