package com.eventpick.backend.domain.repository;

import com.eventpick.backend.biz.exception.ConflictException;
import com.eventpick.backend.biz.exception.DataAccessFailedException;
import com.eventpick.backend.biz.exception.MessageEnum;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DeadlockLoserDataAccessException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.stereotype.Component;

/**
 * Repository層の例外翻訳AOP。
 * <p>
 * DB固有例外を上位層へそのまま漏らさず、アプリ共通例外へ変換する。
 * PostgreSQL向け: 一意制約違反、デッドロック、ロック待ちタイムアウトを判別。
 */
@Slf4j
@Aspect
@Component
public class RepositoryExceptionInterceptor {

    @AfterThrowing(
            pointcut = "execution(* com.eventpick.backend.domain.repository..*(..))",
            throwing = "ex"
    )
    public void translateException(DataAccessException ex) {
        String message = ex.getMostSpecificCause().getMessage();

        // PostgreSQL 一意制約違反 (23505)
        if (ex instanceof DataIntegrityViolationException && message != null
                && message.contains("duplicate key value violates unique constraint")) {
            throw new DataAccessFailedException(
                    MessageEnum.UNIQUE_CONSTRAINT_VIOLATION,
                    "一意制約違反: " + extractConstraintName(message),
                    ex);
        }

        // デッドロック (40P01)
        if (ex instanceof DeadlockLoserDataAccessException) {
            throw new ConflictException(
                    MessageEnum.LOCKED,
                    "デッドロックが検出されました。再度お試しください。",
                    ex);
        }

        // ロック待ちタイムアウト / 排他ロック競合
        if (ex instanceof PessimisticLockingFailureException
                || ex instanceof CannotAcquireLockException) {
            throw new ConflictException(
                    MessageEnum.LOCKED,
                    "リソースがロックされています。再度お試しください。",
                    ex);
        }

        // その他のDataAccessException
        throw new DataAccessFailedException(
                MessageEnum.SYSTEM_ERROR,
                "データベースアクセスに失敗しました",
                ex);
    }

    private String extractConstraintName(String message) {
        // PostgreSQL: "duplicate key value violates unique constraint "constraint_name""
        int start = message.indexOf('"');
        int end = message.indexOf('"', start + 1);
        if (start >= 0 && end > start) {
            return message.substring(start + 1, end);
        }
        return "unknown";
    }
}
