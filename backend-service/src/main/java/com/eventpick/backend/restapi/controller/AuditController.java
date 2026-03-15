package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AuditService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "監査ログ (Audit)", description = "監査ログ一覧")
public class AuditController {

    private final AuditService auditService;

    @Operation(summary = "監査ログ一覧", description = "ページネーション付きで監査ログを取得する。")
    @GetMapping
    public CommonResponse<Object> getAuditLogs(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(auditService.getAuditLogs(limit, page));
    }
}
