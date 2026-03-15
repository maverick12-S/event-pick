package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.CompanyTicketDto;

/**
 * チケットサービスインタフェース。
 */
public interface TicketService {
    CompanyTicketDto getTickets();
}
