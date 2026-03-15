package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AuthService;
import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthControllerテスト。
 */
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/login - 正常系")
    @WithMockUser
    void login_success() throws Exception {
        LoginResponseDto response = LoginResponseDto.builder()
                .accessToken("test-token")
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();

        when(authService.login(any(LoginRequestDto.class))).thenReturn(response);

        LoginRequestDto request = LoginRequestDto.builder()
                .realm("default")
                .username("user@test.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.access_token").value("test-token"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/logout - 正常系")
    @WithMockUser
    void logout_success() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
