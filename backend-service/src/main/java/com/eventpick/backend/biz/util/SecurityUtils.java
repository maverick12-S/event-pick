package com.eventpick.backend.biz.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

/**
 * セキュリティユーティリティ。
 * JWTトークンからの情報取得を行う。
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    /**
     * 現在認証済みユーザーのCognito SUBを取得する。
     */
    public static Optional<String> getCurrentUserSub() {
        return getJwt().map(jwt -> jwt.getClaimAsString("sub"));
    }

    /**
     * 現在認証済みユーザーのメールアドレスを取得する。
     */
    public static Optional<String> getCurrentUserEmail() {
        return getJwt().map(jwt -> jwt.getClaimAsString("email"));
    }

    /**
     * JWTトークンを取得する。
     */
    public static Optional<Jwt> getJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return Optional.of(jwt);
        }
        return Optional.empty();
    }
}
