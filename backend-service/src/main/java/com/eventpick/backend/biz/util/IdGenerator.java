package com.eventpick.backend.biz.util;

import java.security.SecureRandom;
import java.time.Instant;

/**
 * ULID生成ユーティリティ。
 * 全エンティティのID生成に使用する。Crockford Base32 エンコーディング準拠。
 */
public final class IdGenerator {

    private static final char[] ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();

    private IdGenerator() {}

    /**
     * ULID (26文字) を生成する。
     */
    public static String generateUlid() {
        long timestamp = Instant.now().toEpochMilli();
        byte[] randomBytes = new byte[10];
        RANDOM.nextBytes(randomBytes);

        StringBuilder sb = new StringBuilder(26);
        // Timestamp (10 chars)
        encodeTimestamp(sb, timestamp);
        // Randomness (16 chars)
        encodeRandomness(sb, randomBytes);

        return sb.toString();
    }

    private static void encodeTimestamp(StringBuilder sb, long timestamp) {
        char[] chars = new char[10];
        chars[9] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[8] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[7] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[6] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[5] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[4] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[3] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[2] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[1] = ENCODING[(int) (timestamp & 0x1F)]; timestamp >>>= 5;
        chars[0] = ENCODING[(int) (timestamp & 0x1F)];
        sb.append(chars);
    }

    private static void encodeRandomness(StringBuilder sb, byte[] bytes) {
        // 10 bytes = 80 bits -> 16 base32 chars
        long high = 0;
        for (int i = 0; i < 5; i++) {
            high = (high << 8) | (bytes[i] & 0xFF);
        }
        long low = 0;
        for (int i = 5; i < 10; i++) {
            low = (low << 8) | (bytes[i] & 0xFF);
        }
        char[] chars = new char[16];
        for (int i = 7; i >= 0; i--) {
            chars[i] = ENCODING[(int) (high & 0x1F)]; high >>>= 5;
        }
        for (int i = 15; i >= 8; i--) {
            chars[i] = ENCODING[(int) (low & 0x1F)]; low >>>= 5;
        }
        sb.append(chars);
    }
}
