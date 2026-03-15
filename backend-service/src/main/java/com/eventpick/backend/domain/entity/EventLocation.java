package com.eventpick.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_locations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventLocation extends BaseEntity {

    @Id
    @Column(name = "location_id", length = 26)
    private String locationId;

    @Column(name = "location_name", length = 80, nullable = false)
    private String locationName;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "prefecture_code", length = 2)
    private String prefectureCode;

    @Column(name = "city_code", length = 5)
    private String cityCode;
}
