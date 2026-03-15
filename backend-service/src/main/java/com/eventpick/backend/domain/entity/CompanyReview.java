package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 企業審査エンティティ。
 * テーブル: company_reviews
 */
@Entity
@Table(name = "company_reviews")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyReview extends BaseEntity {

    @Id
    @Column(name = "review_id", length = 26)
    private String reviewId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    /** 申請種別 CHAR(1) */
    @Column(name = "review_type", length = 1)
    private String reviewType;

    /** 審査ステータス CHAR(1) */
    @Column(name = "review_status", length = 1, nullable = false)
    private String reviewStatus;

    @Column(name = "reviewer_id", length = 26)
    private String reviewerId;

    @Column(name = "review_comment", length = 500)
    private String reviewComment;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
}
