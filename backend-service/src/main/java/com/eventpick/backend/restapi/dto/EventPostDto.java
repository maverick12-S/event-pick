package com.eventpick.backend.restapi.dto;

import com.eventpick.backend.restapi.dto.enums.EventStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * イベント投稿DTO — EventPost_c エンティティ準拠。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPostDto {

    @JsonProperty("post_id")
    private String postId;

    @JsonProperty("template_id")
    private String templateId;

    @JsonProperty("company_account_id")
    private String companyAccountId;

    @Size(max = 20)
    @JsonProperty("title")
    private String title;

    @Size(max = 80)
    @JsonProperty("summary")
    private String summary;

    @Size(max = 1000)
    @JsonProperty("description")
    private String description;

    @JsonProperty("reservation_url")
    private String reservationUrl;

    /** 住所 VARCHAR(100) */
    @Size(max = 100)
    @JsonProperty("address")
    private String address;

    @JsonProperty("event_date")
    private LocalDate eventDate;

    @JsonProperty("event_start_time")
    private String eventStartTime;

    @JsonProperty("event_end_time")
    private String eventEndTime;

    @JsonProperty("category_id")
    private String categoryId;

    @JsonProperty("status")
    private EventStatus status;

    @JsonProperty("like_count")
    private Integer likeCount;
}
