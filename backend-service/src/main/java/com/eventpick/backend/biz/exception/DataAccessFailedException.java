package com.eventpick.backend.biz.exception;

/**
 * DBアクセス失敗例外。
 * 一意制約違反やデッドロック等、Repository層の例外翻訳で使用。
 */
public class DataAccessFailedException extends BusinessException {

    public DataAccessFailedException(MessageEnum messageEnum) {
        super(messageEnum);
    }

    public DataAccessFailedException(MessageEnum messageEnum, String message) {
        super(messageEnum, message);
    }

    public DataAccessFailedException(MessageEnum messageEnum, String message, Throwable cause) {
        super(messageEnum, message, cause);
    }
}
