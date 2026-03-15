package com.eventpick.backend.restapi.exception;

import com.eventpick.backend.biz.exception.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.event.Level;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ExceptionLogger 単体テスト。
 * ログ出力レベル制御とスタックトレース出力方針の検証。
 * (実際のログ出力はslf4jのMock化が必要なため、例外なく実行完了確認を主目的とする)
 */
@ExtendWith(MockitoExtension.class)
class ExceptionLoggerTest {

    private final ExceptionLogger logger = new ExceptionLogger();

    @Test
    @DisplayName("BusinessException: INFOレベル、スタックトレースなし")
    void logBusinessException_infoLevel() {
        BadRequestException ex = new BadRequestException(MessageEnum.VALIDATION_ERROR, "テストエラー");
        ex.detail("field", "E01", "不正入力", "val");
        ex.context("userId", "U001", "対象ユーザー");

        // INFO + no stack → 正常完了すること
        assertDoesNotThrow(() -> logger.logException(ex, 400, "/api/v1/test"));
    }

    @Test
    @DisplayName("SystemException: ERRORレベル、スタックトレースあり")
    void logSystemException_errorWithStack() {
        SystemException ex = new SystemException("深刻なエラー", new RuntimeException("root cause"));

        // ERROR + stack trace → 正常完了すること
        assertDoesNotThrow(() -> logger.logException(ex, 500, "/api/v1/test"));
        assertEquals(Level.ERROR, ex.getMessageEnum().getLogLevel());
        assertTrue(ex.getMessageEnum().isPrintStackTrace());
    }

    @Test
    @DisplayName("ResourceNotFoundException: WARNレベル、スタックトレースなし")
    void logResourceNotFound_warnLevel() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Company", "id", "C001");

        assertDoesNotThrow(() -> logger.logException(ex, 404, "/api/v1/companies/C001"));
        assertEquals(Level.WARN, ex.getMessageEnum().getLogLevel());
        assertFalse(ex.getMessageEnum().isPrintStackTrace());
    }

    @Test
    @DisplayName("非BusinessException: MessageEnum指定でログ出力")
    void logSpringException_withMessageEnum() {
        IllegalArgumentException ex = new IllegalArgumentException("不正なパラメータ");

        assertDoesNotThrow(() ->
                logger.logException(ex, 400, "/api/v1/test", MessageEnum.ILLEGAL_ARGUMENT));
    }

    @Test
    @DisplayName("SYSTEM_ERROR MessageEnum: ERRORレベルでスタックトレース出力")
    void logGenericException_systemError() {
        RuntimeException ex = new RuntimeException("予期しないエラー");

        assertDoesNotThrow(() ->
                logger.logException(ex, 500, "/api/v1/test", MessageEnum.SYSTEM_ERROR));
    }

    @Test
    @DisplayName("ErrorDetail複数件: すべてログ出力される(例外なし)")
    void logMultipleErrorDetails() {
        BadRequestException ex = new BadRequestException(MessageEnum.VALIDATION_ERROR, "複数エラー");
        ex.detail("name", "E01", "必須", null);
        ex.detail("email", "E02", "形式不正", "bad");
        ex.detail("age", "E03", "範囲外", "999");

        assertDoesNotThrow(() -> logger.logException(ex, 400, "/api/v1/test"));
    }

    @Test
    @DisplayName("ExceptionContext複数件: すべてログ出力される(例外なし)")
    void logMultipleContextEntries() {
        ConflictException ex = new ConflictException("競合検出");
        // BusinessExceptionのcontext()を使う
        ex.context("companyId", "C001", "対象企業");
        ex.context("version", "3", "現在バージョン");

        assertDoesNotThrow(() -> logger.logException(ex, 409, "/api/v1/test"));
    }
}
