package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.EventPostDto;
import com.eventpick.backend.restapi.dto.PostCreateRequestDto;
import com.eventpick.backend.restapi.dto.request.EventMediaUploadRequest;

import java.time.LocalDate;
import java.util.List;

/**
 * イベントサービスインタフェース。
 */
public interface EventService {
    List<EventPostDto> getEvents(Integer limit, Integer page);
    void createEvent(PostCreateRequestDto request);
    List<EventPostDto> getTodayEvents();
    List<EventPostDto> getTomorrowEvents();
    List<EventPostDto> searchEvents(String q, String category, LocalDate dateFrom, LocalDate dateTo, Integer limit, Integer page);
    List<EventPostDto> getScheduledEvents();
    List<EventPostDto> getDraftEvents();
    EventPostDto previewEvent(PostCreateRequestDto request);
    EventPostDto getEvent(String eventId);
    void updateEvent(String eventId, PostCreateRequestDto request);
    void publishEvent(String eventId);
    void hideEvent(String eventId);
    void deleteSchedule(String eventId);
    void uploadMedia(String eventId, EventMediaUploadRequest request);
    void deleteMedia(String eventId, String mediaId);
    void deleteEvent(String eventId);
}
