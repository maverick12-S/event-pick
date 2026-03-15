package com.eventpick.backend.restapi.controller;

import com.eventpick.backend.biz.service.AuthService;
import com.eventpick.backend.restapi.common.CommonResponse;
import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.eventpick.backend.restapi.dto.SignupRequestDto;
import com.eventpick.backend.restapi.dto.request.AuthMfaVerifyPostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordChangePostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordResetPostRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "認証 (Auth)", description = "ログイン, ログアウト, トークン更新, MFA, パスワード管理")
public class AuthController {

    private final AuthService authService;

    /** POST /api/v1/auth/login - ログイン (認証不要) */
    @Operation(summary = "ログイン", description = "メールアドレス/パスワードで認証し、JWTトークンを発行する。Cognito認証。認証不要。")
    @PostMapping("/login")
    public CommonResponse<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto request) {
        LoginResponseDto result = authService.login(request);
        return CommonResponse.ok(result);
    }

    /** POST /api/v1/auth/logout - ログアウト */
    @Operation(summary = "ログアウト", description = "現在のセッションを無効化し、Cognitoトークンを失効させる。")
    @PostMapping("/logout")
    public CommonResponse<Void> logout() {
        authService.logout();
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/refresh - アクセストークン更新 */
    @Operation(summary = "トークン更新", description = "RefreshTokenを使用してAccessTokenを再発行する。")
    @PostMapping("/refresh")
    public CommonResponse<LoginResponseDto> refresh() {
        LoginResponseDto result = authService.refresh();
        return CommonResponse.ok(result);
    }

    /** POST /api/v1/auth/revoke - トークン無効化 */
    @Operation(summary = "トークン無効化", description = "発行済み全トークンを明示的に無効化する。")
    @PostMapping("/revoke")
    public CommonResponse<Void> revoke() {
        authService.revoke();
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/signup - 新規登録 (認証不要) */
    @Operation(summary = "新規登録", description = "新規ユーザーアカウントを作成する。Cognitoユーザープールに登録。認証不要。")
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public CommonResponse<Void> signup(@RequestBody @Valid SignupRequestDto request) {
        authService.signup(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/mfa/verify - MFA検証 */
    @Operation(summary = "MFA検証", description = "多要素認証コードを検証する。TOTP/SMS対応。")
    @PostMapping("/mfa/verify")
    public CommonResponse<Void> mfaVerify(@RequestBody @Valid AuthMfaVerifyPostRequest request) {
        authService.mfaVerify(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/password-reset - パスワードリセット要求 (認証不要) */
    @Operation(summary = "パスワードリセット要求", description = "パスワードリセットメールを送信する。認証不要。")
    @PostMapping("/password-reset")
    public CommonResponse<Void> passwordReset(@RequestBody @Valid AuthPasswordResetPostRequest request) {
        authService.passwordReset(request);
        return CommonResponse.ok();
    }

    /** POST /api/v1/auth/password-change - パスワード変更 */
    @Operation(summary = "パスワード変更", description = "現在のパスワードを検証し、新しいパスワードに変更する。")
    @PostMapping("/password-change")
    public CommonResponse<Void> passwordChange(@RequestBody @Valid AuthPasswordChangePostRequest request) {
        authService.passwordChange(request);
        return CommonResponse.ok();
    }
}
