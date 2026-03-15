package com.eventpick.backend.restapi.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 法人番号バリデーションリクエスト。 */
@Data @NoArgsConstructor @AllArgsConstructor
public class CorporationsValidatePostRequest {
    @NotNull @Size(max = 16)
    @JsonProperty("company_code")
    private String companyCode;
}
