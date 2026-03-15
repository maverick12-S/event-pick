package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.EventLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventLocationRepository extends JpaRepository<EventLocation, String> {

    Optional<EventLocation> findByLocationName(String locationName);
}
