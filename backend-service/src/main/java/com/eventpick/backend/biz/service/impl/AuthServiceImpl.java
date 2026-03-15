package com.eventpick.backend.biz.service.impl;

import com.eventpick.backend.biz.exception.BadRequestException;
import com.eventpick.backend.biz.exception.BusinessException;
import com.eventpick.backend.biz.exception.ConflictException;
import com.eventpick.backend.biz.exception.MessageEnum;
import com.eventpick.backend.biz.service.AuthService;
import com.eventpick.backend.biz.util.AuditLogHelper;
import com.eventpick.backend.biz.util.IdGenerator;
import com.eventpick.backend.biz.util.SecurityUtils;
import com.eventpick.backend.domain.entity.AuthCredential;
import com.eventpick.backend.domain.entity.Company;
import com.eventpick.backend.domain.entity.Session;
import com.eventpick.backend.domain.entity.UserAccount;
import com.eventpick.backend.domain.repository.*;
import com.eventpick.backend.restapi.dto.LoginRequestDto;
import com.eventpick.backend.restapi.dto.LoginResponseDto;
import com.eventpick.backend.restapi.dto.SignupRequestDto;
import com.eventpick.backend.restapi.dto.request.AuthMfaVerifyPostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordChangePostRequest;
import com.eventpick.backend.restapi.dto.request.AuthPasswordResetPostRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 認証サービス実装。
 * Cognito連携による認証処理を担当する。
 * 実際のCognito API呼び出しは外部連携Componentに委譲する想定。
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userAccountRepository;
    private final CompanyRepository companyRepository;
    private final AuthCredentialRepository authCredentialRepository;
    private final SessionRepository sessionRepository;
    private final AuditLogHelper auditLogHelper;

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        log.info("Login attempt: realm={}, user={}", request.getRealm(), request.getUsername());

        // TODO: Cognito InitiateAuth API呼び出し → token取得
        // 現時点ではスタブ応答。本番ではCognitoから返却されるJWTを使用する。
        String stubSub = "stub-cognito-sub";
        String stubAccessToken = "stub-access-token";
        String stubRefreshToken = "stub-refresh-token";

        // セッション記録
        Session session = Session.builder()
                .sessionId(IdGenerator.generateUlid())
                .userType(request.getRealm())
                .authSub(stubSub)
                .loginAt(LocalDateTime.now())
                .build();

        // realm別にユーザーを紐付け
        if ("consumer".equals(request.getRealm())) {
            userAccountRepository.findByUserEmailAndIsDeletedFalse(request.getUsername())
                    .ifPresent(u -> {
                        session.setConsumerId(u.getUserId());
                        u.setLastLoginAt(LocalDateTime.now());
                        userAccountRepository.save(u);
                    });
        } else {
            companyRepository.findByCognitoSubAndIsDeletedFalse(stubSub)
                    .ifPresent(c -> session.setCompanyId(c.getCompanyId()));
        }

        sessionRepository.save(session);
        auditLogHelper.log(stubSub, request.getRealm(), "LOGIN", null, null,
                "Login: " + request.getUsername());

        return LoginResponseDto.builder()
                .accessToken(stubAccessToken)
                .refreshToken(stubRefreshToken)
                .tokenType("Bearer")
                .expiresIn(3600)
                .build();
    }

    @Override
    public void logout() {
        String sub = SecurityUtils.getCurrentUserSub()
                .orElseThrow(() -> new BusinessException("E1001", "認証情報がありません"));

        // セッション終了
        sessionRepository.logoutByAuthSub(sub);

        // TODO: Cognito GlobalSignOut呼び出し
        auditLogHelper.log(sub, "user", "LOGOUT", null, null, null);
        log.info("Logout completed: sub={}", sub);
    }

    @Override
    public LoginResponseDto refresh() {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        log.info("Token refresh: sub={}", sub);
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
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        sessionRepository.logoutByAuthSub(sub);
        // TODO: Cognitoトークン無効化 (RevokeToken)
        log.info("Token revoked: sub={}", sub);
    }

    @Override
    public void signup(SignupRequestDto request) {
        log.info("Signup attempt: email={}", request.getAdminEmail());

        // メール重複チェック
        if (companyRepository.findByIsDeletedFalse(
                org.springframework.data.domain.PageRequest.of(0, 1))
                .getContent().stream()
                .anyMatch(c -> request.getAdminEmail().equals(c.getAdminEmail()))) {
            throw new ConflictException("既に登録済みのメールアドレスです")
                    .context("email", request.getAdminEmail(), "既に登録済み");
        }

        // TODO: Cognito SignUp API呼び出し
        String stubSub = IdGenerator.generateUlid();

        // 企業作成
        Company company = Company.builder()
                .companyId(IdGenerator.generateUlid())
                .companyCode(request.getCompanyCode())
                .companyName(request.getCompanyName())
                .displayName(request.getCompanyName())
                .companyType(request.getCompanyType())
                .representativeName(request.getRepresentativeName())
                .adminEmail(request.getAdminEmail())
                .adminPhone(request.getAdminPhone())
                .accountStatus("1")
                .reviewStatus("0") // 未審査
                .cognitoSub(stubSub)
                .isDeleted(false)
                .build();
        companyRepository.save(company);

        // 認証情報作成
        AuthCredential authCredential = AuthCredential.builder()
                .authId(IdGenerator.generateUlid())
                .companyId(company.getCompanyId())
                .authSub(stubSub)
                .authProvider("cognito")
                .isEnabled(false) // MFA確認後に有効化
                .mfaEnabled(false)
                .build();
        authCredentialRepository.save(authCredential);

        // TODO: SES経由でMFA確認コードメール送信
        auditLogHelper.log(stubSub, "company", "SIGNUP", "C", company.getCompanyId(),
                "企業登録: " + company.getCompanyName());
        log.info("Signup completed: companyId={}", company.getCompanyId());
    }

    @Override
    public void mfaVerify(AuthMfaVerifyPostRequest request) {
        log.info("MFA verify: code={}", request.getCode());

        // TODO: Cognito ConfirmSignUp呼び出し

        // 認証情報を有効化
        // 本番ではCognitoのsubから認証情報を特定する
        auditLogHelper.log(null, "system", "MFA_VERIFY", null, null,
                "MFA verified: " + request.getCode());
    }

    @Override
    public void passwordReset(AuthPasswordResetPostRequest request) {
        log.info("Password reset requested for: {}", request.getEmail());
        // TODO: Cognito ForgotPassword API呼び出し
        // コード送信はCognitoが処理する
    }

    @Override
    public void passwordChange(AuthPasswordChangePostRequest request) {
        String sub = SecurityUtils.getCurrentUserSub().orElseThrow();
        log.info("Password change: sub={}", sub);
        // TODO: Cognito ChangePassword API呼び出し
        auditLogHelper.log(sub, "user", "PASSWORD_CHANGE", null, null, null);
    }

}
