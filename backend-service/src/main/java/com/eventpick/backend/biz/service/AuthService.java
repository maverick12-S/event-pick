package com.eventpick.backend.biz.service;

import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.eventpick.backend.restapi.dto.SignupRequestDto;
import com.eventpick.backend.restapi.dto.request.AuthMfaVerifyPostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordChangePostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordResetPostRequest;

/**
 * 認証サービスインタフェース。
 */
public interface AuthService {
    LoginResponseDto login(LoginRequestDto request);
    void logout();
    LoginResponseDto refresh();
    void revoke();
    void signup(SignupRequestDto request);
    void mfaVerify(AuthMfaVerifyPostRequest request);
    void passwordReset(AuthPasswordResetPostRequest request);
    void passwordChange(AuthPasswordChangePostRequest request);
}
