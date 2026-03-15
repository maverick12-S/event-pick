package com.eventpick.backend.biz.exception;

/**
 * サービス利用不可例外。
 * メンテナンス時間中や外部サービス障害に使用。
 */
public class ServiceUnavailableException extends BusinessException {

    public ServiceUnavailableException(String message) {
        super(MessageEnum.SERVICE_UNAVAILABLE, message);
    }

    public ServiceUnavailableException(MessageEnum messageEnum, String message) {
        super(messageEnum, message);
    }

    public ServiceUnavailableException(MessageEnum messageEnum, String message, Throwable cause) {
        super(messageEnum, message, cause);
    }
}
