package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * イベント投稿エンティティ。
 * テーブル: event_posts
 */
@Entity
@Table(name = "event_posts", indexes = {
    @Index(name = "idx_event_posts_company", columnList = "company_account_id"),
    @Index(name = "idx_event_posts_status", columnList = "status"),
    @Index(name = "idx_event_posts_event_date", columnList = "event_date"),
    @Index(name = "idx_event_posts_category", columnList = "category_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPost extends BaseEntity {

    @Id
    @Column(name = "post_id", length = 26)
    private String postId;

    @Column(name = "template_id", length = 26)
    private String templateId;

    @Column(name = "company_account_id", length = 26, nullable = false)
    private String companyAccountId;

    @Column(name = "title", length = 20, nullable = false)
    private String title;

    @Column(name = "summary", length = 80)
    private String summary;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "reservation_url", length = 512)
    private String reservationUrl;

    @Column(name = "address", length = 100)
    private String address;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_start_time")
    private LocalTime eventStartTime;

    @Column(name = "event_end_time")
    private LocalTime eventEndTime;

    @Column(name = "category_id", length = 26)
    private String categoryId;

    /** イベント公開状態 CHAR(1) 1:公開前 / 2:公開中 / 3:終了 */
    @Column(name = "status", length = 1, nullable = false)
    private String status;

    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Integer likeCount = 0;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;
}
