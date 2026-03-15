package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.TicketService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.CompanyTicketDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public CommonResponse<CompanyTicketDto> getTickets() {
        return CommonResponse.ok(ticketService.getTickets());
    }
}
