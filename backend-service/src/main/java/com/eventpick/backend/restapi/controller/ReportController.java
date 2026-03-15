package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.ReportService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * レポートコントローラー。
 */
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public CommonResponse<Object> getSummary() {
        return CommonResponse.ok(reportService.getSummary());
    }

    @GetMapping("/search")
    public CommonResponse<Object> searchReports(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(reportService.searchReports(q, limit, page));
    }

    @GetMapping("/{accountId}")
    public CommonResponse<Object> getAccountReport(@PathVariable String accountId) {
        return CommonResponse.ok(reportService.getAccountReport(accountId));
    }

    @GetMapping("/{accountId}/{eventId}")
    public CommonResponse<Object> getEventReport(
            @PathVariable String accountId, @PathVariable String eventId) {
        return CommonResponse.ok(reportService.getEventReport(accountId, eventId));
    }
}
