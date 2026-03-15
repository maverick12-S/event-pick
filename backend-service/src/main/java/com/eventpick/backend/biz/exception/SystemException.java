package com.eventpick.backend.biz.exception;

/**
 * システム障害例外。
 * 予期しない実行時エラー、外部サービス障害等。
 */
public class SystemException extends BusinessException {

    public SystemException(MessageEnum messageEnum) {
        super(messageEnum);
    }

    public SystemException(MessageEnum messageEnum, String message) {
        super(messageEnum, message);
    }

    public SystemException(MessageEnum messageEnum, String message, Throwable cause) {
        super(messageEnum, message, cause);
    }

    public SystemException(String message, Throwable cause) {
        super(MessageEnum.SYSTEM_ERROR, message, cause);
    }
}
