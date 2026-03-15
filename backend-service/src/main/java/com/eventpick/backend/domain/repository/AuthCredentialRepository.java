package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.AuthCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthCredentialRepository extends JpaRepository<AuthCredential, String> {

    Optional<AuthCredential> findByAuthSub(String authSub);

    Optional<AuthCredential> findByUserIdAndIsEnabledTrue(String userId);

    Optional<AuthCredential> findByCompanyIdAndIsEnabledTrue(String companyId);
}
