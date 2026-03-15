package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.NotificationService;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public CommonResponse<Object> getNotifications() {
        return CommonResponse.ok(notificationService.getNotifications());
    }

    @PostMapping("/{notificationId}/read")
    public CommonResponse<Void> markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return CommonResponse.ok();
    }

    @PostMapping("/read-all")
    public CommonResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return CommonResponse.ok();
    }
}
