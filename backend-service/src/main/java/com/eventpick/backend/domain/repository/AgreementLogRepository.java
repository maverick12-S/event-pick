package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.AgreementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementLogRepository extends JpaRepository<AgreementLog, String> {

    List<AgreementLog> findByUserIdOrderByAgreedAtDesc(String userId);

    List<AgreementLog> findByCompanyIdOrderByAgreedAtDesc(String companyId);
}
