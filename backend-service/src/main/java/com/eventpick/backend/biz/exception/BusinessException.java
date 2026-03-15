package com.eventpick.backend.biz.exception;

import lombok.Getter;

/**
 * ビジネスロジック例外基底クラス。
 */
@Getter
public class BusinessException extends RuntimeException {
    private final String code;

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
}
