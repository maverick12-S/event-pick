package com.eventpick.backend.restapi.filter;

import com.eventpick.backend.biz.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * リクエスト開始/終了ログインターセプタ。
 * <p>
 * MDC に userId を積み、リクエストの開始/終了を INFO レベルで記録する。
 * RequestLoggingFilter と連携し、構造化ログの一貫性を確保。
 */
@Slf4j
@Component
public class LoggingInterceptor implements HandlerInterceptor {

    private static final String MDC_USER_ID = "userId";
    private static final String ATTR_START_TIME = "evk_start_time";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(ATTR_START_TIME, System.currentTimeMillis());

        // JWT認証済みの場合、Cognito sub を MDC に設定
        SecurityUtils.getCurrentUserSub().ifPresent(userId -> MDC.put(MDC_USER_ID, userId));

        log.info(">>> Start {} {}", request.getMethod(), request.getRequestURI());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) {
        // no-op
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        Long start = (Long) request.getAttribute(ATTR_START_TIME);
        long elapsed = start != null ? System.currentTimeMillis() - start : -1;

        log.info("<<< End {} {} status={} elapsed={}ms",
                request.getMethod(), request.getRequestURI(), response.getStatus(), elapsed);

        MDC.remove(MDC_USER_ID);
    }
}
