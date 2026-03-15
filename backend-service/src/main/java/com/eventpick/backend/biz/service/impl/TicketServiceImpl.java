package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.TicketService;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.CompanyTicket;
import com.eventpick.backend.domain.repository.CompanyRepository;
import com.eventpick.backend.domain.repository.CompanyTicketRepository;
import com.eventpick.backend.restapi.dto.CompanyTicketDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketServiceImpl implements TicketService {

    private final CompanyTicketRepository ticketRepository;
    private final CompanyRepository companyRepository;

    @Override
    public CompanyTicketDto getTickets() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        Company company = companyRepository.findByCognitoSubAndIsDeletedFalse(sub).orElseThrow();
        CompanyTicket ticket = ticketRepository.findByCompanyId(company.getCompanyId())
                .orElse(CompanyTicket.builder().totalTickets(0).usedTickets(0).remainingTickets(0).build());
        return CompanyTicketDto.builder()
                .ticketId(ticket.getTicketId())
                .companyId(company.getCompanyId())
                .dailyGranted(ticket.getTotalTickets())
                .dailyUsed(ticket.getUsedTickets())
                .dailyRemaining(ticket.getRemainingTickets())
                .build();
    }
}
