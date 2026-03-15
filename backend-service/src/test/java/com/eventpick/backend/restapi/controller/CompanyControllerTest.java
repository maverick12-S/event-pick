package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.CompanyService;
import com.eventpick.backend.restapi.dto.CompanyDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * CompanyControllerテスト。
 */
@WebMvcTest(CompanyController.class)
class CompanyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CompanyService companyService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/companies - 企業一覧取得正常系")
    @WithMockUser
    void getCompanies_success() throws Exception {
        CompanyDto dto = CompanyDto.builder()
                .companyId("C001")
                .companyName("テスト企業")
                .build();

        when(companyService.getCompanies(anyInt(), anyInt())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/companies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].company_id").value("C001"))
                .andExpect(jsonPath("$.data[0].company_name").value("テスト企業"));
    }

    @Test
    @DisplayName("GET /api/v1/companies/{companyId} - 企業詳細取得正常系")
    @WithMockUser
    void getCompany_success() throws Exception {
        CompanyDto dto = CompanyDto.builder()
                .companyId("C002")
                .companyName("詳細企業")
                .displayName("詳細")
                .build();

        when(companyService.getCompany("C002")).thenReturn(dto);

        mockMvc.perform(get("/api/v1/companies/C002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.company_id").value("C002"))
                .andExpect(jsonPath("$.data.display_name").value("詳細"));
    }
}
