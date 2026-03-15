package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.ExecutionHistoryService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.ExecutionHistoryItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/execution-history")
@RequiredArgsConstructor
public class ExecutionHistoryController {

    private final ExecutionHistoryService executionHistoryService;

    @GetMapping
    public CommonResponse<List<ExecutionHistoryItemDto>> getExecutionHistory(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(executionHistoryService.getExecutionHistory(limit, page));
    }
}
