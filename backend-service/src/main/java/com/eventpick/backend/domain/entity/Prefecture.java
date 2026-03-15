package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 都道府県マスタエンティティ。
 * テーブル: prefectures
 */
@Entity
@Table(name = "prefectures")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prefecture extends BaseEntity {

    @Id
    @Column(name = "prefecture_code", length = 2)
    private String prefectureCode;

    @Column(name = "prefecture_name", length = 10, nullable = false)
    private String prefectureName;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
