package com.eventpick.backend.biz.exception;

/**
 * サービス利用不可例外。
 */
public class ServiceUnavailableException extends BusinessException {
    public ServiceUnavailableException(String message) {
        super("E5001", message);
    }
}
