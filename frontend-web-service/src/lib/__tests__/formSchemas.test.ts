/**
 * formSchemas.ts — 全フォームスキーマのバリデーションテスト
 * ───────────────────────────────────────────────
 * 全19画面のZodスキーマに対して正常系・異常系を検証。
 * 商用リリースまで一貫した入力バリデーション挙動を保証する。
 */

import {
  loginFormSchema,
  signupFormSchema,
  passwordResetFormSchema,
  passwordChangeFormSchema,
  mfaFormSchema,
  accountIssueFormSchema,
  accountEditFormSchema,
  billingEditFormSchema,
  contactFormSchema,
  couponFormSchema,
  postFormSchema,
  postDetailEditFormSchema,
  adminAccountFormSchema,
  adminPasswordFormSchema,
  adminSiteFormSchema,
  adminSecurityFormSchema,
  adminCouponGenerateFormSchema,
  adminCategoryAddFormSchema,
  adminInquiryReplyFormSchema,
  adminReviewRejectFormSchema,
} from '../formSchemas';

// ═══════════════════════════════════════════════
// Auth スキーマ
// ═══════════════════════════════════════════════

describe('loginFormSchema', () => {
  const valid = { realm: 'company1', username: 'admin', password: 'P@ssw0rd!' };

  it('有効なデータを受理する', () => {
    expect(loginFormSchema.safeParse(valid).success).toBe(true);
  });

  it('realm が空の場合に拒否する', () => {
    expect(loginFormSchema.safeParse({ ...valid, realm: '' }).success).toBe(false);
  });

  it('username が空の場合に拒否する', () => {
    expect(loginFormSchema.safeParse({ ...valid, username: '' }).success).toBe(false);
  });

  it('password が空の場合に拒否する', () => {
    expect(loginFormSchema.safeParse({ ...valid, password: '' }).success).toBe(false);
  });

  it('禁止文字を含む realm を拒否する', () => {
    expect(loginFormSchema.safeParse({ ...valid, realm: '<script>' }).success).toBe(false);
  });

  it('password は特殊文字を許可する（ハッシュ化されるため）', () => {
    expect(loginFormSchema.safeParse({ ...valid, password: "P@ss$w0rd'!<>" }).success).toBe(true);
  });
});

describe('signupFormSchema', () => {
  const valid = {
    corporateCode: 'CORP001',
    companyName: '株式会社テスト',
    representative: '田中太郎',
    notifyEmail: 'admin@example.com',
  };

  it('有効なデータを受理する', () => {
    expect(signupFormSchema.safeParse(valid).success).toBe(true);
  });

  it('corporateCode の16文字超過を拒否する', () => {
    expect(signupFormSchema.safeParse({ ...valid, corporateCode: 'A'.repeat(17) }).success).toBe(false);
  });

  it('無効なメールアドレスを拒否する', () => {
    expect(signupFormSchema.safeParse({ ...valid, notifyEmail: 'not-email' }).success).toBe(false);
  });

  it('禁止文字を含む companyName を拒否する', () => {
    expect(signupFormSchema.safeParse({ ...valid, companyName: "会社'名" }).success).toBe(false);
  });
});

