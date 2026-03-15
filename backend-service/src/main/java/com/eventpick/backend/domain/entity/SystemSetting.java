package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * システム設定エンティティ。
 * テーブル: system_settings
 */
@Entity
@Table(name = "system_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting extends BaseEntity {

    @Id
    @Column(name = "setting_key", length = 64)
    private String settingKey;

    @Column(name = "setting_value", length = 2000)
    private String settingValue;

    @Column(name = "description", length = 200)
    private String description;
}
