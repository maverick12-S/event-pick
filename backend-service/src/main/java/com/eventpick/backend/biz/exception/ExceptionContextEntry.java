package com.eventpick.backend.biz.exception;

import lombok.Builder;
import lombok.Value;

/**
 * 例外コンテキスト要素。
 * ログ解析用の補足情報をキー/値/説明の三つ組で保持する。
 */
@Value
@Builder
public class ExceptionContextEntry {

    /** コンテキストキー */
    String key;

    /** コンテキスト値 */
    String value;

    /** 説明 (ログ出力時の補足) */
    String description;
}
