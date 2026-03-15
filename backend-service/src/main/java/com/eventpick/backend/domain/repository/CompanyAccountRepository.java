package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.CompanyAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyAccountRepository extends JpaRepository<CompanyAccount, String> {

    Optional<CompanyAccount> findByAccountIdAndIsDeletedFalse(String accountId);

    Optional<CompanyAccount> findByCognitoSubAndIsDeletedFalse(String cognitoSub);

    Page<CompanyAccount> findByCompanyIdAndIsDeletedFalse(String companyId, Pageable pageable);

    Page<CompanyAccount> findByIsDeletedFalse(Pageable pageable);
}
