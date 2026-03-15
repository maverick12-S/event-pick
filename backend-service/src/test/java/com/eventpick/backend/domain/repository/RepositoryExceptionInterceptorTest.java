package com.eventpick.backend.domain.repository;

import com.eventpick.backend.biz.exception.ConflictException;
import com.eventpick.backend.biz.exception.DataAccessFailedException;
import com.eventpick.backend.biz.exception.MessageEnum;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * RepositoryExceptionInterceptor 単体テスト。
 * PostgreSQL固有例外のアプリケーション例外への翻訳を検証。
 */
@ExtendWith(MockitoExtension.class)
class RepositoryExceptionInterceptorTest {

    private final RepositoryExceptionInterceptor interceptor = new RepositoryExceptionInterceptor();

    @Test
    @DisplayName("一意制約違反(23505) → DataAccessFailedException(UNIQUE_CONSTRAINT_VIOLATION)")
    void translateUniqueConstraintViolation() {
        DataIntegrityViolationException cause = new DataIntegrityViolationException(
                "duplicate key value violates unique constraint \"uk_company_email\"");

        DataAccessFailedException ex = assertThrows(DataAccessFailedException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.UNIQUE_CONSTRAINT_VIOLATION.getCode(), ex.getCode());
        assertTrue(ex.getMessage().contains("uk_company_email"));
        assertSame(cause, ex.getCause());
    }

    @Test
    @DisplayName("デッドロック(40P01) → ConflictException(LOCKED)")
    void translateDeadlock() {
        DeadlockLoserDataAccessException cause =
                new DeadlockLoserDataAccessException("deadlock detected", null);

        ConflictException ex = assertThrows(ConflictException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.LOCKED.getCode(), ex.getCode());
        assertTrue(ex.getMessage().contains("デッドロック"));
    }

    @Test
    @DisplayName("悲観ロック競合 → ConflictException(LOCKED)")
    void translatePessimisticLock() {
        PessimisticLockingFailureException cause =
                new PessimisticLockingFailureException("lock timeout");

        ConflictException ex = assertThrows(ConflictException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.LOCKED.getCode(), ex.getCode());
        assertTrue(ex.getMessage().contains("ロック"));
    }

    @Test
    @DisplayName("CannotAcquireLock → ConflictException(LOCKED)")
    void translateCannotAcquireLock() {
        CannotAcquireLockException cause =
                new CannotAcquireLockException("cannot acquire lock");

        ConflictException ex = assertThrows(ConflictException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.LOCKED.getCode(), ex.getCode());
    }

    @Test
    @DisplayName("その他DataAccessException → DataAccessFailedException(SYSTEM_ERROR)")
    void translateOtherDataAccessException() {
        DataAccessException cause = new DataAccessResourceFailureException("connection refused");

        DataAccessFailedException ex = assertThrows(DataAccessFailedException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.SYSTEM_ERROR.getCode(), ex.getCode());
        assertTrue(ex.getMessage().contains("データベースアクセスに失敗しました"));
    }

    @Test
    @DisplayName("DataIntegrityViolation(一意制約以外) → DataAccessFailedException(SYSTEM_ERROR)")
    void translateNonUniqueDataIntegrityViolation() {
        DataIntegrityViolationException cause = new DataIntegrityViolationException(
                "foreign key constraint violation");

        DataAccessFailedException ex = assertThrows(DataAccessFailedException.class,
                () -> interceptor.translateException(cause));

        assertEquals(MessageEnum.SYSTEM_ERROR.getCode(), ex.getCode());
    }
}
