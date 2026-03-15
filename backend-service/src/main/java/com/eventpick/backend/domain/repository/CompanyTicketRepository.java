package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.CompanyTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyTicketRepository extends JpaRepository<CompanyTicket, String> {

    Optional<CompanyTicket> findByCompanyId(String companyId);
}
