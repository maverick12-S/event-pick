package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {

    Optional<Company> findByCompanyIdAndIsDeletedFalse(String companyId);

    Optional<Company> findByCognitoSubAndIsDeletedFalse(String cognitoSub);

    Page<Company> findByIsDeletedFalse(Pageable pageable);

    @Query("SELECT c FROM Company c WHERE c.isDeleted = false AND c.reviewStatus = '1'")
    List<Company> findDraftCompanies();

    List<Company> findByParentCompanyIdAndIsDeletedFalse(String parentCompanyId);

    Page<Company> findByAccountStatusAndIsDeletedFalse(String accountStatus, Pageable pageable);
}
