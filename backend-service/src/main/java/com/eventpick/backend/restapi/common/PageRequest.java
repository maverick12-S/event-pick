package com.eventpick.backend.restapi.common;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

/**
 * ページネーション共通リクエスト。
 */
@Data
public class PageRequest {

    /** 1ページ件数（デフォルト: 40） */
    @Min(1)
    @Max(100)
    private Integer limit = 40;

    /** ページ番号（1から開始） */
    @Min(1)
    private Integer page = 1;

    /**
     * JPA/SQLのOFFSET値を算出する。
     */
    public int getOffset() {
        return (page - 1) * limit;
    }
}
