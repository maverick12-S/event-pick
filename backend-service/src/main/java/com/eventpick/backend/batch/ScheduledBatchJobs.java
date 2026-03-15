package com.eventpick.backend.batch;

import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.domain.entity.*;
import com.eventpick.backend.domain.repository.*;
import com.eventpick.backend.restapi.dto.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * スケジュールバッチジョブ。
 * 設計書 SC0001/SC0003/SC0005/SC0006/SC0007/SC0010/SC0012 に対応する7つの定期実行タスク。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledBatchJobs {

    private final CompanyTicketRepository ticketRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final EventPostRepository eventPostRepository;
    private final EventPreviewRepository eventPreviewRepository;
    private final CompanyNotificationRepository notificationRepository;
    private final ExecutionHistoryRepository executionHistoryRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final CacheManager cacheManager;
    private final AuditLogHelper auditLogHelper;

    /**
     * SC0001: 日次チケット有効期限リセット (毎日 00:00)
     * 前日分の未使用チケットを失効させ、残高を0にリセットする。
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void dailyTicketExpiry() {
        log.info("[SC0001] Daily ticket expiry job started");
        LocalDate yesterday = LocalDate.now().minusDays(1);
        int count = 0;

        List<CompanyTicket> expiredTickets = ticketRepository.findByTicketDate(yesterday);
        for (CompanyTicket ticket : expiredTickets) {
            if (ticket.getRemainingTickets() > 0) {
                // 失効履歴記録
                TicketHistory history = TicketHistory.builder()
                        .historyId(IdGenerator.generateUlid())
                        .ticketId(ticket.getTicketId())
                        .companyId(ticket.getCompanyId())
                        .action("expire")
                        .amount(ticket.getRemainingTickets())
                        .build();
                ticketHistoryRepository.save(history);

                ticket.setRemainingTickets(0);
                ticketRepository.save(ticket);
                count++;
            }
        }

        recordExecution("SC0001", count + " tickets expired");
        log.info("[SC0001] Daily ticket expiry completed: {} tickets expired", count);
    }

    /**
     * SC0003: 日次チケット付与 (毎日 00:05)
     * アクティブサブスクリプションの企業に対し、プランに応じた日次チケットを付与する。
     */
    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void dailyTicketGrant() {
        log.info("[SC0003] Daily ticket grant job started");
        LocalDate today = LocalDate.now();
        int count = 0;

        List<Subscription> activeSubscriptions = subscriptionRepository.findByStatusAndAutoRenewTrue("active");
        for (Subscription subscription : activeSubscriptions) {
            Plan plan = planRepository.findById(subscription.getPlanId()).orElse(null);
            if (plan == null) {
                log.warn("[SC0003] Plan not found for subscription: {}", subscription.getSubscriptionId());
                continue;
            }

            int dailyLimit = plan.getDailyTicketLimit();
            CompanyTicket ticket = ticketRepository.findByCompanyId(subscription.getCompanyId())
                    .orElse(CompanyTicket.builder()
                            .ticketId(IdGenerator.generateUlid())
                            .companyId(subscription.getCompanyId())
                            .build());

            ticket.setTotalTickets(dailyLimit);
            ticket.setUsedTickets(0);
            ticket.setRemainingTickets(dailyLimit);
            ticket.setTicketDate(today);
            ticketRepository.save(ticket);
            count++;
        }

        recordExecution("SC0003", count + " companies granted tickets");
        log.info("[SC0003] Daily ticket grant completed: {} companies", count);
    }

    /**
     * SC0005: 予約投稿自動公開 (毎日 00:10)
     * scheduledAtが現在時刻以前のイベントを自動公開する。
     */
    @Scheduled(cron = "0 10 0 * * *")
    @Transactional
    public void autoPublishScheduledEvents() {
        log.info("[SC0005] Auto-publish scheduled events job started");
        LocalDateTime now = LocalDateTime.now();
        int count = 0;

        List<EventPost> events = eventPostRepository.findScheduledEventsToPublish(now);
        for (EventPost event : events) {
            event.setStatus(EventStatus.PUBLISHED.getCode());
            event.setPublishedAt(now);
            eventPostRepository.save(event);
            count++;

            auditLogHelper.log("system", "batch", "AUTO_PUBLISH",
                    "E", event.getPostId(), "バッチ自動公開: " + event.getTitle());
        }

        evictCache("events");
        recordExecution("SC0005", count + " events auto-published");
        log.info("[SC0005] Auto-publish completed: {} events", count);
    }

    /**
     * SC0006: レポート指標リフレッシュ (30分ごと)
     * event_previewsの集計値をevent_postsのview_count/favorite_countに反映し、Redisキャッシュをクリア。
     */
    @Scheduled(cron = "0 */30 * * * *")
    @Transactional
    public void refreshReportMetrics() {
        log.info("[SC0006] Report metrics refresh job started");
        int count = 0;

        List<EventPost> publishedEvents = eventPostRepository
                .findByIsDeletedFalseAndStatus(EventStatus.PUBLISHED.getCode(),
                        org.springframework.data.domain.PageRequest.of(0, 10000))
                .getContent();

        for (EventPost event : publishedEvents) {
            long views = eventPreviewRepository.countViewsByPostId(event.getPostId());
            long favorites = eventPreviewRepository.countFavoritesByPostId(event.getPostId());

            if (event.getViewCount() != (int) views || event.getFavoriteCount() != (int) favorites) {
                event.setViewCount((int) views);
                event.setFavoriteCount((int) favorites);
                eventPostRepository.save(event);
                count++;
            }
        }

        evictCache("events");
        evictCache("reports");
        recordExecution("SC0006", count + " events metrics updated");
        log.info("[SC0006] Report metrics refresh completed: {} events updated", count);
    }

    /**
     * SC0007: 物理削除 (毎日 01:00)
     * 論理削除から90日以上経過したデータを物理削除する。
     */
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void physicalDeleteExpired() {
        log.info("[SC0007] Physical delete job started");
        LocalDateTime cutoff = LocalDateTime.now().minusDays(90);
        int count = 0;

        List<EventPost> deletedEvents = eventPostRepository.findDeletedBefore(cutoff);
        for (EventPost event : deletedEvents) {
            eventPostRepository.delete(event);
            count++;
        }

        recordExecution("SC0007", count + " records physically deleted");
        log.info("[SC0007] Physical delete completed: {} records", count);
    }

    /**
     * SC0010: ステータス整合性チェック — 期限切れイベントのクローズ (毎日 00:15)
     * eventDateが過去のpublished状態イベントを終了状態に変更する。
     */
    @Scheduled(cron = "0 15 0 * * *")
    @Transactional
    public void closeExpiredEvents() {
        log.info("[SC0010] Close expired events job started");
        LocalDate today = LocalDate.now();
        int count = 0;

        List<EventPost> expiredEvents = eventPostRepository.findExpiredPublishedEvents(today);
        for (EventPost event : expiredEvents) {
            event.setStatus("3"); // 3: 終了
            eventPostRepository.save(event);
            count++;
        }

        if (count > 0) {
            evictCache("events");
        }
        recordExecution("SC0010", count + " events closed");
        log.info("[SC0010] Close expired events completed: {} events", count);
    }

    /**
     * SC0012: 通知リトライ (毎日 02:00)
     * 未読の重要通知を再送する（SES送信をリトライ）。
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void retryNotifications() {
        log.info("[SC0012] Notification retry job started");
        // TODO: 未送信のSES通知をリトライ
        // 現状はログ出力のみ。SES統合後に実装。
        recordExecution("SC0012", "Notification retry executed (SES stub)");
        log.info("[SC0012] Notification retry completed");
    }

    // ── ヘルパー ──

    private void evictCache(String cacheName) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }

    private void recordExecution(String jobId, String message) {
        ExecutionHistory history = ExecutionHistory.builder()
                .executionId(IdGenerator.generateUlid())
                .executionType("B") // Batch
                .targetId(jobId)
                .resultStatus("1") // 成功
                .message(message)
                .executedAt(LocalDateTime.now())
                .build();
        executionHistoryRepository.save(history);
    }
}
