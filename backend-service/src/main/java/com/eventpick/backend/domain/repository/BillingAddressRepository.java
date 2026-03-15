package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.BillingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingAddressRepository extends JpaRepository<BillingAddress, String> {

    Optional<BillingAddress> findByCompanyId(String companyId);
}
