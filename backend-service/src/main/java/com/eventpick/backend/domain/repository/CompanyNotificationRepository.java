package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.CompanyNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyNotificationRepository extends JpaRepository<CompanyNotification, String> {

    List<CompanyNotification> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    @Modifying
    @Query("UPDATE CompanyNotification n SET n.isRead = true WHERE n.companyId = :companyId AND n.isRead = false")
    void markAllAsRead(@Param("companyId") String companyId);
}
