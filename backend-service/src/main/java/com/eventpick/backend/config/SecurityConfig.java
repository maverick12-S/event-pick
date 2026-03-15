package com.eventpick.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * セキュリティ設定。
 * OAuth2 Resource Server (JWT) + 認証不要エンドポイントの定義。
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
                // Actuator / Swagger
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // その他は認証必須
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
