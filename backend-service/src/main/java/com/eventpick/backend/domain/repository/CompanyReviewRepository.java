package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.CompanyReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, String> {

    List<CompanyReview> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    Page<CompanyReview> findByReviewStatus(String reviewStatus, Pageable pageable);
}
