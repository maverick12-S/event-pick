package com.eventpick.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * セキュリティ設定。
 * OAuth2 Resource Server (JWT / AWS Cognito) + 認証不要エンドポイントの定義。
 *
 * Spring SecurityはCognito利用時にも必須。
 * - JWTトークンの署名検証 (issuer-uriからJWKSを自動取得)
 * - cognito:groups クレームからSpring Security権限へのマッピング
 * - エンドポイントレベルの認可制御 (@PreAuthorize)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 認証不要エンドポイント
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/signup").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/password-reset").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/corporations/validate").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/webhooks/stripe").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/master/prefectures").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/master/cities").permitAll()
                // 開発用: フロント疎通テスト（本番前に削除すること）
                .requestMatchers(HttpMethod.GET, "/api/v1/company-accounts").permitAll()
                // Actuator / Swagger
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // その他は認証必須
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(cognitoJwtAuthenticationConverter()))
            );
        return http.build();
    }

    /**
     * Cognito JWT → Spring Security Authority 変換。
     * cognito:groups クレームをROLE_プレフィックス付き権限にマッピング。
     */
    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> cognitoJwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<String> groups = jwt.getClaimAsStringList("cognito:groups");
            if (groups == null || groups.isEmpty()) {
                return Collections.emptyList();
            }
            return groups.stream()
                    .map(group -> new SimpleGrantedAuthority("ROLE_" + group.toUpperCase()))
                    .collect(Collectors.toUnmodifiableList());
        });
        converter.setPrincipalClaimName("sub");
        return converter;
    }
}
