package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.EventService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.EventPostDto;
import com.eventpick.backend.restapi.dto.PostCreateRequestDto;
import com.eventpick.backend.restapi.dto.request.EventMediaUploadRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "イベント (Event)", description = "イベントCRUD, 検索, 公開制御, メディア管理")
public class EventController {

    private final EventService eventService;

    /** GET /api/v1/events - イベント一覧 */
    @Operation(summary = "イベント一覧", description = "ページネーション付きでイベント一覧を取得する。")
    @GetMapping
    public CommonResponse<List<EventPostDto>> getEvents(
            @RequestParam(required = false, defaultValue = "40") Integer limit,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        return CommonResponse.ok(eventService.getEvents(limit, page));
    }

    /** POST /api/v1/events - イベント作成 */
    @Operation(summary = "イベント作成", description = "新規イベントを作成する。下書きまたは公開状態で保存。")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> createEvent(@RequestBody @Valid PostCreateRequestDto request) {
        eventService.createEvent(request);
        return CommonResponse.ok();
    }

    /** GET /api/v1/events/today - 今日のイベント一覧 */
    @Operation(summary = "今日のイベント", description = "本日開催のイベント一覧。")
    @GetMapping("/today")
    public CommonResponse<List<EventPostDto>> getTodayEvents() {
        return CommonResponse.ok(eventService.getTodayEvents());
    }

    /** GET /api/v1/events/tomorrow - 明日のイベント一覧 */
    @Operation(summary = "明日のイベント", description = "明日開催のイベント一覧。")
    @GetMapping("/tomorrow")
    public CommonResponse<List<EventPostDto>> getTomorrowEvents() {
        return CommonResponse.ok(eventService.getTomorrowEvents());
    }

    /** GET /api/v1/events/search - イベント検索 */
    @Operation(summary = "イベント検索", description = "キーワード, カテゴリ, 日付範囲条件でイベントを検索する。")
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
    @Operation(summary = "予約投稿一覧", description = "予約投稿状態のイベント一覧。")
    @GetMapping("/scheduled")
    public CommonResponse<List<EventPostDto>> getScheduledEvents() {
        return CommonResponse.ok(eventService.getScheduledEvents());
    }

    /** GET /api/v1/events/drafts - 下書きイベント一覧 */
    @Operation(summary = "下書きイベント一覧", description = "下書き状態のイベント一覧。")
    @GetMapping("/drafts")
    public CommonResponse<List<EventPostDto>> getDraftEvents() {
        return CommonResponse.ok(eventService.getDraftEvents());
    }

    /** POST /api/v1/events/preview - イベントプレビュー */
    @Operation(summary = "イベントプレビュー", description = "保存前のイベントをプレビュー表示用にDTO変換する。")
    @PostMapping("/preview")
    public CommonResponse<EventPostDto> previewEvent(@RequestBody @Valid PostCreateRequestDto request) {
        return CommonResponse.ok(eventService.previewEvent(request));
    }

    /** GET /api/v1/events/{eventId} - イベント詳細 */
    @Operation(summary = "イベント詳細", description = "指定イベントの詳細情報を取得する。")
    @GetMapping("/{eventId}")
    public CommonResponse<EventPostDto> getEvent(@PathVariable String eventId) {
        return CommonResponse.ok(eventService.getEvent(eventId));
    }

    /** PUT /api/v1/events/{eventId} - イベント更新 */
    @Operation(summary = "イベント更新", description = "指定イベントの情報を更新する。")
    @PutMapping("/{eventId}")
    public CommonResponse<Void> updateEvent(
            @PathVariable String eventId,
            @RequestBody @Valid PostCreateRequestDto request) {
        eventService.updateEvent(eventId, request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/events/{eventId}/publish - イベント公開 */
    @Operation(summary = "イベント公開", description = "下書きイベントを公開状態にする。")
    @PostMapping("/{eventId}/publish")
    public CommonResponse<Void> publishEvent(@PathVariable String eventId) {
        eventService.publishEvent(eventId);
        return CommonResponse.ok();
    }

    /** POST /api/v1/events/{eventId}/hide - イベント非公開 */
    @Operation(summary = "イベント非公開", description = "公開中イベントを非公開にする。")
    @PostMapping("/{eventId}/hide")
    public CommonResponse<Void> hideEvent(@PathVariable String eventId) {
        eventService.hideEvent(eventId);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/events/{eventId}/schedule - 予約投稿削除 */
    @Operation(summary = "予約投稿削除", description = "予約投稿スケジュールを削除する。")
    @DeleteMapping("/{eventId}/schedule")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String eventId) {
        eventService.deleteSchedule(eventId);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/v1/events/{eventId}/media - メディアアップロード */
    @Operation(summary = "メディアアップロード", description = "イベントにメディアファイルをアップロードする。S3経由。")
    @PostMapping("/{eventId}/media")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> uploadMedia(
            @PathVariable String eventId,
            @ModelAttribute @Valid EventMediaUploadRequest request) {
        eventService.uploadMedia(eventId, request);
        return CommonResponse.ok();
    }

    /** DELETE /api/v1/events/{eventId}/media/{mediaId} - メディア削除 */
    @Operation(summary = "メディア削除", description = "イベントのメディアファイルを削除する。S3からも削除。")
    @DeleteMapping("/{eventId}/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable String eventId,
            @PathVariable String mediaId) {
        eventService.deleteMedia(eventId, mediaId);
        return ResponseEntity.noContent().build();
    }
}
