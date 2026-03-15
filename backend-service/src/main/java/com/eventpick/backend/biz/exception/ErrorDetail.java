package com.eventpick.backend.biz.exception;

import lombok.Builder;
import lombok.Value;

/**
 * クライアント返却用のエラー明細。
 * BadRequestException 等でフィールド単位のエラーを積み上げるために使用。
 */
@Value
@Builder
public class ErrorDetail {

    /** 対象フィールドパス (空文字 = リクエスト全体) */
    String field;

    /** 明細エラーコード */
    String errorCode;

    /** 明細メッセージ */
    String message;

    /** 補足値 (不正だった実値など) */
    String rejectedValue;
}
