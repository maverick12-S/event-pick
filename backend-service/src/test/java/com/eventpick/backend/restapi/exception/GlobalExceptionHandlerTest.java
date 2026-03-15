package com.eventpick.backend.restapi.exception;

import com.eventpick.backend.biz.exception.*;
import com.eventpick.backend.restapi.common.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * GlobalExceptionHandler 単体テスト。
 * 16種類の例外ハンドラすべてのレスポンス生成とExceptionLogger連携を検証する。
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler handler;

    @Mock
    private ExceptionLogger exceptionLogger;

    @Mock
    private HttpServletRequest request;

    @BeforeEach
    void setUp() {
        when(request.getRequestURI()).thenReturn("/api/v1/test");
    }

    // ─── BusinessException 階層 ───

    @Nested
    @DisplayName("BusinessException系ハンドラ")
    class BusinessExceptionHandlers {

        @Test
        @DisplayName("BadRequestException → 400, エラーコードE2001")
        void handleBadRequest() {
            BadRequestException ex = new BadRequestException(MessageEnum.VALIDATION_ERROR, "入力エラー");
            ex.detail("email", "E01", "メール形式不正", "bad@");

            CommonResponse<Void> resp = handler.handleBadRequest(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2001", resp.getError().getCode());
            assertEquals(1, resp.getError().getDetails().size());
            verify(exceptionLogger).logException(eq(ex), eq(400), eq("/api/v1/test"));
        }

        @Test
        @DisplayName("ConflictException → 409, エラーコードE3002")
        void handleConflict() {
            ConflictException ex = new ConflictException("データ競合");

            CommonResponse<Void> resp = handler.handleConflict(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E3002", resp.getError().getCode());
            verify(exceptionLogger).logException(eq(ex), eq(409), eq("/api/v1/test"));
        }

        @Test
        @DisplayName("DataAccessFailedException → 500")
        void handleDataAccessFailed() {
            DataAccessFailedException ex = new DataAccessFailedException(
                    MessageEnum.SYSTEM_ERROR, "DB障害");

            CommonResponse<Void> resp = handler.handleDataAccessFailed(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E9999", resp.getError().getCode());
            assertEquals("データベース操作に失敗しました", resp.getError().getMessage());
            verify(exceptionLogger).logException(eq(ex), eq(500), anyString());
        }

        @Test
        @DisplayName("SystemException → 500, システムエラーメッセージ")
        void handleSystem() {
            SystemException ex = new SystemException("予期せぬエラー", new RuntimeException("cause"));

            CommonResponse<Void> resp = handler.handleSystem(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E9999", resp.getError().getCode());
            assertEquals("システムエラーが発生しました", resp.getError().getMessage());
            verify(exceptionLogger).logException(eq(ex), eq(500), anyString());
        }

        @Test
        @DisplayName("ServiceUnavailableException → 503")
        void handleServiceUnavailable() {
            ServiceUnavailableException ex = new ServiceUnavailableException("メンテナンス中");

            CommonResponse<Void> resp = handler.handleServiceUnavailable(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E5001", resp.getError().getCode());
            verify(exceptionLogger).logException(eq(ex), eq(503), anyString());
        }

        @Test
        @DisplayName("ResourceNotFoundException → 404")
        void handleNotFound() {
            ResourceNotFoundException ex = new ResourceNotFoundException("Company", "id", "C001");

            CommonResponse<Void> resp = handler.handleNotFound(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E3001", resp.getError().getCode());
            assertTrue(resp.getError().getMessage().contains("C001"));
            verify(exceptionLogger).logException(eq(ex), eq(404), anyString());
        }

        @Test
        @DisplayName("BusinessException (catch-all) → 400")
        void handleBusiness() {
            BusinessException ex = new BusinessException(MessageEnum.BUSINESS_ERROR, "業務エラー")
                    .detail("field", "E99", "テストエラー", "val");

            CommonResponse<Void> resp = handler.handleBusiness(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E3005", resp.getError().getCode());
            assertEquals(1, resp.getError().getDetails().size());
            verify(exceptionLogger).logException(eq(ex), eq(400), anyString());
        }
    }

    // ─── Spring/Servlet 例外 ───

    @Nested
    @DisplayName("Spring/Servlet例外ハンドラ")
    class SpringExceptionHandlers {

        @Test
        @DisplayName("MethodArgumentNotValidException → 400, フィールドエラー一覧")
        void handleValidation() {
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);
            FieldError fieldError = new FieldError("dto", "name", "必須です");
            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

            CommonResponse<Void> resp = handler.handleValidation(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2001", resp.getError().getCode());
            assertTrue(resp.getError().getDetails().get(0).contains("name"));
            verify(exceptionLogger).logException(eq(ex), eq(400), anyString(), eq(MessageEnum.VALIDATION_ERROR));
        }

        @Test
        @DisplayName("MissingServletRequestParameterException → 400")
        void handleMissingParam() {
            MissingServletRequestParameterException ex =
                    new MissingServletRequestParameterException("page", "Integer");

            CommonResponse<Void> resp = handler.handleMissingParam(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2003", resp.getError().getCode());
            assertTrue(resp.getError().getMessage().contains("page"));
        }

        @Test
        @DisplayName("MethodArgumentTypeMismatchException → 400")
        void handleTypeMismatch() {
            MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
            when(ex.getName()).thenReturn("limit");

            CommonResponse<Void> resp = handler.handleTypeMismatch(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2004", resp.getError().getCode());
            assertTrue(resp.getError().getMessage().contains("limit"));
        }

        @Test
        @DisplayName("HttpMessageNotReadableException → 400, JSON不正")
        void handleMessageNotReadable() {
            HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);

            CommonResponse<Void> resp = handler.handleMessageNotReadable(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2007", resp.getError().getCode());
        }

        @Test
        @DisplayName("HttpRequestMethodNotSupportedException → 405")
        void handleMethodNotSupported() throws Exception {
            HttpRequestMethodNotSupportedException ex =
                    new HttpRequestMethodNotSupportedException("PATCH");

            CommonResponse<Void> resp = handler.handleMethodNotSupported(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2008", resp.getError().getCode());
            assertTrue(resp.getError().getMessage().contains("PATCH"));
        }

        @Test
        @DisplayName("IllegalArgumentException → 400")
        void handleIllegalArgument() {
            IllegalArgumentException ex = new IllegalArgumentException("不正な値");

            CommonResponse<Void> resp = handler.handleIllegalArgument(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2002", resp.getError().getCode());
            assertEquals("不正な値", resp.getError().getMessage());
        }
    }

    // ─── その他例外 ───

    @Nested
    @DisplayName("その他例外ハンドラ")
    class OtherExceptionHandlers {

        @Test
        @DisplayName("AccessDeniedException → 403")
        void handleAccessDenied() {
            AccessDeniedException ex = new AccessDeniedException("権限なし");

            CommonResponse<Void> resp = handler.handleAccessDenied(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E1003", resp.getError().getCode());
            verify(exceptionLogger).logException(eq(ex), eq(403), anyString(), eq(MessageEnum.ACCESS_DENIED));
        }

        @Test
        @DisplayName("MaxUploadSizeExceededException → 413")
        void handleMaxUploadSize() {
            MaxUploadSizeExceededException ex = new MaxUploadSizeExceededException(10485760);

            CommonResponse<Void> resp = handler.handleMaxUploadSize(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E2005", resp.getError().getCode());
        }

        @Test
        @DisplayName("ObjectOptimisticLockingFailureException → 409")
        void handleOptimisticLock() {
            ObjectOptimisticLockingFailureException ex =
                    new ObjectOptimisticLockingFailureException("Company", "C001");

            CommonResponse<Void> resp = handler.handleOptimisticLock(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E3003", resp.getError().getCode());
        }

        @Test
        @DisplayName("DataIntegrityViolationException → 409")
        void handleDataIntegrity() {
            DataIntegrityViolationException ex =
                    new DataIntegrityViolationException("constraint violation");

            CommonResponse<Void> resp = handler.handleDataIntegrity(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E3004", resp.getError().getCode());
        }

        @Test
        @DisplayName("Exception (catch-all) → 500, E9999")
        void handleGeneral() {
            Exception ex = new RuntimeException("予期しないエラー");

            CommonResponse<Void> resp = handler.handleGeneral(ex, request);

            assertFalse(resp.getSuccess());
            assertEquals("E9999", resp.getError().getCode());
            assertEquals("システムエラーが発生しました", resp.getError().getMessage());
            verify(exceptionLogger).logException(eq(ex), eq(500), anyString(), eq(MessageEnum.SYSTEM_ERROR));
        }
    }
}
