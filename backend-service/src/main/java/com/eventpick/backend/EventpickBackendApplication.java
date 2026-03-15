package com.eventpick.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * EventPick Backend Service 起動クラス。
 * <p>
 * AWS Private Network内のEC2で動作するSPAバックエンド。
 * Web (React/Next.js) と Mobile (App Store Connect / Google Play Console) の両対応。
 * RDS (PostgreSQL) 接続、Redis キャッシュ、Stripe連携、10万同時接続対応。
 * </p>
 */
@SpringBootApplication
public class EventpickBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventpickBackendApplication.class, args);
    }
}
