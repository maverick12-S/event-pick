package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.EventMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventMediaRepository extends JpaRepository<EventMedia, String> {

    List<EventMedia> findByPostIdOrderBySortOrder(String postId);

    void deleteByPostIdAndMediaId(String postId, String mediaId);
}
