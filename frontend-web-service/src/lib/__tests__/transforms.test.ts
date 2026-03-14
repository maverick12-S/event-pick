/**
 * transforms.ts — フォームデータ → API DTO 変換のテスト
 * ───────────────────────────────────────────────
 * camelCase → snake_case の変換と、
 * マッピング（プランコード、ステータスコード）の正確性を検証。
 * 商用リリースまで一貫した振る舞いを保証する。
 */

import {
  toSignupRequest,
  toPasswordChangeRequest,
  toMfaVerifyRequest,
  toAccountIssueRequest,
  toAccountUpdateRequest,
  toContactInquiryRequest,
  toCouponApplyRequest,
  toPlanSelectRequest,
} from '../transforms';

// ═══════════════════════════════════════════════
// toSignupRequest
// ═══════════════════════════════════════════════

describe('toSignupRequest', () => {
  it('フォームデータをsnake_caseのDTO形式に変換する', () => {
    const result = toSignupRequest({
      corporateCode: 'CORP001',
      companyName: '株式会社テスト',
      representative: '田中太郎',
      notifyEmail: 'test@example.com',
    });

    expect(result).toEqual({
      company_code: 'CORP001',
      company_name: '株式会社テスト',
      representative_name: '田中太郎',
      company_type: '1',
      admin_email: 'test@example.com',
      login_type: '1',
    });
  });

  it('デフォルト値（company_type, login_type）が設定される', () => {
    const result = toSignupRequest({
      corporateCode: 'X',
      companyName: 'Y',
      representative: 'Z',
      notifyEmail: 'z@test.com',
    });

    expect(result.company_type).toBe('1');
    expect(result.login_type).toBe('1');
  });
});

// ═══════════════════════════════════════════════
// toPasswordChangeRequest
// ═══════════════════════════════════════════════

describe('toPasswordChangeRequest', () => {
  it('パスワードとトークンを正しく変換する', () => {
    const result = toPasswordChangeRequest(
      { password: 'NewPass123', confirm: 'NewPass123' },
      'reset-token-abc',
    );

    expect(result).toEqual({
      token: 'reset-token-abc',
      new_password: 'NewPass123',
    });
  });
});

// ═══════════════════════════════════════════════
// toMfaVerifyRequest
// ═══════════════════════════════════════════════

describe('toMfaVerifyRequest', () => {
  it.each([
    ['signup' as const],
    ['password-reset' as const],
    ['login' as const],
  ])('purpose=%s でリクエストDTOを生成する', (purpose) => {
    const result = toMfaVerifyRequest(
      { code: '123456' },
      purpose,
      'session-token-xyz',
    );

    expect(result).toEqual({
      code: '123456',
      purpose,
      session_token: 'session-token-xyz',
    });
  });
});

// ═══════════════════════════════════════════════
// toAccountIssueRequest
// ═══════════════════════════════════════════════

