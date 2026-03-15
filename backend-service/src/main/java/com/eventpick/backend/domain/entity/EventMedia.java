package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * イベントメディアエンティティ。
 * テーブル: event_media
 */
@Entity
@Table(name = "event_media")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventMedia extends BaseEntity {

    @Id
    @Column(name = "media_id", length = 26)
    private String mediaId;

    @Column(name = "post_id", length = 26, nullable = false)
    private String postId;

    @Column(name = "file_url", length = 512, nullable = false)
    private String fileUrl;

    @Column(name = "file_name", length = 256)
    private String fileName;

    @Column(name = "content_type", length = 64)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
