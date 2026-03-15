package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {

    Optional<Subscription> findByCompanyIdAndStatusIn(String companyId, java.util.Collection<String> statuses);

    Optional<Subscription> findByStripeSubscriptionId(String stripeSubscriptionId);

    Optional<Subscription> findByCompanyId(String companyId);

    java.util.List<Subscription> findByStatusAndAutoRenewTrue(String status);

    Optional<Subscription> findByCompanyIdAndStatus(String companyId, String status);
}
