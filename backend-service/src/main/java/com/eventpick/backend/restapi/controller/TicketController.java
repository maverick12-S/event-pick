package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.TicketService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.CompanyTicketDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Tag(name = "チケット (Ticket)", description = "チケット情報取得")
public class TicketController {

    private final TicketService ticketService;

    @Operation(summary = "チケット情報取得", description = "現在のチケット情報を取得する。")
    @GetMapping
    public CommonResponse<CompanyTicketDto> getTickets() {
        return CommonResponse.ok(ticketService.getTickets());
    }
}
