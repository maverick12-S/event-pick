package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

    Optional<Session> findByAuthSubAndLogoutAtIsNull(String authSub);

    @Modifying
    @Query("UPDATE Session s SET s.logoutAt = CURRENT_TIMESTAMP WHERE s.authSub = :authSub AND s.logoutAt IS NULL")
    void logoutByAuthSub(@Param("authSub") String authSub);
}
