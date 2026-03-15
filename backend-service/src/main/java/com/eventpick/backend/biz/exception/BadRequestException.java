package com.eventpick.backend.biz.exception;

/**
 * パラメータ不正・入力チェック不正例外。
 * バリデーション系のSpring例外もここに集約される。
 */
public class BadRequestException extends BusinessException {

    public BadRequestException(MessageEnum messageEnum) {
        super(messageEnum);
    }

    public BadRequestException(MessageEnum messageEnum, String message) {
        super(messageEnum, message);
    }

    public BadRequestException(MessageEnum messageEnum, String message, Throwable cause) {
        super(messageEnum, message, cause);
    }
}
