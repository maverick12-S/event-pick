package com.eventpick.backend.biz.service;

/**
 * 通知サービスインタフェース。
 */
public interface NotificationService {
    Object getNotifications();
    void markAsRead(String notificationId);
    void markAllAsRead();
}
