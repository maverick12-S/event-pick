package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, String> {

    List<Inquiry> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    Page<Inquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