describe('passwordResetFormSchema', () => {
  it('有効なメールを受理する', () => {
    expect(passwordResetFormSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });

  it('無効なメールを拒否する', () => {
    expect(passwordResetFormSchema.safeParse({ email: 'invalid' }).success).toBe(false);
  });
});

describe('passwordChangeFormSchema', () => {
  it('一致するパスワードペアを受理する', () => {
    expect(passwordChangeFormSchema.safeParse({ password: 'newpass12', confirm: 'newpass12' }).success).toBe(true);
  });

  it('8文字未満のパスワードを拒否する', () => {
    expect(passwordChangeFormSchema.safeParse({ password: 'short', confirm: 'short' }).success).toBe(false);
  });

  it('不一致なパスワードを拒否する', () => {
    const result = passwordChangeFormSchema.safeParse({ password: 'password1', confirm: 'password2' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('confirm'));
      expect(confirmError).toBeDefined();
    }
  });
});

describe('mfaFormSchema', () => {
  it('6桁の数字を受理する', () => {
    expect(mfaFormSchema.safeParse({ code: '123456' }).success).toBe(true);
  });

  it('5桁の数字を拒否する', () => {
    expect(mfaFormSchema.safeParse({ code: '12345' }).success).toBe(false);
  });

  it('7桁の数字を拒否する', () => {
    expect(mfaFormSchema.safeParse({ code: '1234567' }).success).toBe(false);
  });

  it('英字を含むコードを拒否する', () => {
    expect(mfaFormSchema.safeParse({ code: '12345a' }).success).toBe(false);
  });
});

// ═══════════════════════════════════════════════
// Account スキーマ
// ═══════════════════════════════════════════════

describe('accountIssueFormSchema', () => {
  const valid = {
    baseName: '渋谷店',
    displayName: '渋谷支店',
    address: '東京都渋谷区1-2-3',
    initialPassword: 'Password1',
    plan: 'ライトプラン' as const,
    couponCode: 'WELCOME',
  };

  it('有効なデータを受理する', () => {
    expect(accountIssueFormSchema.safeParse(valid).success).toBe(true);
  });

  it('baseName が空の場合に拒否する', () => {
    expect(accountIssueFormSchema.safeParse({ ...valid, baseName: '' }).success).toBe(false);
  });

  it('initialPassword が8文字未満の場合に拒否する', () => {
    expect(accountIssueFormSchema.safeParse({ ...valid, initialPassword: 'short' }).success).toBe(false);
  });

  it('無効なプラン名を拒否する', () => {
    expect(accountIssueFormSchema.safeParse({ ...valid, plan: '無料プラン' }).success).toBe(false);
  });

  it('couponCode はオプショナル', () => {
    const { couponCode: _, ...withoutCoupon } = valid;
    expect(accountIssueFormSchema.safeParse(withoutCoupon).success).toBe(true);
  });

  it('禁止文字を含む baseName を拒否する', () => {
    expect(accountIssueFormSchema.safeParse({ ...valid, baseName: '渋谷<店>' }).success).toBe(false);
  });
});

describe('accountEditFormSchema', () => {
  const valid = {
    baseName: '渋谷店',
    address: '東京都渋谷区1-2-3',
    email: 'branch@example.com',
    plan: 'スタンダードプラン' as const,
    status: '利用中' as const,
  };

  it('有効なデータを受理する', () => {
    expect(accountEditFormSchema.safeParse(valid).success).toBe(true);
  });

  it('無効なステータスを拒否する', () => {
    expect(accountEditFormSchema.safeParse({ ...valid, status: '無効' }).success).toBe(false);
  });

  it('全3ステータスを受理する', () => {
    expect(accountEditFormSchema.safeParse({ ...valid, status: '利用中' }).success).toBe(true);
    expect(accountEditFormSchema.safeParse({ ...valid, status: '停止中' }).success).toBe(true);
    expect(accountEditFormSchema.safeParse({ ...valid, status: '削除予定' }).success).toBe(true);
  });
});

// ═══════════════════════════════════════════════
// Settings スキーマ
// ═══════════════════════════════════════════════

describe('billingEditFormSchema', () => {
  const valid = {
    name: '田中太郎',
    email: 'billing@example.com',
    country: '日本',
    postalCode: '150-0001',
    prefecture: '東京都',
    city: '渋谷区',
    address1: '道玄坂1-2-3',
  };

  it('有効なデータを受理する', () => {
    expect(billingEditFormSchema.safeParse(valid).success).toBe(true);
  });

  it('必須フィールド「name」が空の場合に拒否する', () => {
    expect(billingEditFormSchema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('address2 はオプショナル', () => {
    expect(billingEditFormSchema.safeParse({ ...valid, address2: 'ビル5F' }).success).toBe(true);
    expect(billingEditFormSchema.safeParse(valid).success).toBe(true);
  });
});

describe('contactFormSchema', () => {
  const valid = { subject: 'テスト件名', category: 'アカウント', message: 'お問い合わせ内容です' };

  it('有効なデータを受理する', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it('subject が空の場合に拒否する', () => {
    expect(contactFormSchema.safeParse({ ...valid, subject: '' }).success).toBe(false);
  });

  it('message が空の場合に拒否する', () => {
    expect(contactFormSchema.safeParse({ ...valid, message: '' }).success).toBe(false);
  });

  it('category はオプショナル', () => {
    expect(contactFormSchema.safeParse({ subject: 'テスト', message: 'テスト内容' }).success).toBe(true);
  });

  it('禁止文字を含む subject を拒否する', () => {
    expect(contactFormSchema.safeParse({ ...valid, subject: 'テスト<script>' }).success).toBe(false);
  });
});

describe('couponFormSchema', () => {
  it('有効なクーポンコードを受理する', () => {
    expect(couponFormSchema.safeParse({ couponCode: 'WELCOME2026' }).success).toBe(true);
  });

  it('空のクーポンコードを拒否する', () => {
    expect(couponFormSchema.safeParse({ couponCode: '' }).success).toBe(false);
  });

  it('20文字超過を拒否する', () => {
    expect(couponFormSchema.safeParse({ couponCode: 'A'.repeat(21) }).success).toBe(false);
  });
});

// ═══════════════════════════════════════════════
// Posts スキーマ
// ═══════════════════════════════════════════════

describe('postFormSchema', () => {
  const valid = {
    title: 'テストイベント',
    summary: 'イベント概要',
    detail: 'イベント詳細',
    reservation: 'https://example.com',
    address: '東京都渋谷区',
    venueName: '渋谷ホール',
    budget: '3000円',
    startTime: '18:00',
    endTime: '20:00',
    category: '食事',
  };

  it('有効なデータを受理する', () => {
    expect(postFormSchema.safeParse(valid).success).toBe(true);
  });

  it('title が空の場合に拒否する', () => {
    expect(postFormSchema.safeParse({ ...valid, title: '' }).success).toBe(false);
  });

  it('summary が空の場合に拒否する', () => {
    expect(postFormSchema.safeParse({ ...valid, summary: '' }).success).toBe(false);
  });

  it('category が空の場合に拒否する', () => {
    expect(postFormSchema.safeParse({ ...valid, category: '' }).success).toBe(false);
  });

  it('detail の1200文字超過を拒否する', () => {
    expect(postFormSchema.safeParse({ ...valid, detail: 'あ'.repeat(1201) }).success).toBe(false);
  });

  it('禁止文字を含む title を拒否する', () => {
    expect(postFormSchema.safeParse({ ...valid, title: 'イベント<XSS>' }).success).toBe(false);
  });

  it('オプショナルフィールドは省略可能', () => {
    const minimal = { title: 'テスト', summary: '概要', detail: '', address: '', venueName: '', category: '食事' };
    expect(postFormSchema.safeParse(minimal).success).toBe(true);
  });
});

describe('postDetailEditFormSchema', () => {
  const valid = {
    title: 'テストイベント',
    category: '食事',
    ward: '渋谷区',
    venue: '渋谷ホール',
    description: 'イベント概要',
    timeLabel: '18:00-20:00',
    nextPostDate: '2026-04-01',
  };

  it('有効なデータを受理する', () => {
    expect(postDetailEditFormSchema.safeParse(valid).success).toBe(true);
  });

  it('title が空の場合に拒否する', () => {
    expect(postDetailEditFormSchema.safeParse({ ...valid, title: '' }).success).toBe(false);
  });

  it('category が空の場合に拒否する', () => {
    expect(postDetailEditFormSchema.safeParse({ ...valid, category: '' }).success).toBe(false);
  });
});

// ═══════════════════════════════════════════════
// Admin スキーマ
// ═══════════════════════════════════════════════

describe('adminAccountFormSchema', () => {
  const valid = { displayName: '田中太郎', username: 'admin_tanaka', email: 'admin@example.com', phone: '03-1234-5678' };

  it('有効なデータを受理する', () => {
    expect(adminAccountFormSchema.safeParse(valid).success).toBe(true);
  });

  it('displayName が空の場合に拒否する', () => {
    expect(adminAccountFormSchema.safeParse({ ...valid, displayName: '' }).success).toBe(false);
  });

  it('無効なメールを拒否する', () => {
    expect(adminAccountFormSchema.safeParse({ ...valid, email: 'invalid' }).success).toBe(false);
  });

  it('禁止文字を含む username を拒否する', () => {
    expect(adminAccountFormSchema.safeParse({ ...valid, username: 'admin; DROP' }).success).toBe(false);
  });
});

describe('adminPasswordFormSchema', () => {
  const valid = { currentPassword: 'old123456', nextPassword: 'new12345', confirmPassword: 'new12345' };

  it('有効なデータを受理する', () => {
    expect(adminPasswordFormSchema.safeParse(valid).success).toBe(true);
  });

  it('currentPassword が空の場合に拒否する', () => {
    expect(adminPasswordFormSchema.safeParse({ ...valid, currentPassword: '' }).success).toBe(false);
  });

  it('nextPassword が8文字未満の場合に拒否する', () => {
    expect(adminPasswordFormSchema.safeParse({ ...valid, nextPassword: 'short', confirmPassword: 'short' }).success).toBe(false);
  });

  it('パスワード不一致を拒否する', () => {
    const result = adminPasswordFormSchema.safeParse({ ...valid, confirmPassword: 'mismatch' });
    expect(result.success).toBe(false);
  });
});

describe('adminSiteFormSchema', () => {
  const valid = {
    siteName: 'EventPick',
    siteUrl: 'https://eventpick.jp',
    adminEmail: 'admin@eventpick.jp',
    supportEmail: 'support@eventpick.jp',
    timezone: 'Asia/Tokyo',
    language: 'ja',
    description: 'イベント管理プラットフォーム',
  };

  it('有効なデータを受理する', () => {
    expect(adminSiteFormSchema.safeParse(valid).success).toBe(true);
  });

  it('無効なURLを拒否する', () => {
    expect(adminSiteFormSchema.safeParse({ ...valid, siteUrl: 'not-a-url' }).success).toBe(false);
  });

  it('禁止文字を含む siteName を拒否する', () => {
    expect(adminSiteFormSchema.safeParse({ ...valid, siteName: 'Event<Pick>' }).success).toBe(false);
  });
});

describe('adminSecurityFormSchema', () => {
  const valid = { sessionTimeoutMin: 60, maxLoginAttempts: 5, passwordMinLength: 8 };

  it('有効なデータを受理する', () => {
    expect(adminSecurityFormSchema.safeParse(valid).success).toBe(true);
  });

  it('sessionTimeoutMin が5未満の場合に拒否する', () => {
    expect(adminSecurityFormSchema.safeParse({ ...valid, sessionTimeoutMin: 3 }).success).toBe(false);
  });

  it('passwordMinLength が6未満の場合に拒否する', () => {
    expect(adminSecurityFormSchema.safeParse({ ...valid, passwordMinLength: 4 }).success).toBe(false);
  });

  it('ipWhitelist はオプショナル', () => {
    expect(adminSecurityFormSchema.safeParse({ ...valid, ipWhitelist: '203.0.113.0/24' }).success).toBe(true);
    expect(adminSecurityFormSchema.safeParse(valid).success).toBe(true);
  });
});

describe('adminCouponGenerateFormSchema', () => {
  const valid = { code: 'SUMMER2026', type: 'percent' as const, discount: '10', maxUses: '500', expiresAt: '2026-12-31' };

  it('有効なデータを受理する', () => {
    expect(adminCouponGenerateFormSchema.safeParse(valid).success).toBe(true);
  });

  it('code が空の場合に拒否する', () => {
    expect(adminCouponGenerateFormSchema.safeParse({ ...valid, code: '' }).success).toBe(false);
  });

  it('type が percent/fixed 以外を拒否する', () => {
    expect(adminCouponGenerateFormSchema.safeParse({ ...valid, type: 'free' }).success).toBe(false);
  });

  it('discount が空の場合に拒否する', () => {
    expect(adminCouponGenerateFormSchema.safeParse({ ...valid, discount: '' }).success).toBe(false);
  });

  it('禁止文字を含む code を拒否する', () => {
    expect(adminCouponGenerateFormSchema.safeParse({ ...valid, code: "CODE'DROP" }).success).toBe(false);
  });
});

describe('adminCategoryAddFormSchema', () => {
  it('有効なカテゴリ名を受理する', () => {
    expect(adminCategoryAddFormSchema.safeParse({ name: '音楽フェス' }).success).toBe(true);
  });

  it('空のカテゴリ名を拒否する', () => {
    expect(adminCategoryAddFormSchema.safeParse({ name: '' }).success).toBe(false);
  });

  it('30文字超過を拒否する', () => {
    expect(adminCategoryAddFormSchema.safeParse({ name: 'あ'.repeat(31) }).success).toBe(false);
  });

  it('禁止文字を拒否する', () => {
    expect(adminCategoryAddFormSchema.safeParse({ name: 'カテゴリ<xss>' }).success).toBe(false);
  });
});

describe('adminInquiryReplyFormSchema', () => {
  it('有効な返信テキストを受理する', () => {
    expect(adminInquiryReplyFormSchema.safeParse({ replyText: 'ご連絡ありがとうございます。' }).success).toBe(true);
  });

  it('空の返信テキストを拒否する', () => {
    expect(adminInquiryReplyFormSchema.safeParse({ replyText: '' }).success).toBe(false);
  });

  it('禁止文字を含む返信を拒否する', () => {
    expect(adminInquiryReplyFormSchema.safeParse({ replyText: '<script>alert(1)</script>' }).success).toBe(false);
  });
});

describe('adminReviewRejectFormSchema', () => {
  it('有効な却下理由を受理する', () => {
    expect(adminReviewRejectFormSchema.safeParse({ rejectReason: '書類の内容が一致しません。' }).success).toBe(true);
  });

  it('空の却下理由を拒否する', () => {
    expect(adminReviewRejectFormSchema.safeParse({ rejectReason: '' }).success).toBe(false);
  });

  it('禁止文字を含む却下理由を拒否する', () => {
    expect(adminReviewRejectFormSchema.safeParse({ rejectReason: "理由'; DROP TABLE" }).success).toBe(false);
  });
});

// ═══════════════════════════════════════════════
// XSS/SQLi/CMDi 横断テスト — 全スキーマ共通
// ═══════════════════════════════════════════════

describe('全スキーマ共通: 禁止文字パターンの拒否', () => {
  const xssPayloads = [
    '<script>alert(1)</script>',
    '<img onerror=alert(1)>',
    '"><script>alert(document.cookie)</script>',
  ];

  const sqliPayloads = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "1; DELETE FROM accounts",
    "/* comment */ SELECT *",
  ];

  const cmdiPayloads = [
    '$(rm -rf /)',
    '`cat /etc/passwd`',
    'test|cat /etc/passwd',
    'test\\ncat /etc/passwd',
  ];

  const allPayloads = [...xssPayloads, ...sqliPayloads, ...cmdiPayloads];

  // テキストフィールドのみ含むシンプルなスキーマ群
  const schemasWithTextField = [
    { name: 'contactFormSchema (subject)', schema: contactFormSchema, field: 'subject', base: { message: '正常メッセージ', subject: '' } },
    { name: 'couponFormSchema', schema: couponFormSchema, field: 'couponCode', base: {} },
    { name: 'adminCategoryAddFormSchema', schema: adminCategoryAddFormSchema, field: 'name', base: {} },
    { name: 'adminInquiryReplyFormSchema', schema: adminInquiryReplyFormSchema, field: 'replyText', base: {} },
    { name: 'adminReviewRejectFormSchema', schema: adminReviewRejectFormSchema, field: 'rejectReason', base: {} },
  ];

  for (const { name, schema, field, base } of schemasWithTextField) {
    describe(name, () => {
      it.each(allPayloads)('悪意のあるペイロード「%s」を拒否する', (payload) => {
        const data = { ...base, [field]: payload };
        expect(schema.safeParse(data).success).toBe(false);
      });
    });
  }
});
