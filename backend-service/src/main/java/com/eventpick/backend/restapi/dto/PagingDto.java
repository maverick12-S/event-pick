package com.eventpick.backend.restapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ページネーション情報DTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagingDto {
    private Integer limit;
    private Boolean hasNext;
    private String nextCursor;
}
