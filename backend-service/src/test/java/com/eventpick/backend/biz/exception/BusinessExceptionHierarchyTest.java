package com.eventpick.backend.biz.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * BusinessException 階層テスト。
 * 例外生成、コンテキスト積み上げ、明細積み上げ、不変リスト保証を検証。
 */
class BusinessExceptionHierarchyTest {

    @Nested
    @DisplayName("BusinessException")
    class BusinessExceptionTests {

        @Test
        @DisplayName("MessageEnumコンストラクタ: code, message, messageEnumが正しく設定される")
        void constructor_withMessageEnum() {
            BusinessException ex = new BusinessException(MessageEnum.BUSINESS_ERROR, "テストエラー");

            assertEquals("E3005", ex.getCode());
            assertEquals("テストエラー", ex.getMessage());
            assertEquals(MessageEnum.BUSINESS_ERROR, ex.getMessageEnum());
        }

        @Test
        @DisplayName("後方互換コンストラクタ: String code指定")
        void constructor_backwardCompatible() {
            BusinessException ex = new BusinessException("CUSTOM_001", "カスタムエラー");

            assertEquals("CUSTOM_001", ex.getCode());
            assertEquals("カスタムエラー", ex.getMessage());
            assertEquals(MessageEnum.BUSINESS_ERROR, ex.getMessageEnum());
        }

        @Test
        @DisplayName("context(): 複数のコンテキストエントリを積み上げられること")
        void context_fluent() {
            BusinessException ex = new BusinessException(MessageEnum.BUSINESS_ERROR)
                    .context("key1", "val1", "desc1")
                    .context("key2", "val2", "desc2");

            List<ExceptionContextEntry> entries = ex.getContextEntries();
            assertEquals(2, entries.size());
            assertEquals("key1", entries.get(0).getKey());
            assertEquals("val2", entries.get(1).getValue());
        }

        @Test
        @DisplayName("detail(): 複数のエラー明細を積み上げられること")
        void detail_fluent() {
            BusinessException ex = new BusinessException(MessageEnum.VALIDATION_ERROR)
                    .detail("name", "E01", "必須", null)
                    .detail("email", "E02", "形式不正", "bad@");

            List<ErrorDetail> details = ex.getDetails();
            assertEquals(2, details.size());
            assertEquals("name", details.get(0).getField());
            assertEquals("bad@", details.get(1).getRejectedValue());
        }

        @Test
        @DisplayName("getDetails()は不変リストを返すこと")
        void details_immutable() {
            BusinessException ex = new BusinessException(MessageEnum.BUSINESS_ERROR);
            List<ErrorDetail> details = ex.getDetails();

            assertThrows(UnsupportedOperationException.class, () ->
                    details.add(ErrorDetail.builder().field("x").build()));
        }

        @Test
        @DisplayName("getContextEntries()は不変リストを返すこと")
        void contextEntries_immutable() {
            BusinessException ex = new BusinessException(MessageEnum.BUSINESS_ERROR);
            List<ExceptionContextEntry> entries = ex.getContextEntries();

            assertThrows(UnsupportedOperationException.class, () ->
                    entries.add(ExceptionContextEntry.builder().key("x").build()));
        }

        @Test
        @DisplayName("cause付きコンストラクタ: getCause()が正しいこと")
        void constructor_withCause() {
            RuntimeException cause = new RuntimeException("root");
            BusinessException ex = new BusinessException(MessageEnum.SYSTEM_ERROR, "エラー", cause);

            assertSame(cause, ex.getCause());
        }
    }

    @Nested
    @DisplayName("サブクラス")
    class SubclassTests {

        @Test
        @DisplayName("BadRequestException は BusinessException を継承")
        void badRequest_isBusinessException() {
            BadRequestException ex = new BadRequestException(MessageEnum.VALIDATION_ERROR, "不正");

            assertInstanceOf(BusinessException.class, ex);
            assertEquals("E2001", ex.getCode());
        }

        @Test
        @DisplayName("SystemException は BusinessException を継承")
        void systemException_isBusinessException() {
            SystemException ex = new SystemException("障害", new RuntimeException());

            assertInstanceOf(BusinessException.class, ex);
            assertEquals("E9999", ex.getCode());
        }

        @Test
        @DisplayName("ResourceNotFoundException のコンストラクタ: resourceName/fieldName/fieldValue")
        void resourceNotFound_formattedMessage() {
            ResourceNotFoundException ex =
                    new ResourceNotFoundException("Event", "eventId", "EVT001");

            assertTrue(ex.getMessage().contains("Event"));
            assertTrue(ex.getMessage().contains("eventId"));
            assertTrue(ex.getMessage().contains("EVT001"));
            assertEquals("E3001", ex.getCode());
        }

        @Test
        @DisplayName("ConflictException: MessageEnum指定可能")
        void conflict_withMessageEnum() {
            ConflictException ex = new ConflictException(MessageEnum.LOCKED, "ロック中");

            assertEquals("E3007", ex.getCode());
            assertEquals(MessageEnum.LOCKED, ex.getMessageEnum());
        }

        @Test
        @DisplayName("ServiceUnavailableException: デフォルトMessageEnum")
        void serviceUnavailable_defaultEnum() {
            ServiceUnavailableException ex = new ServiceUnavailableException("停止中");

            assertEquals("E5001", ex.getCode());
            assertEquals(MessageEnum.SERVICE_UNAVAILABLE, ex.getMessageEnum());
        }

        @Test
        @DisplayName("DataAccessFailedException: cause付き")
        void dataAccessFailed_withCause() {
            RuntimeException cause = new RuntimeException("DB error");
            DataAccessFailedException ex = new DataAccessFailedException(
                    MessageEnum.UNIQUE_CONSTRAINT_VIOLATION, "一意制約違反", cause);

            assertEquals("E3006", ex.getCode());
            assertSame(cause, ex.getCause());
        }
    }
}
