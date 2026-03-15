package com.eventpick.backend.restapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * レートリミット情報DTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitInfoDto {
    private Integer limit;
    private Integer remaining;
    private Integer reset;
}
