-- Flyway V1: 初期スキーマ作成
-- EventPick Backend - PostgreSQL

-- ============================================================
-- 1. 一般消費者アカウント
-- ============================================================
CREATE TABLE user_accounts (
    user_id         CHAR(26)        PRIMARY KEY,
    auth_sub        VARCHAR(128)    UNIQUE,
    login_type      VARCHAR(1),
    user_name       VARCHAR(15)     NOT NULL,
    user_email      VARCHAR(254),
    phone_number    VARCHAR(15),
    user_gender     CHAR(1)         CHECK (user_gender IN ('M','F','O')),
    birth_year      VARCHAR(8),
    terms_agreed    BOOLEAN         NOT NULL DEFAULT false,
    is_active       BOOLEAN         NOT NULL DEFAULT false,
    is_deleted      BOOLEAN         NOT NULL DEFAULT false,
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_user_accounts_email    ON user_accounts(user_email);
CREATE UNIQUE INDEX idx_user_accounts_auth_sub ON user_accounts(auth_sub);

-- ============================================================
-- 2. 企業
-- ============================================================
CREATE TABLE companies (
    company_id          CHAR(26)        PRIMARY KEY,
    company_code        VARCHAR(16)     UNIQUE,
    company_name        VARCHAR(80)     NOT NULL,
    display_name        VARCHAR(40),
    company_type        CHAR(1)         CHECK (company_type IN ('1','2')),
    representative_name VARCHAR(40),
    admin_email         VARCHAR(128),
    admin_phone         VARCHAR(15),
    role_code           VARCHAR(2),
    account_status      VARCHAR(1)      NOT NULL DEFAULT '1',
    review_status       VARCHAR(1),
    parent_company_id   CHAR(26),
    stripe_customer_id  VARCHAR(64),
    cognito_sub         VARCHAR(128),
    is_deleted          BOOLEAN         NOT NULL DEFAULT false,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_companies_code ON companies(company_code);

-- ============================================================
-- 3. 拠点アカウント
-- ============================================================
CREATE TABLE company_accounts (
    account_id      CHAR(26)        PRIMARY KEY,
    company_id      CHAR(26)        NOT NULL REFERENCES companies(company_id),
    account_name    VARCHAR(80),
    account_email   VARCHAR(128),
    account_phone   VARCHAR(15),
    role_code       VARCHAR(2),
    account_status  VARCHAR(1)      NOT NULL DEFAULT '1',
    cognito_sub     VARCHAR(128),
    is_deleted      BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 4. 認証情報
-- ============================================================
CREATE TABLE auth_credentials (
    auth_id         CHAR(26)        PRIMARY KEY,
    user_id         CHAR(26),
    company_id      CHAR(26),
    auth_sub        VARCHAR(128)    NOT NULL,
    auth_provider   VARCHAR(20)     NOT NULL DEFAULT 'cognito',
    is_enabled      BOOLEAN         NOT NULL DEFAULT false,
    mfa_enabled     BOOLEAN         NOT NULL DEFAULT false,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_auth_credentials_sub ON auth_credentials(auth_sub);

-- ============================================================
-- 5. セッション
-- ============================================================
CREATE TABLE sessions (
    session_id      CHAR(26)        PRIMARY KEY,
    user_type       VARCHAR(10)     NOT NULL,
    consumer_id     CHAR(26),
    company_id      CHAR(26),
    auth_sub        VARCHAR(128)    NOT NULL,
    device_type     VARCHAR(20),
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(512),
    login_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_at       TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_sessions_auth_sub ON sessions(auth_sub);

-- ============================================================
-- 6. カテゴリ
-- ============================================================
CREATE TABLE categories (
    category_id     CHAR(26)        PRIMARY KEY,
    category_name   VARCHAR(40)     NOT NULL,
    description     VARCHAR(200),
    sort_order      INT,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 7. 地域
-- ============================================================
CREATE TABLE regions (
    region_id       CHAR(26)        PRIMARY KEY,
    region_name     VARCHAR(40)     NOT NULL,
    description     VARCHAR(200),
    sort_order      INT,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 8. 都道府県
-- ============================================================
CREATE TABLE prefectures (
    prefecture_code VARCHAR(2)      PRIMARY KEY,
    prefecture_name VARCHAR(10)     NOT NULL,
    sort_order      INT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 9. 市区町村
-- ============================================================
CREATE TABLE cities (
    city_code       VARCHAR(5)      PRIMARY KEY,
    prefecture_code VARCHAR(2)      NOT NULL REFERENCES prefectures(prefecture_code),
    city_name       VARCHAR(40)     NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 10. イベントテンプレート
-- ============================================================
CREATE TABLE event_templates (
    template_id     CHAR(26)        PRIMARY KEY,
    company_id      CHAR(26)        NOT NULL REFERENCES companies(company_id),
    template_name   VARCHAR(40)     NOT NULL,
    description     VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 11. イベントロケーション
-- ============================================================
CREATE TABLE event_locations (
    location_id     CHAR(26)        PRIMARY KEY,
    location_name   VARCHAR(80)     NOT NULL,
    address         VARCHAR(200),
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    prefecture_code VARCHAR(2),
    city_code       VARCHAR(5),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 12. イベント投稿
-- ============================================================
CREATE TABLE event_posts (
    post_id             CHAR(26)        PRIMARY KEY,
    template_id         CHAR(26)        REFERENCES event_templates(template_id),
    company_account_id  CHAR(26)        NOT NULL,
    title               VARCHAR(20)     NOT NULL,
    summary             VARCHAR(80),
    description         VARCHAR(1000),
    reservation_url     VARCHAR(512),
    address             VARCHAR(100),
    event_date          DATE,
    event_start_time    TIME,
    event_end_time      TIME,
    category_id         CHAR(26),
    status              CHAR(1)         NOT NULL DEFAULT '1' CHECK (status IN ('1','2','3')),
    like_count          INT             NOT NULL DEFAULT 0,
    view_count          INT             NOT NULL DEFAULT 0,
    favorite_count      INT             NOT NULL DEFAULT 0,
    scheduled_at        TIMESTAMP,
    published_at        TIMESTAMP,
    is_deleted          BOOLEAN         NOT NULL DEFAULT false,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_event_posts_company    ON event_posts(company_account_id);
CREATE INDEX idx_event_posts_status     ON event_posts(status);
CREATE INDEX idx_event_posts_event_date ON event_posts(event_date);
CREATE INDEX idx_event_posts_category   ON event_posts(category_id);

-- ============================================================
-- 13. イベントメディア
-- ============================================================
CREATE TABLE event_media (
    media_id        CHAR(26)        PRIMARY KEY,
    post_id         CHAR(26)        NOT NULL REFERENCES event_posts(post_id),
    file_url        VARCHAR(512)    NOT NULL,
    file_name       VARCHAR(256),
    content_type    VARCHAR(64),
    file_size       BIGINT,
    sort_order      INT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 14. イベント閲覧履歴
-- ============================================================
CREATE TABLE event_previews (
    preview_id      CHAR(26)        PRIMARY KEY,
    post_id         CHAR(26)        NOT NULL REFERENCES event_posts(post_id),
    user_id         CHAR(26),
    action_type     VARCHAR(10)     NOT NULL DEFAULT 'view',
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_event_previews_post ON event_previews(post_id);

-- ============================================================
-- 15. プラン
-- ============================================================
CREATE TABLE plans (
    plan_id         CHAR(26)        PRIMARY KEY,
    plan_name       VARCHAR(40)     NOT NULL,
    description     VARCHAR(500),
    price           NUMERIC(10,2)   NOT NULL,
    billing_cycle   VARCHAR(20),
    stripe_price_id VARCHAR(64),
    daily_ticket_limit INT          NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    sort_order      INT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 16. サブスクリプション
-- ============================================================
CREATE TABLE subscriptions (
    subscription_id         CHAR(26)        PRIMARY KEY,
    company_id              CHAR(26)        NOT NULL REFERENCES companies(company_id),
    plan_id                 CHAR(26)        NOT NULL REFERENCES plans(plan_id),
    stripe_subscription_id  VARCHAR(64),
    status                  VARCHAR(20)     NOT NULL DEFAULT 'pending',
    auto_renew              BOOLEAN         NOT NULL DEFAULT true,
    current_period_start    TIMESTAMP,
    current_period_end      TIMESTAMP,
    canceled_at             TIMESTAMP,
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version                 BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_subscriptions_company ON subscriptions(company_id);

-- ============================================================
-- 17. 企業チケット
-- ============================================================
CREATE TABLE company_tickets (
    ticket_id           CHAR(26)    PRIMARY KEY,
    company_id          CHAR(26)    NOT NULL REFERENCES companies(company_id),
    total_tickets       INT         NOT NULL DEFAULT 0,
    used_tickets        INT         NOT NULL DEFAULT 0,
    remaining_tickets   INT         NOT NULL DEFAULT 0,
    ticket_date         DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT      NOT NULL DEFAULT 0
);
CREATE INDEX idx_company_tickets_company ON company_tickets(company_id);

-- ============================================================
-- 18. チケット消費履歴
-- ============================================================
CREATE TABLE ticket_histories (
    history_id      CHAR(26)    PRIMARY KEY,
    ticket_id       CHAR(26)    NOT NULL REFERENCES company_tickets(ticket_id),
    company_id      CHAR(26)    NOT NULL,
    post_id         CHAR(26),
    action          VARCHAR(20) NOT NULL,
    amount          INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 19. 企業審査
-- ============================================================
CREATE TABLE company_reviews (
    review_id       CHAR(26)    PRIMARY KEY,
    company_id      CHAR(26)    NOT NULL REFERENCES companies(company_id),
    review_type     VARCHAR(1),
    review_status   VARCHAR(1)  NOT NULL DEFAULT '1',
    reviewer_id     CHAR(26),
    review_comment  VARCHAR(500),
    reviewed_at     TIMESTAMP,
    submitted_at    TIMESTAMP,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 20. クーポン
-- ============================================================
CREATE TABLE coupons (
    coupon_id       CHAR(26)        PRIMARY KEY,
    coupon_code     VARCHAR(32)     NOT NULL UNIQUE,
    description     VARCHAR(200),
    discount_type   VARCHAR(1)      NOT NULL CHECK (discount_type IN ('1','2')),
    discount_value  NUMERIC(10,2)   NOT NULL,
    valid_from      DATE,
    valid_to        DATE,
    max_usage       INT,
    used_count      INT             NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 21. 請求先住所
-- ============================================================
CREATE TABLE billing_addresses (
    billing_address_id  CHAR(26)    PRIMARY KEY,
    company_id          CHAR(26)    NOT NULL UNIQUE REFERENCES companies(company_id),
    postal_code         VARCHAR(10),
    prefecture          VARCHAR(10),
    city                VARCHAR(50),
    address_line1       VARCHAR(100),
    address_line2       VARCHAR(100),
    building_name       VARCHAR(100),
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 22. 請求データ
-- ============================================================
CREATE TABLE company_billings (
    billing_id              CHAR(26)        PRIMARY KEY,
    company_id              CHAR(26)        NOT NULL REFERENCES companies(company_id),
    subscription_id         CHAR(26)        REFERENCES subscriptions(subscription_id),
    stripe_invoice_id       VARCHAR(64),
    amount                  NUMERIC(10,2)   NOT NULL,
    tax_amount              NUMERIC(10,2)   NOT NULL DEFAULT 0,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'pending',
    billing_period_start    TIMESTAMP,
    billing_period_end      TIMESTAMP,
    paid_at                 TIMESTAMP,
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version                 BIGINT          NOT NULL DEFAULT 0
);
CREATE INDEX idx_company_billings_company ON company_billings(company_id);

-- ============================================================
-- 23. 企業通知
-- ============================================================
CREATE TABLE company_notifications (
    notification_id     CHAR(26)    PRIMARY KEY,
    company_id          CHAR(26)    NOT NULL REFERENCES companies(company_id),
    title               VARCHAR(100) NOT NULL,
    message             VARCHAR(500),
    notification_type   VARCHAR(1),
    is_read             BOOLEAN     NOT NULL DEFAULT false,
    read_at             TIMESTAMP,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 24. お問い合わせ
-- ============================================================
CREATE TABLE inquiries (
    inquiry_id  CHAR(26)        PRIMARY KEY,
    company_id  CHAR(26),
    user_id     CHAR(26),
    subject     VARCHAR(100)    NOT NULL,
    body        VARCHAR(2000)   NOT NULL,
    status      VARCHAR(20)     NOT NULL DEFAULT 'open',
    reply_body  VARCHAR(2000),
    replied_at  TIMESTAMP,
    closed_at   TIMESTAMP,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     BIGINT          NOT NULL DEFAULT 0
);

-- ============================================================
-- 25. 同意ログ
-- ============================================================
CREATE TABLE agreement_logs (
    agreement_id    CHAR(26)    PRIMARY KEY,
    user_id         CHAR(26),
    company_id      CHAR(26),
    agreement_type  VARCHAR(30) NOT NULL,
    agreed_version  VARCHAR(20),
    agreed_at       TIMESTAMP   NOT NULL,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 26. 監査ログ
-- ============================================================
CREATE TABLE audit_logs (
    log_id      CHAR(26)    PRIMARY KEY,
    actor_id    CHAR(26),
    actor_type  VARCHAR(20),
    action      VARCHAR(50) NOT NULL,
    target_type VARCHAR(1),
    target_id   CHAR(26),
    details     VARCHAR(2000),
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(512),
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     BIGINT      NOT NULL DEFAULT 0
);
CREATE INDEX idx_audit_logs_actor   ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- 27. 実行履歴
-- ============================================================
CREATE TABLE execution_histories (
    execution_id    CHAR(26)    PRIMARY KEY,
    company_id      CHAR(26),
    execution_type  VARCHAR(1)  NOT NULL,
    target_id       CHAR(26),
    result_status   VARCHAR(1)  NOT NULL,
    message         VARCHAR(500),
    executed_at     TIMESTAMP   NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 28. システム設定
-- ============================================================
CREATE TABLE system_settings (
    setting_key     VARCHAR(64) PRIMARY KEY,
    setting_value   VARCHAR(2000),
    description     VARCHAR(200),
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         BIGINT      NOT NULL DEFAULT 0
);

-- ============================================================
-- 初期マスタデータ投入
-- ============================================================

-- 都道府県マスタ (47件)
INSERT INTO prefectures (prefecture_code, prefecture_name, sort_order) VALUES
('01','北海道',1),('02','青森県',2),('03','岩手県',3),('04','宮城県',4),
('05','秋田県',5),('06','山形県',6),('07','福島県',7),('08','茨城県',8),
('09','栃木県',9),('10','群馬県',10),('11','埼玉県',11),('12','千葉県',12),
('13','東京都',13),('14','神奈川県',14),('15','新潟県',15),('16','富山県',16),
('17','石川県',17),('18','福井県',18),('19','山梨県',19),('20','長野県',20),
('21','岐阜県',21),('22','静岡県',22),('23','愛知県',23),('24','三重県',24),
('25','滋賀県',25),('26','京都府',26),('27','大阪府',27),('28','兵庫県',28),
('29','奈良県',29),('30','和歌山県',30),('31','鳥取県',31),('32','島根県',32),
('33','岡山県',33),('34','広島県',34),('35','山口県',35),('36','徳島県',36),
('37','香川県',37),('38','愛媛県',38),('39','高知県',39),('40','福岡県',40),
('41','佐賀県',41),('42','長崎県',42),('43','熊本県',43),('44','大分県',44),
('45','宮崎県',45),('46','鹿児島県',46),('47','沖縄県',47);

-- カテゴリマスタ
INSERT INTO categories (category_id, category_name, sort_order) VALUES
('01HCAT000000000000000000001','音楽・ライブ',1),
('01HCAT000000000000000000002','フード・グルメ',2),
('01HCAT000000000000000000003','スポーツ',3),
('01HCAT000000000000000000004','アート・展示',4),
('01HCAT000000000000000000005','テクノロジー',5),
('01HCAT000000000000000000006','ビジネス・セミナー',6),
('01HCAT000000000000000000007','お祭り・伝統行事',7),
('01HCAT000000000000000000008','キッズ・ファミリー',8),
('01HCAT000000000000000000009','アウトドア',9),
('01HCAT000000000000000000010','その他',10);

-- プランマスタ
INSERT INTO plans (plan_id, plan_name, description, price, billing_cycle, daily_ticket_limit, sort_order) VALUES
('01HPLN000000000000000000001','フリープラン','無料プラン。1日1投稿まで。',0,'monthly',1,1),
('01HPLN000000000000000000002','スタンダードプラン','月額基本プラン。1日5投稿まで。',9800,'monthly',5,2),
('01HPLN000000000000000000003','プレミアムプラン','上位プラン。1日20投稿まで。',29800,'monthly',20,3);

-- 地域マスタ
INSERT INTO regions (region_id, region_name, sort_order) VALUES
('01HREG000000000000000000001','北海道・東北',1),
('01HREG000000000000000000002','関東',2),
('01HREG000000000000000000003','中部',3),
('01HREG000000000000000000004','近畿',4),
('01HREG000000000000000000005','中国・四国',5),
('01HREG000000000000000000006','九州・沖縄',6);

-- システム設定初期値
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode','false','メンテナンスモード'),
('max_upload_size_mb','3','最大アップロードサイズ(MB)'),
('max_media_per_event','3','イベントあたり最大画像枚数'),
('ticket_expiry_days','1','チケット有効日数');
