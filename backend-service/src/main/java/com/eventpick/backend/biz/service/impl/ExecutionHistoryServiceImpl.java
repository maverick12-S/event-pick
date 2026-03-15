package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.service.ExecutionHistoryService;
import com.eventpick.backend.domain.entity.ExecutionHistory;
import com.eventpick.backend.domain.repository.ExecutionHistoryRepository;
import com.eventpick.backend.restapi.dto.ExecutionHistoryItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExecutionHistoryServiceImpl implements ExecutionHistoryService {

    private final ExecutionHistoryRepository repository;

    @Override
    public List<ExecutionHistoryItemDto> getExecutionHistory(Integer limit, Integer page) {
        return repository.findAllByOrderByExecutedAtDesc(PageRequest.of(page - 1, limit))
                .stream().map(this::toDto).toList();
    }

    private ExecutionHistoryItemDto toDto(ExecutionHistory e) {
        return ExecutionHistoryItemDto.builder()
                .historyId(e.getExecutionId())
                .executionType(e.getExecutionType())
                .resultStatus(e.getResultStatus())
                .errorMessage(e.getMessage())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
