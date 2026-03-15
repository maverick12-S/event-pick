package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AuthService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.eventpick.backend.restapi.dto.SignupRequestDto;
import com.eventpick.backend.restapi.dto.request.AuthMfaVerifyPostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordChangePostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordResetPostRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 認証コントローラー。
 * 8エンドポイント: login, logout, refresh, revoke, signup, mfa/verify, password-reset, password-change
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    /** POST /api/v1/auth/login - ログイン (認証不要) */
    @PostMapping("/login")
    public CommonResponse<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto request) {
        LoginResponseDto result = authService.login(request);
        return CommonResponse.ok(result);
    }

    /** POST /api/v1/auth/logout - ログアウト */
    @PostMapping("/logout")
    public CommonResponse<Void> logout() {
        authService.logout();
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/refresh - アクセストークン更新 */
    @PostMapping("/refresh")
    public CommonResponse<LoginResponseDto> refresh() {
        LoginResponseDto result = authService.refresh();
        return CommonResponse.ok(result);
    }

    /** POST /api/v1/auth/revoke - トークン無効化 */
    @PostMapping("/revoke")
    public CommonResponse<Void> revoke() {
        authService.revoke();
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/signup - 新規登録 (認証不要) */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> signup(@RequestBody @Valid SignupRequestDto request) {
        authService.signup(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/mfa/verify - MFA検証 */
    @PostMapping("/mfa/verify")
    public CommonResponse<Void> mfaVerify(@RequestBody @Valid AuthMfaVerifyPostRequest request) {
        authService.mfaVerify(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/password-reset - パスワードリセット要求 (認証不要) */
    @PostMapping("/password-reset")
    public CommonResponse<Void> passwordReset(@RequestBody @Valid AuthPasswordResetPostRequest request) {
        authService.passwordReset(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/password-change - パスワード変更 */
    @PostMapping("/password-change")
    public CommonResponse<Void> passwordChange(@RequestBody @Valid AuthPasswordChangePostRequest request) {
        authService.passwordChange(request);
        return CommonResponse.ok();
    }
}
