package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.ExecutionHistoryItemDto;

import java.util.List;

/**
 * 実行履歴サービスインタフェース。
 */
public interface ExecutionHistoryService {
    List<ExecutionHistoryItemDto> getExecutionHistory(Integer limit, Integer page);
}
