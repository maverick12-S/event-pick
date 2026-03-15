package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AuditService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public CommonResponse<Object> getAuditLogs(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(auditService.getAuditLogs(limit, page));
    }
}
