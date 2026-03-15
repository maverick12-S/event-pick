package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 請求情報DTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingDataDto {

    @JsonProperty("company")
    private BillingCompanyInfo company;

    @JsonProperty("subscription")
    private BillingSubscriptionInfo subscription;

    @JsonProperty("paymentMethods")
    private List<PaymentMethodInfo> paymentMethods;

    @JsonProperty("billingAddress")
    private BillingAddressDto billingAddress;

    @JsonProperty("invoices")
    private List<InvoiceInfo> invoices;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingCompanyInfo {
        @JsonProperty("company_name")
        private String companyName;
        @JsonProperty("plan_name")
        private String planName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingSubscriptionInfo {
        private String id;
        private String planName;
        private String cycle;
        private Integer unitAmount;
        private String status;
        private String renewalDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodInfo {
        private String id;
        private String brand;
        private String last4;
        private Integer expMonth;
        private Integer expYear;
        private Boolean isDefault;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceInfo {
        private String id;
        private String date;
        private Integer amount;
        private String status;
        private String pdfUrl;
    }
}
