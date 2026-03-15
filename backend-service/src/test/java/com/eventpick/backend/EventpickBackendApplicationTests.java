package com.eventpick.backend;

import org.junit.jupiter.api.Test;

/**
 * アプリケーション起動テスト。
 * ※ 外部サービス依存(RDS, Redis, Cognito)のため
 *   実際のSpringBootテストはCI環境のIntegration Testで実施する。
 */
class EventpickBackendApplicationTests {

    @Test
    void contextLoadsPlaceholder() {
        // Spring Boot contextロードテストは外部依存があるためスキップ
        // @SpringBootTest + Testcontainers を利用する場合はCI環境で実施
    }
}
