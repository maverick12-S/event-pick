package com.eventpick.backend.biz.exception;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ビジネスロジック例外基底クラス (BaseException相当)。
 * <p>
 * 全ての業務例外の基底。以下を保持する:
 * <ul>
 *   <li>{@link MessageEnum} - 代表メッセージ/ログレベル/スタックトレース出力方針</li>
 *   <li>{@link ExceptionContextEntry} リスト - ログ解析用の補足コンテキスト</li>
 *   <li>{@link ErrorDetail} リスト - クライアント返却用の明細エラー</li>
 * </ul>
 * 使い方:
 * <pre>
 * throw new BusinessException(MessageEnum.BUSINESS_ERROR, "在庫不足です")
 *         .context("itemId", itemId, "対象商品ID")
 *         .detail("quantity", "E01010", "在庫が不足しています", requestedQty);
 * </pre>
 */
@Getter
public class BusinessException extends RuntimeException {

    private final String code;
    private final MessageEnum messageEnum;
    private final List<ExceptionContextEntry> contextEntries = new ArrayList<>();
    private final List<ErrorDetail> details = new ArrayList<>();

    public BusinessException(MessageEnum messageEnum) {
        super(messageEnum.getDefaultMessage());
        this.code = messageEnum.getCode();
        this.messageEnum = messageEnum;
    }

    public BusinessException(MessageEnum messageEnum, String message) {
        super(message);
        this.code = messageEnum.getCode();
        this.messageEnum = messageEnum;
    }

    public BusinessException(MessageEnum messageEnum, String message, Throwable cause) {
        super(message, cause);
        this.code = messageEnum.getCode();
        this.messageEnum = messageEnum;
    }

    /** 後方互換: コード文字列直接指定 */
    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
        this.messageEnum = MessageEnum.BUSINESS_ERROR;
    }

    /** 後方互換: コード文字列直接指定 + cause */
    public BusinessException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.messageEnum = MessageEnum.BUSINESS_ERROR;
    }

    /**
     * ログ解析用の補足コンテキストを積む。
     */
    public BusinessException context(String key, String value, String description) {
        this.contextEntries.add(ExceptionContextEntry.builder()
                .key(key).value(value).description(description).build());
        return this;
    }

    /**
     * クライアント返却用の明細エラーを積む。
     */
    public BusinessException detail(String field, String errorCode, String message, String rejectedValue) {
        this.details.add(ErrorDetail.builder()
                .field(field).errorCode(errorCode).message(message).rejectedValue(rejectedValue).build());
        return this;
    }

    /** 不変の明細リストを返す */
    public List<ErrorDetail> getDetails() {
        return Collections.unmodifiableList(details);
    }

    /** 不変のコンテキストリストを返す */
    public List<ExceptionContextEntry> getContextEntries() {
        return Collections.unmodifiableList(contextEntries);
    }
}
