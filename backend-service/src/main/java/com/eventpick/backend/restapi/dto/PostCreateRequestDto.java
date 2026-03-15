package com.eventpick.backend.restapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * イベント作成リクエストDTO。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequestDto {

    @NotNull
    @Size(max = 20)
    @JsonProperty("title")
    private String title;

    /** 画像URL一覧 EventMedia_c.image_url VARCHAR(255) 最大3件 */
    @NotNull
    @Size(max = 3)
    @JsonProperty("image_urls")
    private List<@Size(max = 255) String> imageUrls;

    @NotNull
    @Size(max = 80)
    @JsonProperty("summary")
    private String summary;

    @Size(max = 1000)
    @JsonProperty("description")
    private String description;

    @Size(max = 255)
    @JsonProperty("reservation_url")
    private String reservationUrl;

    /** 住所ID Event_Template_c.location_id CHAR(26) */
    @Size(max = 26)
    @JsonProperty("location_id")
    private String locationId;

    /** 会場名テキスト */
    @Size(max = 40)
    @JsonProperty("venue_name")
    private String venueName;

    /** 開始時間 HH:mm:ss TIME(8) */
    @JsonProperty("event_start_time")
    private String eventStartTime;

    /** 終了時間 HH:mm:ss TIME(8) */
    @JsonProperty("event_end_time")
    private String eventEndTime;

    @NotNull
    @Size(max = 26)
    @JsonProperty("category_id")
    private String categoryId;

    /** 投稿予定日一覧 YYYY-MM-DD EventSchedule_c.event_date */
    @NotNull
    @JsonProperty("scheduled_dates")
    private List<LocalDate> scheduledDates;
}
