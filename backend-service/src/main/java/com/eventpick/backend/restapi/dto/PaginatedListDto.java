package com.eventpick.backend.restapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ページネーション付きリストDTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedListDto<T> {
    private List<T> data;
    private PagingDto pagination;
}
