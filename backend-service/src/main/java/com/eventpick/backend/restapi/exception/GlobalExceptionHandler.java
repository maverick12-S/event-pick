package com.eventpick.backend.restapi.exception;

import com.eventpick.backend.biz.exception.*;
import com.eventpick.backend.restapi.common.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;

/**
 * 共通例外ハンドラ (RestControllerAdvice)。
 * <p>
 * 設計方針:
 * <ul>
 *   <li>BaseException系でない例外も最終的に SystemException(SYSTEM_ERROR) にラップ</li>
 *   <li>バリデーション系のSpring例外は BadRequestException に寄せる</li>
 *   <li>エラー応答ボディは CommonResponse + ErrorPayload で統一</li>
 *   <li>応答生成前に ExceptionLogger でログ出力し、MessageEnumに従ったレベル制御を行う</li>
 * </ul>
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ExceptionLogger exceptionLogger;

    // ────────────────────────────────────────────
    //  BusinessException 系 (BaseException hierarchy)
    // ────────────────────────────────────────────

    /** BadRequestException (400) - パラメータ不正、入力チェック不正 */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI());
        List<String> details = ex.getDetails().stream()
                .map(d -> d.getField().isEmpty()
                        ? String.format("[%s] %s", d.getErrorCode(), d.getMessage())
                        : String.format("%s: [%s] %s", d.getField(), d.getErrorCode(), d.getMessage()))
                .toList();
        return CommonResponse.error(ex.getCode(), ex.getMessage(), details);
    }

    /** ConflictException (409) - 排他制御違反、デッドロック */
    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public CommonResponse<Void> handleConflict(ConflictException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 409, request.getRequestURI());
        return CommonResponse.error(ex.getCode(), ex.getMessage(), List.of());
    }

    /** DataAccessFailedException (500) - DB操作失敗 */
    @ExceptionHandler(DataAccessFailedException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<Void> handleDataAccessFailed(DataAccessFailedException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 500, request.getRequestURI());
        return CommonResponse.error(ex.getCode(), "データベース操作に失敗しました", List.of());
    }

    /** SystemException (500) - システム障害 */
    @ExceptionHandler(SystemException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<Void> handleSystem(SystemException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 500, request.getRequestURI());
        return CommonResponse.error(ex.getCode(), "システムエラーが発生しました", List.of());
    }

    /** ServiceUnavailableException (503) - 外部サービス障害、メンテナンス */
    @ExceptionHandler(ServiceUnavailableException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public CommonResponse<Void> handleServiceUnavailable(ServiceUnavailableException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 503, request.getRequestURI());
        return CommonResponse.error(ex.getCode(), ex.getMessage(), List.of());
    }

    /** ResourceNotFoundException (404) */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public CommonResponse<Void> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 404, request.getRequestURI());
        return CommonResponse.error(ex.getCode(), ex.getMessage(), List.of());
    }

    /** BusinessException (400) - その他業務例外 (catch-all for hierarchy) */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleBusiness(BusinessException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI());
        List<String> details = ex.getDetails().stream()
                .map(d -> String.format("%s: %s", d.getField(), d.getMessage()))
                .toList();
        return CommonResponse.error(ex.getCode(), ex.getMessage(), details);
    }

    // ────────────────────────────────────────────
    //  Spring / Servlet 例外 → BadRequest (400)
    // ────────────────────────────────────────────

    /** MethodArgumentNotValidException - Bean Validation 失敗 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI(), MessageEnum.VALIDATION_ERROR);
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .toList();
        return CommonResponse.error(MessageEnum.VALIDATION_ERROR.getCode(),
                MessageEnum.VALIDATION_ERROR.getDefaultMessage(), details);
    }

    /** MissingServletRequestParameterException - 必須パラメータ未指定 */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI(), MessageEnum.MISSING_PARAMETER);
        return CommonResponse.error(MessageEnum.MISSING_PARAMETER.getCode(),
                MessageEnum.MISSING_PARAMETER.getDefaultMessage() + ": " + ex.getParameterName(), List.of());
    }

    /** MethodArgumentTypeMismatchException - パラメータ型不一致 */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI(), MessageEnum.TYPE_MISMATCH);
        return CommonResponse.error(MessageEnum.TYPE_MISMATCH.getCode(),
                MessageEnum.TYPE_MISMATCH.getDefaultMessage() + ": " + ex.getName(), List.of());
    }

    /** HttpMessageNotReadableException - JSONボディ不正 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI(), MessageEnum.JSON_PARSE_ERROR);
        return CommonResponse.error(MessageEnum.JSON_PARSE_ERROR.getCode(),
                MessageEnum.JSON_PARSE_ERROR.getDefaultMessage(), List.of());
    }

    /** HttpRequestMethodNotSupportedException - 未対応HTTPメソッド */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public CommonResponse<Void> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 405, request.getRequestURI(), MessageEnum.METHOD_NOT_SUPPORTED);
        return CommonResponse.error(MessageEnum.METHOD_NOT_SUPPORTED.getCode(),
                MessageEnum.METHOD_NOT_SUPPORTED.getDefaultMessage() + ": " + ex.getMethod(), List.of());
    }

    /** IllegalArgumentException - 不正パラメータ */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 400, request.getRequestURI(), MessageEnum.ILLEGAL_ARGUMENT);
        return CommonResponse.error(MessageEnum.ILLEGAL_ARGUMENT.getCode(), ex.getMessage(), List.of());
    }

    // ────────────────────────────────────────────
    //  その他
    // ────────────────────────────────────────────

    /** AccessDeniedException (403) */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public CommonResponse<Void> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 403, request.getRequestURI(), MessageEnum.ACCESS_DENIED);
        return CommonResponse.error(MessageEnum.ACCESS_DENIED.getCode(),
                MessageEnum.ACCESS_DENIED.getDefaultMessage(), List.of());
    }

    /** MaxUploadSizeExceededException (413) */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public CommonResponse<Void> handleMaxUploadSize(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 413, request.getRequestURI(), MessageEnum.UPLOAD_SIZE_EXCEEDED);
        return CommonResponse.error(MessageEnum.UPLOAD_SIZE_EXCEEDED.getCode(),
                MessageEnum.UPLOAD_SIZE_EXCEEDED.getDefaultMessage(), List.of());
    }

    /** ObjectOptimisticLockingFailureException (409) */
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public CommonResponse<Void> handleOptimisticLock(ObjectOptimisticLockingFailureException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 409, request.getRequestURI(), MessageEnum.OPTIMISTIC_LOCK);
        return CommonResponse.error(MessageEnum.OPTIMISTIC_LOCK.getCode(),
                MessageEnum.OPTIMISTIC_LOCK.getDefaultMessage(), List.of());
    }

    /** DataIntegrityViolationException (409) - AOP翻訳を通り抜けたケース */
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public CommonResponse<Void> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 409, request.getRequestURI(), MessageEnum.DATA_INTEGRITY_VIOLATION);
        return CommonResponse.error(MessageEnum.DATA_INTEGRITY_VIOLATION.getCode(),
                MessageEnum.DATA_INTEGRITY_VIOLATION.getDefaultMessage(), List.of());
    }

    /** Exception (500) - 最終catch-all。BaseException系でない例外もここで捕捉 */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<Void> handleGeneral(Exception ex, HttpServletRequest request) {
        exceptionLogger.logException(ex, 500, request.getRequestURI(), MessageEnum.SYSTEM_ERROR);
        return CommonResponse.error(MessageEnum.SYSTEM_ERROR.getCode(),
                MessageEnum.SYSTEM_ERROR.getDefaultMessage(), List.of());
    }
}
