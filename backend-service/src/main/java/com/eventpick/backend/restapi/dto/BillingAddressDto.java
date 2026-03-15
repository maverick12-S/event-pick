package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 請求先住所DTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingAddressDto {

    @NotNull
    @JsonProperty("name")
    private String name;

    @NotNull
    @Email
    @JsonProperty("email")
    private String email;

    @NotNull
    @JsonProperty("country")
    private String country;

    @NotNull
    @JsonProperty("postalCode")
    private String postalCode;

    @NotNull
    @JsonProperty("prefecture")
    private String prefecture;

    @NotNull
    @JsonProperty("city")
    private String city;

    @NotNull
    @JsonProperty("address1")
    private String address1;

    @JsonProperty("address2")
    private String address2;

    @NotNull
    @JsonProperty("phoneCountry")
    private String phoneCountry;

    @NotNull
    @JsonProperty("phoneNumber")
    private String phoneNumber;
}
