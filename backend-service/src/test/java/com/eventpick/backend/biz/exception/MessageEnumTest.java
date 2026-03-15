package com.eventpick.backend.biz.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.event.Level;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * MessageEnum 単体テスト。
 * エラーコード体系の一貫性、ログレベル設定、スタックトレース方針を検証。
 */
class MessageEnumTest {

    @Test
    @DisplayName("全エントリのコードがnullでなく空でないこと")
    void allCodes_notNullOrBlank() {
        for (MessageEnum msg : MessageEnum.values()) {
            assertNotNull(msg.getCode(), msg.name() + " のコードがnull");
            assertFalse(msg.getCode().isBlank(), msg.name() + " のコードが空");
        }
    }

    @Test
    @DisplayName("全エントリのデフォルトメッセージがnullでないこと")
    void allDefaultMessages_notNull() {
        for (MessageEnum msg : MessageEnum.values()) {
            assertNotNull(msg.getDefaultMessage(), msg.name() + " のデフォルトメッセージがnull");
        }
    }

    @Test
    @DisplayName("全エントリのログレベルがnullでないこと")
    void allLogLevels_notNull() {
        for (MessageEnum msg : MessageEnum.values()) {
            assertNotNull(msg.getLogLevel(), msg.name() + " のログレベルがnull");
        }
    }

    @Test
    @DisplayName("エラーコードが重複しないこと")
    void codes_unique() {
        Set<String> codes = new HashSet<>();
        for (MessageEnum msg : MessageEnum.values()) {
            assertTrue(codes.add(msg.getCode()),
                    "コード重複: " + msg.getCode() + " (" + msg.name() + ")");
        }
    }

    @Test
    @DisplayName("エラーコード体系: E1xxx=認証, E2xxx=バリデーション, E3xxx=ビジネス, E5xxx=サービス, E9xxx=システム")
    void codeRanges() {
        for (MessageEnum msg : MessageEnum.values()) {
            String code = msg.getCode();
            assertTrue(code.matches("E\\d{4}"),
                    msg.name() + " のコード形式が不正: " + code);

            int num = Integer.parseInt(code.substring(1));
            assertTrue(
                    (num >= 1000 && num < 2000) ||
                    (num >= 2000 && num < 3000) ||
                    (num >= 3000 && num < 4000) ||
                    (num >= 5000 && num < 6000) ||
                    (num >= 9000 && num <= 9999),
                    msg.name() + " のコード範囲が不正: " + code);
        }
    }

    @Test
    @DisplayName("認証系(E1xxx)はINFOまたはWARN")
    void authCodes_infoOrWarn() {
        for (MessageEnum msg : MessageEnum.values()) {
            if (msg.getCode().startsWith("E1")) {
                assertTrue(msg.getLogLevel() == Level.INFO || msg.getLogLevel() == Level.WARN,
                        msg.name() + " は認証系なのにログレベルが " + msg.getLogLevel());
            }
        }
    }

    @Test
    @DisplayName("システム系(E9xxx)はERROR + スタックトレースあり")
    void systemCodes_errorWithStack() {
        for (MessageEnum msg : MessageEnum.values()) {
            if (msg.getCode().startsWith("E9")) {
                assertEquals(Level.ERROR, msg.getLogLevel(),
                        msg.name() + " はシステム系なのにERRORでない");
                assertTrue(msg.isPrintStackTrace(),
                        msg.name() + " はシステム系なのにスタックトレースなし");
            }
        }
    }

    @Test
    @DisplayName("SYSTEM_ERROR: E9999, ERROR, スタックトレースあり")
    void systemError_specificValues() {
        MessageEnum sys = MessageEnum.SYSTEM_ERROR;
        assertEquals("E9999", sys.getCode());
        assertEquals(Level.ERROR, sys.getLogLevel());
        assertTrue(sys.isPrintStackTrace());
    }

    @Test
    @DisplayName("VALIDATION_ERROR: E2001, INFO, スタックトレースなし")
    void validationError_specificValues() {
        MessageEnum val = MessageEnum.VALIDATION_ERROR;
        assertEquals("E2001", val.getCode());
        assertEquals(Level.INFO, val.getLogLevel());
        assertFalse(val.isPrintStackTrace());
    }

    @Test
    @DisplayName("エントリ数が22以上であること(定義済み22エントリ)")
    void entryCount() {
        assertTrue(MessageEnum.values().length >= 22,
                "MessageEnumのエントリ数が期待未満: " + MessageEnum.values().length);
    }
}
