package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.ExecutionHistoryService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.ExecutionHistoryItemDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/execution-history")
@RequiredArgsConstructor
@Tag(name = "実行履歴 (ExecutionHistory)", description = "実行履歴一覧")
public class ExecutionHistoryController {

    private final ExecutionHistoryService executionHistoryService;

    @Operation(summary = "実行履歴一覧", description = "ページネーション付きで実行履歴を取得する。")
    @GetMapping
    public CommonResponse<List<ExecutionHistoryItemDto>> getExecutionHistory(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(executionHistoryService.getExecutionHistory(limit, page));
    }
}
