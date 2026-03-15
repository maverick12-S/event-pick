package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.InquiryService;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.Inquiry;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.InquiryRepository;
import com.eventpick.backend.restapi.dto.request.InquiryPostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional(readOnly = true)
    public Object getInquiries() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElseThrow();
        return inquiryRepository.findByCompanyIdOrderByCreatedAtDesc(company.getCompanyId());
    }

    @Override
    public void createInquiry(InquiryPostRequest request) {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElseThrow();
        Inquiry inquiry = Inquiry.builder()
                .inquiryId(IdGenerator.generateUlid())
                .companyId(company.getCompanyId())
                .subject(request.getSubject())
                .body(request.getBody())
                .status("open")
                .build();
        inquiryRepository.save(inquiry);
        log.info("Inquiry created: {}", inquiry.getInquiryId());
    }
}
