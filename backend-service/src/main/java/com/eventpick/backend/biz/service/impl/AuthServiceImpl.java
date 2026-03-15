package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BusinessException;
import com.eventpick.backend.biz.service.AuthService;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.eventpick.backend.restapi.dto.SignupRequestDto;
import com.eventpick.backend.restapi.dto.request.AuthMfaVerifyPostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordChangePostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordResetPostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 認証サービス実装。
 * Cognito連携による認証処理を担当する。
 * 実際のCognito API呼び出しは外部連携Componentに委譲する想定。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        log.info("Login attempt: {}", request.getUsername());
        // TODO: Cognito認証API呼び出し → token取得
        // 現時点ではスタブ応答
        return LoginResponseDto.builder()
                .accessToken("stub-access-token")
                .refreshToken("stub-refresh-token")
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();
    }

    @Override
    public void logout() {
        String sub = SecurityUtils.getCurrentUserSub()
                .orElseThrow(() -> new BusinessException("E1001", "認証情報がありません"));
        log.info("Logout: sub={}", sub);
        // TODO: Cognito globalSignOut呼び出し
    }

    @Override
    public LoginResponseDto refresh() {
        // TODO: Cognitoリフレッシュトークンでトークン更新
        return LoginResponseDto.builder()
                .accessToken("stub-refreshed-access-token")
                .refreshToken("stub-refresh-token")
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();
    }

    @Override
    public void revoke() {
        log.info("Token revoke requested");
        // TODO: Cognitoトークン無効化
    }

    @Override
    public void signup(SignupRequestDto request) {
        log.info("Signup attempt: {}", request.getAdminEmail());
        // TODO: Cognito signUp API呼び出し + DB UserAccount作成
    }

    @Override
    public void mfaVerify(AuthMfaVerifyPostRequest request) {
        log.info("MFA verify requested");
        // TODO: Cognito MFA検証
    }

    @Override
    public void passwordReset(AuthPasswordResetPostRequest request) {
        log.info("Password reset requested for: {}", request.getEmail());
        // TODO: Cognito forgotPassword API呼び出し
    }

    @Override
    public void passwordChange(AuthPasswordChangePostRequest request) {
        log.info("Password change requested");
        // TODO: Cognito changePassword API呼び出し
    }
}
