package com.eventpick.backend.biz.exception;

/**
 * 競合例外（排他制御等）。
 */
public class ConflictException extends BusinessException {
    public ConflictException(String message) {
        super("E3002", message);
    }
}