describe('toAccountIssueRequest', () => {
  it('拠点アカウント払出フォームをDTO形式に変換する', () => {
    const result = toAccountIssueRequest({
      baseName: '渋谷支店',
      displayName: 'Shibuya Branch',
      address: '渋谷区道玄坂1-2-3',
      initialPassword: 'InitPass1234',
      plan: 'スタンダードプラン',
      couponCode: 'WELCOME',
    });

    expect(result.branch_name).toBe('渋谷支店');
    expect(result.branch_display_name).toBe('Shibuya Branch');
    expect(result.address_line).toBe('渋谷区道玄坂1-2-3');
    expect(result.initial_password).toBe('InitPass1234');
    expect(result.plan_code).toBe('STANDARD');
    expect(result.coupon_code).toBe('WELCOME');
    expect(result.company_role_id).toBe('02');
  });

  it.each([
    ['ライトプラン', 'LIGHT'],
    ['スタンダードプラン', 'STANDARD'],
    ['プレミアムプラン', 'PREMIUM'],
  ])('プラン「%s」をコード「%s」に変換する', (planName, expectedCode) => {
    const result = toAccountIssueRequest({
      baseName: 'test',
      displayName: '',
      address: 'addr',
      initialPassword: 'pass1234',
      plan: planName as 'ライトプラン' | 'スタンダードプラン' | 'プレミアムプラン',
    });
    expect(result.plan_code).toBe(expectedCode);
  });

  it('displayNameが空文字の場合undefinedになる', () => {
    const result = toAccountIssueRequest({
      baseName: 'test',
      displayName: '',
      address: 'addr',
      initialPassword: 'pass1234',
      plan: 'ライトプラン',
    });
    expect(result.branch_display_name).toBeUndefined();
  });

  it('couponCodeが未指定の場合undefinedになる', () => {
    const result = toAccountIssueRequest({
      baseName: 'test',
      displayName: '',
      address: 'addr',
      initialPassword: 'pass1234',
      plan: 'ライトプラン',
    });
    expect(result.coupon_code).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════
// toAccountUpdateRequest
// ═══════════════════════════════════════════════

describe('toAccountUpdateRequest', () => {
  it('拠点アカウント編集フォームをDTO形式に変換する', () => {
    const result = toAccountUpdateRequest({
      baseName: '新宿支店',
      address: '新宿区西新宿3-4-5',
      email: 'shinjuku@test.com',
      plan: 'プレミアムプラン',
      status: '利用中',
    });

    expect(result.branch_name).toBe('新宿支店');
    expect(result.address_line).toBe('新宿区西新宿3-4-5');
    expect(result.contact_email).toBe('shinjuku@test.com');
    expect(result.plan_code).toBe('PREMIUM');
    expect(result.status).toBe('1');
  });

  it.each([
    ['利用中', '1'],
    ['停止中', '2'],
  ])('ステータス「%s」をコード「%s」に変換する', (statusName, expectedCode) => {
    const result = toAccountUpdateRequest({
      baseName: 'test',
      address: 'addr',
      email: 'e@t.com',
      plan: 'ライトプラン',
      status: statusName as '利用中' | '停止中' | '削除予定',
    });
    expect(result.status).toBe(expectedCode);
  });

  it('オプショナルフィールドが空の場合undefinedになる', () => {
    const result = toAccountUpdateRequest({
      baseName: 'test',
      address: 'addr',
      email: '',
      plan: 'ライトプラン',
      status: '利用中',
    });
    expect(result.contact_email).toBeUndefined();
    expect(result.password).toBeUndefined();
    expect(result.coupon_code).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════
// toContactInquiryRequest
// ═══════════════════════════════════════════════

describe('toContactInquiryRequest', () => {
  it('お問い合わせフォームをDTO形式に変換する', () => {
    const result = toContactInquiryRequest({
      subject: 'テスト件名',
      category: 'アカウント',
      message: 'テストメッセージ本文です。',
    });

    expect(result).toEqual({
      subject: 'テスト件名',
      message: 'テストメッセージ本文です。',
    });
  });

  it('categoryはDTOに含まれない（フロント表示用のみ）', () => {
    const result = toContactInquiryRequest({
      subject: 's',
      message: 'm',
    });

    expect(result).not.toHaveProperty('category');
  });
});

// ═══════════════════════════════════════════════
// toCouponApplyRequest
// ═══════════════════════════════════════════════

describe('toCouponApplyRequest', () => {
  it('クーポンコードをsnake_case DTOに変換する', () => {
    const result = toCouponApplyRequest({ couponCode: 'SUMMER2026' });
    expect(result).toEqual({ coupon_code: 'SUMMER2026' });
  });
});

// ═══════════════════════════════════════════════
// toPlanSelectRequest
// ═══════════════════════════════════════════════

describe('toPlanSelectRequest', () => {
  it.each([
    ['light', 'LIGHT'],
    ['standard', 'STANDARD'],
    ['premium', 'PREMIUM'],
  ])('planId=%s がコード %s に変換される', (planId, expected) => {
    const result = toPlanSelectRequest(planId);
    expect(result.plan_code).toBe(expected);
  });

  it('大文字混在でも正しく変換される', () => {
    const result = toPlanSelectRequest('Standard');
    expect(result.plan_code).toBe('STANDARD');
  });
});
