package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.ReportService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * レポートコントローラー。
 */
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "レポート (Report)", description = "レポート集計, 検索")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "レポート概要")
    @GetMapping("/summary")
    public CommonResponse<Object> getSummary() {
        return CommonResponse.ok(reportService.getSummary());
    }

    @Operation(summary = "レポート検索", description = "キーワードでレポートを検索する。")
    @GetMapping("/search")
    public CommonResponse<Object> searchReports(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(reportService.searchReports(q, limit, page));
    }

    @Operation(summary = "アカウントレポート")
    @GetMapping("/{accountId}")
    public CommonResponse<Object> getAccountReport(@PathVariable String accountId) {
        return CommonResponse.ok(reportService.getAccountReport(accountId));
    }

    @Operation(summary = "イベントレポート")
    @GetMapping("/{accountId}/{eventId}")
    public CommonResponse<Object> getEventReport(
            @PathVariable String accountId, @PathVariable String eventId) {
        return CommonResponse.ok(reportService.getEventReport(accountId, eventId));
    }
}
