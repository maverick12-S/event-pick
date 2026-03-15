package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BadRequestException;
import com.eventpick.backend.biz.exception.MessageEnum;
import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.EventService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.*;
import com.eventpick.backend.domain.repository.*;
import com.eventpick.backend.restapi.dto.EventPostDto;
import com.eventpick.backend.restapi.dto.PostCreateRequestDto;
import com.eventpick.backend.restapi.dto.enums.EventStatus;
import com.eventpick.backend.restapi.dto.request.EventMediaUploadRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {

    private static final int MAX_MEDIA_PER_EVENT = 3;
    private static final long MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

    private final EventPostRepository eventPostRepository;
    private final EventMediaRepository eventMediaRepository;
    private final CompanyRepository companyRepository;
    private final CompanyTicketRepository ticketRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final EventPreviewRepository eventPreviewRepository;
    private final AuditLogHelper auditLogHelper;

    @Override
    @Transactional(readOnly = true)
    public List<EventPostDto> getEvents(Integer limit, Integer page) {
        return eventPostRepository.findByIsDeletedFalse(
                PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void createEvent(PostCreateRequestDto request) {
        // 認証ユーザーから企業を特定
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElseThrow();

        EventPost event = EventPost.builder()
                .postId(IdGenerator.generateUlid())
                .companyAccountId(company.getCompanyId())
                .title(request.getTitle())
                .summary(request.getSummary())
                .description(request.getDescription())
                .reservationUrl(request.getReservationUrl())
                .address(request.getVenueName())
                .eventDate(request.getScheduledDates() != null && !request.getScheduledDates().isEmpty()
                        ? request.getScheduledDates().get(0) : null)
                .eventStartTime(request.getEventStartTime() != null ? LocalTime.parse(request.getEventStartTime()) : null)
                .eventEndTime(request.getEventEndTime() != null ? LocalTime.parse(request.getEventEndTime()) : null)
                .categoryId(request.getCategoryId())
                .status(EventStatus.BEFORE_PUBLISH.getCode())
                .likeCount(0)
                .isDeleted(false)
                .build();
        eventPostRepository.save(event);
        log.info("Event created: {}", event.getPostId());
    }

    @Override
    @Cacheable(value = "events", key = "'today'")
    @Transactional(readOnly = true)
    public List<EventPostDto> getTodayEvents() {
        return eventPostRepository.findPublishedByDate(LocalDate.now())
                .stream().map(this::toDto).toList();
    }

    @Override
    @Cacheable(value = "events", key = "'tomorrow'")
    @Transactional(readOnly = true)
    public List<EventPostDto> getTomorrowEvents() {
        return eventPostRepository.findPublishedByDate(LocalDate.now().plusDays(1))
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventPostDto> searchEvents(String q, String category, LocalDate dateFrom, LocalDate dateTo, Integer limit, Integer page) {
        return eventPostRepository.searchEvents(q, category, dateFrom, dateTo,
                PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "eventDate")))
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventPostDto> getScheduledEvents() {
        return eventPostRepository.findScheduledEvents().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventPostDto> getDraftEvents() {
        return eventPostRepository.findDraftEvents().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EventPostDto previewEvent(PostCreateRequestDto request) {
        return EventPostDto.builder()
                .title(request.getTitle())
                .summary(request.getSummary())
                .description(request.getDescription())
                .eventStartTime(request.getEventStartTime())
                .eventEndTime(request.getEventEndTime())
                .status(EventStatus.BEFORE_PUBLISH)
                .build();
    }

    @Override
    @Cacheable(value = "events", key = "#eventId")
    @Transactional(readOnly = true)
    public EventPostDto getEvent(String eventId) {
        EventPost event = findOrThrow(eventId);
        // 閲覧履歴を記録（非同期的に後で集計される）
        String userId = SecurityUtils.getCurrentUserSub().orElse(null);
        EventPreview preview = EventPreview.builder()
                .previewId(IdGenerator.generateUlid())
                .postId(eventId)
                .userId(userId)
                .actionType("view")
                .build();
        eventPreviewRepository.save(preview);
        return toDto(event);
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void updateEvent(String eventId, PostCreateRequestDto request) {
        EventPost event = findOrThrow(eventId);
        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getSummary() != null) event.setSummary(request.getSummary());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getCategoryId() != null) event.setCategoryId(request.getCategoryId());
        eventPostRepository.save(event);
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void publishEvent(String eventId) {
        EventPost event = findOrThrow(eventId);
        Company company = getOwnerCompany(event);

        // 既に公開済みチェック
        if (EventStatus.PUBLISHED.getCode().equals(event.getStatus())) {
            throw new BadRequestException(MessageEnum.BUSINESS_ERROR)
                    .context("eventId", eventId, "既に公開されています");
        }

        // チケット残高確認 & 消費
        CompanyTicket ticket = ticketRepository.findByCompanyId(company.getCompanyId())
                .orElseThrow(() -> new BadRequestException(MessageEnum.BUSINESS_ERROR)
                        .context("companyId", company.getCompanyId(), "チケット残高が不足しています"));
        if (ticket.getRemainingTickets() <= 0) {
            throw new BadRequestException(MessageEnum.BUSINESS_ERROR)
                    .context("remaining", String.valueOf(ticket.getRemainingTickets()), "チケット残高が不足しています");
        }

        // チケット消費
        ticket.setUsedTickets(ticket.getUsedTickets() + 1);
        ticket.setRemainingTickets(ticket.getRemainingTickets() - 1);
        ticketRepository.save(ticket);

        // チケット消費履歴記録
        TicketHistory history = TicketHistory.builder()
                .historyId(IdGenerator.generateUlid())
                .ticketId(ticket.getTicketId())
                .companyId(company.getCompanyId())
                .postId(eventId)
                .action("publish")
                .amount(1)
                .build();
        ticketHistoryRepository.save(history);

        // 公開
        event.setStatus(EventStatus.PUBLISHED.getCode());
        event.setPublishedAt(LocalDateTime.now());
        eventPostRepository.save(event);

        auditLogHelper.log(company.getCompanyId(), "company", "EVENT_PUBLISH",
                "E", eventId, "イベント公開: " + event.getTitle());
        log.info("Event published: eventId={}, company={}", eventId, company.getCompanyId());
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void hideEvent(String eventId) {
        EventPost event = findOrThrow(eventId);
        event.setStatus(EventStatus.BEFORE_PUBLISH.getCode());
        eventPostRepository.save(event);
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void deleteSchedule(String eventId) {
        EventPost event = findOrThrow(eventId);
        event.setScheduledAt(null);
        eventPostRepository.save(event);
    }

    @Override
    public void uploadMedia(String eventId, EventMediaUploadRequest request) {
        findOrThrow(eventId);

        // 枚数制限チェック（最大3枚）
        List<EventMedia> existing = eventMediaRepository.findByPostIdOrderBySortOrder(eventId);
        if (existing.size() >= MAX_MEDIA_PER_EVENT) {
            throw new BadRequestException(MessageEnum.VALIDATION_ERROR)
                    .context("eventId", eventId, "画像は最大" + MAX_MEDIA_PER_EVENT + "枚までです");
        }

        // ファイルサイズチェック（最大3MB）
        if (request.getFile() != null && request.getFile().getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException(MessageEnum.UPLOAD_SIZE_EXCEEDED)
                    .context("fileSize", String.valueOf(request.getFile().getSize()), "3MBを超えています");
        }

        // Content-Typeチェック (jpeg/png)
        if (request.getFile() != null) {
            String contentType = request.getFile().getContentType();
            if (contentType != null && !contentType.equals("image/jpeg") && !contentType.equals("image/png")) {
                throw new BadRequestException(MessageEnum.VALIDATION_ERROR)
                        .context("contentType", contentType, "jpeg/pngのみ対応");
            }
        }

        // TODO: S3アップロード (key: events/{eventId}/{UUID}.jpg)
        String mediaId = IdGenerator.generateUlid();
        String s3Key = "events/" + eventId + "/" + mediaId;

        EventMedia media = EventMedia.builder()
                .mediaId(mediaId)
                .postId(eventId)
                .fileUrl("https://cdn.eventpick.io/" + s3Key)
                .fileName(request.getFile() != null ? request.getFile().getOriginalFilename() : "unknown")
                .contentType(request.getFile() != null ? request.getFile().getContentType() : null)
                .fileSize(request.getFile() != null ? request.getFile().getSize() : 0)
                .sortOrder(existing.size() + 1)
                .build();
        eventMediaRepository.save(media);
        log.info("Media uploaded: eventId={}, mediaId={}", eventId, mediaId);
    }

    @Override
    public void deleteMedia(String eventId, String mediaId) {
        eventMediaRepository.deleteByPostIdAndMediaId(eventId, mediaId);
        // TODO: S3上のファイルも削除
        log.info("Media deleted: eventId={}, mediaId={}", eventId, mediaId);
    }

    @Override
    @CacheEvict(value = "events", allEntries = true)
    public void deleteEvent(String eventId) {
        EventPost event = findOrThrow(eventId);
        event.setIsDeleted(true);
        eventPostRepository.save(event);
        auditLogHelper.log(event.getCompanyAccountId(), "company", "EVENT_DELETE",
                "E", eventId, "イベント論理削除: " + event.getTitle());
        log.info("Event soft deleted: {}", eventId);
    }

    private Company getOwnerCompany(EventPost event) {
        // companyAccountIdから企業を特定
        return companyRepository.findByCompanyIdAndIsDeletedFalse(event.getCompanyAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "companyId", event.getCompanyAccountId()));
    }

    private EventPost findOrThrow(String eventId) {
        return eventPostRepository.findByPostIdAndIsDeletedFalse(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("EventPost", "postId", eventId));
    }

    private EventPostDto toDto(EventPost entity) {
        return EventPostDto.builder()
                .postId(entity.getPostId())
                .templateId(entity.getTemplateId())
                .companyAccountId(entity.getCompanyAccountId())
                .title(entity.getTitle())
                .summary(entity.getSummary())
                .description(entity.getDescription())
                .reservationUrl(entity.getReservationUrl())
                .address(entity.getAddress())
                .eventDate(entity.getEventDate())
                .eventStartTime(entity.getEventStartTime() != null ? entity.getEventStartTime().toString() : null)
                .eventEndTime(entity.getEventEndTime() != null ? entity.getEventEndTime().toString() : null)
                .categoryId(entity.getCategoryId())
                .status(EventStatus.fromCode(entity.getStatus()))
                .likeCount(entity.getLikeCount())
                .build();
    }
}
