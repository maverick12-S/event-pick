package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.NotificationService;
import com.eventpick.backend.restapi.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "通知 (Notification)", description = "通知一覧, 既読処理")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "通知一覧")
    @GetMapping
    public CommonResponse<Object> getNotifications() {
        return CommonResponse.ok(notificationService.getNotifications());
    }

    @Operation(summary = "通知既読", description = "指定通知を既読にする。")
    @PostMapping("/{notificationId}/read")
    public CommonResponse<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return CommonResponse.ok();
    }

    @Operation(summary = "全通知既読", description = "全ての未読通知を既読にする。")
    @PostMapping("/read-all")
    public CommonResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return CommonResponse.ok();
    }
}
