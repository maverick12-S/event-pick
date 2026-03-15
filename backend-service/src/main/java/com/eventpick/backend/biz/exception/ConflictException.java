package com.eventpick.backend.biz.exception;

/**
 * 競合例外（排他制御等）。
 */
public class ConflictException extends BusinessException {

    public ConflictException(String message) {
        super(MessageEnum.CONFLICT, message);
    }

    public ConflictException(MessageEnum messageEnum, String message) {
        super(messageEnum, message);
    }

    public ConflictException(MessageEnum messageEnum, String message, Throwable cause) {
        super(messageEnum, message, cause);
    }
}
