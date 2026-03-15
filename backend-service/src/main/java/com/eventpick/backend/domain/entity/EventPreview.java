package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_previews", indexes = {
    @Index(name = "idx_event_previews_post", columnList = "post_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPreview extends BaseEntity {

    @Id
    @Column(name = "preview_id", length = 26)
    private String previewId;

    @Column(name = "post_id", length = 26, nullable = false)
    private String postId;

    @Column(name = "user_id", length = 26)
    private String userId;

    @Column(name = "action_type", length = 10, nullable = false)
    @Builder.Default
    private String actionType = "view";

    @Column(name = "ip_address", length = 45)
    private String ipAddress;
}
