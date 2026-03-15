package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.biz.service.EventService;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.EventMedia;
import com.eventpick.backend.domain.entity.EventPost;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.EventMediaRepository;
import com.eventpick.backend.domain.repository.EventPostRepository;
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

    private final EventPostRepository eventPostRepository;
    private final EventMediaRepository eventMediaRepository;
    private final CompanyRepository companyRepository;

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
        return toDto(findOrThrow(eventId));
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
        event.setStatus(EventStatus.PUBLISHED.getCode());
        event.setPublishedAt(LocalDateTime.now());
        eventPostRepository.save(event);
        log.info("Event published: {}", eventId);
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
        EventMedia media = EventMedia.builder()
                .mediaId(IdGenerator.generateUlid())
                .postId(eventId)
                .fileUrl("pending-upload")
                .fileName(request.getFile() != null ? request.getFile().getOriginalFilename() : "unknown")
                .contentType(request.getFile() != null ? request.getFile().getContentType() : null)
                .fileSize(request.getFile() != null ? request.getFile().getSize() : 0)
                .build();
        eventMediaRepository.save(media);
        log.info("Media uploaded for event: {}, mediaId: {}", eventId, media.getMediaId());
    }

    @Override
    public void deleteMedia(String eventId, String mediaId) {
        eventMediaRepository.deleteByPostIdAndMediaId(eventId, mediaId);
        log.info("Media deleted: eventId={}, mediaId={}", eventId, mediaId);
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
