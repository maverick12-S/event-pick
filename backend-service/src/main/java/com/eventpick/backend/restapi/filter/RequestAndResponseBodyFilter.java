package com.eventpick.backend.restapi.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * リクエスト/レスポンスボディのキャッシュ＆ログ出力フィルタ。
 * <p>
 * ContentCachingRequestWrapper / ContentCachingResponseWrapper を使い、
 * Controller がボディを読まない場合や途中エラーでも body を記録できる。
 * <p>
 * デバッグログレベル時のみ全文出力。プロダクションでは抑制される。
 * 除外パスは設定ファイルで管理。
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RequestAndResponseBodyFilter extends OncePerRequestFilter {

    private static final String EMPTY_BODY = "*** empty body ***";

    @Value("${eventpick.logging.body-filter.exclude-paths:/actuator/health}")
    private String excludePaths;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (shouldSkip(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            logRequestBody(wrappedRequest);
            logResponseBody(wrappedResponse);
            wrappedResponse.copyBodyToResponse();
        }
    }

    private void logRequestBody(ContentCachingRequestWrapper request) {
        if (!log.isDebugEnabled()) return;
        byte[] buf = request.getContentAsByteArray();
        String body = buf.length > 0 ? new String(buf, StandardCharsets.UTF_8) : EMPTY_BODY;
        log.debug("HTTP request body = {}", body);
    }

    private void logResponseBody(ContentCachingResponseWrapper response) {
        if (!log.isDebugEnabled()) return;
        byte[] buf = response.getContentAsByteArray();
        String body = buf.length > 0 ? new String(buf, StandardCharsets.UTF_8) : EMPTY_BODY;
        log.debug("HTTP response body = {}", body);
    }

    private boolean shouldSkip(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return List.of(excludePaths.split(",")).stream()
                .anyMatch(path -> uri.contains(path.trim()));
    }
}
