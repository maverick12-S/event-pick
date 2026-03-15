package com.eventpick.backend.domain.repository;

import com.eventpick.backend.domain.entity.Prefecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrefectureRepository extends JpaRepository<Prefecture, String> {

    List<Prefecture> findAllByOrderBySortOrder();
}
