package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 企業実行履歴DTO — Company_Execution_History エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionHistoryItemDto {

    /** 履歴ID CHAR(26) ULID */
    @Size(max = 26)
    @JsonProperty("history_id")
    private String historyId;

    @Size(max = 26)
    @JsonProperty("company_account_id")
    private String companyAccountId;

    /** 実行機能コード VARCHAR(20) */
    @Size(max = 20)
    @JsonProperty("function_code")
    private String functionCode;

    /** 実行種別 CHAR(1) 1:自動/2:手動/3:システム */
    @JsonProperty("execution_type")
    private String executionType;

    /** 対象種別 CHAR(1) 1:投稿/2:アカウント/3:設定 */
    @JsonProperty("target_type")
    private String targetType;

    /** 結果ステータス CHAR(1) 1:成功/2:失敗 */
    @JsonProperty("result_status")
    private String resultStatus;

    @Size(max = 200)
    @JsonProperty("error_message")
    private String errorMessage;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
