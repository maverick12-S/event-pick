package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.ExecutionHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutionHistoryRepository extends JpaRepository<ExecutionHistory, String> {

    Page<ExecutionHistory> findByCompanyIdOrderByExecutedAtDesc(String companyId, Pageable pageable);

    Page<ExecutionHistory> findAllByOrderByExecutedAtDesc(Pageable pageable);
}
