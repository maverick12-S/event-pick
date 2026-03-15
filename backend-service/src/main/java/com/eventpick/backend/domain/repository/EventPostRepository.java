package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.EventPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventPostRepository extends JpaRepository<EventPost, String>, JpaSpecificationExecutor<EventPost> {

    Optional<EventPost> findByPostIdAndIsDeletedFalse(String postId);

    Page<EventPost> findByIsDeletedFalseAndStatus(String status, Pageable pageable);

    Page<EventPost> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT e FROM EventPost e WHERE e.isDeleted = false AND e.status = '2' AND e.eventDate = :date")
    List<EventPost> findPublishedByDate(@Param("date") LocalDate date);

    @Query("SELECT e FROM EventPost e WHERE e.isDeleted = false AND e.status = '1' AND e.scheduledAt IS NOT NULL")
    List<EventPost> findScheduledEvents();

    @Query("SELECT e FROM EventPost e WHERE e.isDeleted = false AND e.status = '1' AND e.scheduledAt IS NULL")
    List<EventPost> findDraftEvents();

    @Query("SELECT e FROM EventPost e WHERE e.isDeleted = false AND e.status = '2' " +
           "AND (:q IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:category IS NULL OR e.categoryId = :category) " +
           "AND (:dateFrom IS NULL OR e.eventDate >= :dateFrom) " +
           "AND (:dateTo IS NULL OR e.eventDate <= :dateTo)")
    Page<EventPost> searchEvents(
            @Param("q") String q,
            @Param("category") String category,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable);

    List<EventPost> findByCompanyAccountIdAndIsDeletedFalse(String companyAccountId);
}
