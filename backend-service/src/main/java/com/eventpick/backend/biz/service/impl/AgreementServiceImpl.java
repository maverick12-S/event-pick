package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.AgreementService;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.AgreementLog;
import com.eventpick.backend.domain.repository.AgreementLogRepository;
import com.eventpick.backend.restapi.dto.request.AgreementLogPostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AgreementServiceImpl implements AgreementService {

    private final AgreementLogRepository agreementLogRepository;

    @Override
    public void recordAgreement(AgreementLogPostRequest request) {
        String userId = SecurityUtils.getCurrentUserSub().orElse(null);
        AgreementLog agreement = AgreementLog.builder()
                .agreementId(IdGenerator.generateUlid())
                .userId(userId)
                .agreementType(request.getAgreementType())
                .agreedAt(LocalDateTime.now())
                .build();
        agreementLogRepository.save(agreement);
        log.info("Agreement recorded: type={}", request.getAgreementType());
    }
}
