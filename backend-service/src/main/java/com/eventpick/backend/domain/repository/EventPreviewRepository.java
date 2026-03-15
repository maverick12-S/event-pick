package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.EventPreview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventPreviewRepository extends JpaRepository<EventPreview, String> {

    long countByPostIdAndActionType(String postId, String actionType);

    @Query("SELECT COUNT(e) FROM EventPreview e WHERE e.postId = :postId AND e.actionType = 'view'")
    long countViewsByPostId(@Param("postId") String postId);

    @Query("SELECT COUNT(e) FROM EventPreview e WHERE e.postId = :postId AND e.actionType = 'like'")
    long countLikesByPostId(@Param("postId") String postId);

    @Query("SELECT COUNT(e) FROM EventPreview e WHERE e.postId = :postId AND e.actionType = 'favorite'")
    long countFavoritesByPostId(@Param("postId") String postId);
}
