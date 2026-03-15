package com.eventpick.backend.restapi.exception;

import com.eventpick.backend.biz.exception.BusinessException;
import com.eventpick.backend.biz.exception.ResourceNotFoundException;
import com.eventpick.backend.restapi.common.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * 共通例外ハンドラ。
 * RestAPI層の例外翻訳とエラー応答生成の中枢。
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** バリデーションエラー (400) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .toList();
        log.warn("Validation error: {}", details);
        return CommonResponse.error("E2001", "バリデーションエラー", details);
    }

    /** ビジネス例外 (400) */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleBusiness(BusinessException ex) {
        log.warn("Business error: {} - {}", ex.getCode(), ex.getMessage());
        return CommonResponse.error(ex.getCode(), ex.getMessage(), List.of());
    }

    /** リソース未検出 (404) */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public CommonResponse<Void> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return CommonResponse.error("E3001", ex.getMessage(), List.of());
    }

    /** 認可エラー (403) */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public CommonResponse<Void> handleAccessDenied(AccessDeniedException ex) {
        return CommonResponse.error("E1003", "アクセス権限がありません", List.of());
    }

    /** 不正リクエスト (400) */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<Void> handleIllegalArgument(IllegalArgumentException ex) {
        return CommonResponse.error("E2002", ex.getMessage(), List.of());
    }

    /** その他の例外 (500) */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<Void> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return CommonResponse.error("E9999", "システムエラーが発生しました", List.of());
    }
}
