package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.CompanyBilling;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyBillingRepository extends JpaRepository<CompanyBilling, String> {

    List<CompanyBilling> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    Page<CompanyBilling> findByCompanyId(String companyId, Pageable pageable);
}
