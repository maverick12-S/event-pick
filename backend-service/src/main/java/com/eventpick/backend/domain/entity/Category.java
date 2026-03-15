package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * カテゴリエンティティ。
 * テーブル: categories
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity {

    @Id
    @Column(name = "category_id", length = 26)
    private String categoryId;

    @Column(name = "category_name", length = 40, nullable = false)
    private String categoryName;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
