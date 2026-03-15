package com.eventpick.backend.biz.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * IdGenerator単体テスト。
 */
class IdGeneratorTest {

    @Test
    @DisplayName("ULIDは26文字のCrockford Base32文字列であること")
    void generateUlid_shouldReturn26CharString() {
        String ulid = IdGenerator.generateUlid();
        assertNotNull(ulid);
        assertEquals(26, ulid.length());
        assertTrue(ulid.matches("[0-9A-TV-Z]{26}"));
    }

    @Test
    @DisplayName("連続生成しても重複しないこと")
    void generateUlid_shouldBeUnique() {
        Set<String> ids = new HashSet<>();
        for (int i = 0; i < 1000; i++) {
            assertTrue(ids.add(IdGenerator.generateUlid()));
        }
        assertEquals(1000, ids.size());
    }

    @Test
    @DisplayName("ULIDはタイムスタンプ順にソート可能であること")
    void generateUlid_shouldBeTimeSortable() throws InterruptedException {
        String id1 = IdGenerator.generateUlid();
        Thread.sleep(2);
        String id2 = IdGenerator.generateUlid();
        assertTrue(id1.compareTo(id2) < 0);
    }
}
