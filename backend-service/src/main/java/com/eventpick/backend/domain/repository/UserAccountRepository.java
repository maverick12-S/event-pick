package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.UserAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {

    Optional<UserAccount> findByUserIdAndIsDeletedFalse(String userId);

    Optional<UserAccount> findByAuthSubAndIsDeletedFalse(String authSub);

    Optional<UserAccount> findByUserEmailAndIsDeletedFalse(String email);

    Page<UserAccount> findByIsDeletedFalse(Pageable pageable);

    Page<UserAccount> findByIsActiveAndIsDeletedFalse(Boolean isActive, Pageable pageable);
}
