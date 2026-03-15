package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 市区町村マスタエンティティ。
 * テーブル: cities
 */
@Entity
@Table(name = "cities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class City extends BaseEntity {

    @Id
    @Column(name = "city_code", length = 5)
    private String cityCode;

    @Column(name = "prefecture_code", length = 2, nullable = false)
    private String prefectureCode;

    @Column(name = "city_name", length = 40, nullable = false)
    private String cityName;
}
