package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_templates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTemplate extends BaseEntity {

    @Id
    @Column(name = "template_id", length = 26)
    private String templateId;

    @Column(name = "company_id", length = 26, nullable = false)
    private String companyId;

    @Column(name = "template_name", length = 40, nullable = false)
    private String templateName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
