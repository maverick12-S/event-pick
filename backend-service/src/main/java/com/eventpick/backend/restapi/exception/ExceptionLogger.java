package com.eventpick.backend.restapi.exception;

import com.eventpick.backend.biz.exception.BusinessException;
import com.eventpick.backend.biz.exception.ErrorDetail;
import com.eventpick.backend.biz.exception.ExceptionContextEntry;
import com.eventpick.backend.biz.exception.MessageEnum;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.stereotype.Component;

/**
 * 例外ログ出力制御。
 * <p>
 * {@link MessageEnum} の LogLevel と printStackTrace フラグに従い、
 * 例外本体・ErrorDetail・ExceptionContext を構造化ログへ出力する。
 * <p>
 * 設計方針:
 * - {@code ILLEGAL_ARGUMENT} → INFO, スタックトレースなし
 * - {@code LOCKED} → ERROR, スタックトレースなし
 * - {@code SYSTEM_ERROR} → ERROR, スタックトレースあり
 */
@Slf4j
@Component
public class ExceptionLogger {

    /**
     * BusinessException 系の構造化ログ出力。
     *
     * @param ex              例外
     * @param responseStatus  HTTPレスポンスステータス
     * @param requestUri      リクエストURI
     */
    public void logException(BusinessException ex, int responseStatus, String requestUri) {
        MessageEnum msgEnum = ex.getMessageEnum();
        Level level = msgEnum.getLogLevel();
        boolean printStack = msgEnum.isPrintStackTrace();

        // ヘッダー行
        String header = String.format("Handle Exception [code=%s, responseHttpStatus=%d, request=%s, message=%s]",
                ex.getCode(), responseStatus, requestUri, ex.getMessage());

        logAtLevel(level, header, printStack ? ex : null);

        // ErrorDetail 明細出力
        for (ErrorDetail detail : ex.getDetails()) {
            String detailMsg = String.format("  ErrorDetail [field=%s, errorCode=%s, message=%s, rejectedValue=%s]",
                    detail.getField(), detail.getErrorCode(), detail.getMessage(), detail.getRejectedValue());
            logAtLevel(level, detailMsg, null);
        }

        // ExceptionContext 出力
        for (ExceptionContextEntry ctx : ex.getContextEntries()) {
            String ctxMsg = String.format("  ExceptionContext [%s=%s (%s)]",
                    ctx.getKey(), ctx.getValue(), ctx.getDescription());
            logAtLevel(level, ctxMsg, null);
        }
    }

    /**
     * 非BusinessException (Spring例外等) のログ出力。
     */
    public void logException(Exception ex, int responseStatus, String requestUri, MessageEnum msgEnum) {
        Level level = msgEnum.getLogLevel();
        boolean printStack = msgEnum.isPrintStackTrace();

        String header = String.format("Handle Exception [code=%s, responseHttpStatus=%d, request=%s, type=%s, message=%s]",
                msgEnum.getCode(), responseStatus, requestUri, ex.getClass().getSimpleName(), ex.getMessage());

        logAtLevel(level, header, printStack ? ex : null);
    }

    private void logAtLevel(Level level, String message, Throwable ex) {
        switch (level) {
            case ERROR -> { if (ex != null) log.error(message, ex); else log.error(message); }
            case WARN  -> { if (ex != null) log.warn(message, ex);  else log.warn(message);  }
            case INFO  -> { if (ex != null) log.info(message, ex);  else log.info(message);  }
            case DEBUG -> { if (ex != null) log.debug(message, ex); else log.debug(message); }
            default    -> { if (ex != null) log.info(message, ex);  else log.info(message);  }
        }
    }
}
