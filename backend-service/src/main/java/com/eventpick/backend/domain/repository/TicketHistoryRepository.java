package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.TicketHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoryRepository extends JpaRepository<TicketHistory, String> {

    List<TicketHistory> findByCompanyIdOrderByCreatedAtDesc(String companyId);
}
