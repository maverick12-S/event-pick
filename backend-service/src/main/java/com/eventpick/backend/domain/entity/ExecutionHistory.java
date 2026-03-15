package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 実行履歴エンティティ。
 * テーブル: execution_histories
 */
@Entity
@Table(name = "execution_histories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionHistory extends BaseEntity {

    @Id
    @Column(name = "execution_id", length = 26)
    private String executionId;

    @Column(name = "company_id", length = 26)
    private String companyId;

    /** 実行種別 CHAR(1) */
    @Column(name = "execution_type", length = 1, nullable = false)
    private String executionType;

    @Column(name = "target_id", length = 26)
    private String targetId;

    /** 結果ステータス CHAR(1) */
    @Column(name = "result_status", length = 1, nullable = false)
    private String resultStatus;

    @Column(name = "message", length = 500)
    private String message;

    @Column(name = "executed_at", nullable = false)
    private LocalDateTime executedAt;
}
