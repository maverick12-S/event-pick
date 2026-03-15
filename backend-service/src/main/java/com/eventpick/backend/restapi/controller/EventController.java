package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.EventService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.EventPostDto;
import com.eventpick.backend.restapi.dto.PostCreateRequestDto;
import com.eventpick.backend.restapi.dto.request.EventMediaUploadRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * イベントコントローラー。
 * 16エンドポイント: events CRUD, today, tomorrow, search, scheduled, drafts, preview, publish, hide, schedule, media
 */
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Validated
public class EventController {

    private final EventService eventService;

    /** GET /api/v1/events - イベント一覧 */
    @GetMapping
    public CommonResponse<List<EventPostDto>> getEvents(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(eventService.getEvents(limit, page));
    }

    /** POST /api/v1/events - イベント作成 */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createEvent(@RequestBody @Valid PostCreateRequestDto request) {
        eventService.createEvent(request);
        return CommonResponse.ok();
    }

    /** GET /api/v1/events/today - 今日のイベント一覧 */
    @GetMapping("/today")
    public CommonResponse<List<EventPostDto>> getTodayEvents() {
        return CommonResponse.ok(eventService.getTodayEvents());
    }

    /** GET /api/v1/events/tomorrow - 明日のイベント一覧 */
    @GetMapping("/tomorrow")
    public CommonResponse<List<EventPostDto>> getTomorrowEvents() {
        return CommonResponse.ok(eventService.getTomorrowEvents());
    }

    /** GET /api/v1/events/search - イベント検索 */
    @GetMapping("/search")
    public CommonResponse<List<EventPostDto>> searchEvents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(eventService.searchEvents(q, category, dateFrom, dateTo, limit, page));
    }

    /** GET /api/v1/events/scheduled - 予約投稿一覧 */
    @GetMapping("/scheduled")
    public CommonResponse<List<EventPostDto>> getScheduledEvents() {
        return CommonResponse.ok(eventService.getScheduledEvents());
    }

    /** GET /api/v1/events/drafts - 下書きイベント一覧 */
    @GetMapping("/drafts")
    public CommonResponse<List<EventPostDto>> getDraftEvents() {
        return CommonResponse.ok(eventService.getDraftEvents());
    }

    /** POST /api/v1/events/preview - イベントプレビュー */
    @PostMapping("/preview")
    public CommonResponse<EventPostDto> previewEvent(@RequestBody @Valid PostCreateRequestDto request) {
        return CommonResponse.ok(eventService.previewEvent(request));
    }

    /** GET /api/v1/events/{eventId} - イベント詳細 */
    @GetMapping("/{eventId}")
    public CommonResponse<EventPostDto> getEvent(@PathVariable String eventId) {
        return CommonResponse.ok(eventService.getEvent(eventId));
    }

    /** PUT /api/v1/events/{eventId} - イベント更新 */
    @PutMapping("/{eventId}")
    public CommonResponse<Void> updateEvent(
            @PathVariable String eventId,
            @RequestBody @Valid PostCreateRequestDto request) {
        eventService.updateEvent(eventId, request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/events/{eventId}/publish - イベント公開 */
    @PostMapping("/{eventId}/publish")
    public CommonResponse<Void> publishEvent(@PathVariable String eventId) {
        eventService.publishEvent(eventId);
        return CommonResponse.ok();
    }

    /** POST /api/v1/events/{eventId}/hide - イベント非公開 */
    @PostMapping("/{eventId}/hide")
    public CommonResponse<Void> hideEvent(@PathVariable String eventId) {
        eventService.hideEvent(eventId);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/events/{eventId}/schedule - 予約投稿削除 */
    @DeleteMapping("/{eventId}/schedule")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String eventId) {
        eventService.deleteSchedule(eventId);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/v1/events/{eventId}/media - メディアアップロード */
    @PostMapping("/{eventId}/media")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> uploadMedia(
            @PathVariable String eventId,
            @ModelAttribute @Valid EventMediaUploadRequest request) {
        eventService.uploadMedia(eventId, request);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/events/{eventId}/media/{mediaId} - メディア削除 */
    @DeleteMapping("/{eventId}/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable String eventId,
            @PathVariable String mediaId) {
        eventService.deleteMedia(eventId, mediaId);
        return ResponseEntity.noContent().build();
    }
}
