import { describe, it, expect } from 'vitest';
import {
  billingSubscriptionSchema, billingAddressSchema, billingDataSchema,
  invoiceSchema,
} from '../billing.schema';
import {
  planSelectRequestSchema, planSelectResponseSchema,
  couponApplyRequestSchema, couponApplyResponseSchema,
} from '../plan.schema';
import {
  reportListParamsSchema, reportDetailParamsSchema, reportSummaryParamsSchema,
} from '../report.schema';
import {
  settingsAccountUpdateRequestSchema, billingAddressUpdateRequestSchema,
  notificationSettingItemSchema, notificationSettingsPayloadSchema,
  contactInquiryRequestSchema, contactInquiryResponseSchema,
  executionHistoryListParamsSchema,
} from '../settings.schema';
import {
  agreementTypeSchema, agreementLogCreateRequestSchema, agreementLogCreateResponseSchema,
} from '../agreement.schema';

describe('billing.schema', () => {
  it('billingSubscriptionSchema accepts valid', () => {
    expect(billingSubscriptionSchema.parse({
      id: 's1', planName: 'Standard', cycle: 'monthly', unitAmount: '8600',
      status: 'active', renewalDate: '2026-04-01', nextEstimate: '8600',
    })).toBeTruthy();
  });
  it('invoiceSchema accepts valid', () => {
    expect(invoiceSchema.parse({ id: 'i1', date: '2026-03-01', amount: '8600', status: '支払い済み' })).toBeTruthy();
  });
  it('invoiceSchema rejects invalid status', () => {
    expect(() => invoiceSchema.parse({ id: 'i1', date: 'd', amount: 'a', status: 'invalid' })).toThrow();
  });
  it('billingAddressSchema accepts valid', () => {
    expect(billingAddressSchema.parse({
      name: '田中', email: 'a@b.com', country: 'JP', postalCode: '1600022',
      prefecture: '東京都', city: '新宿区', address1: '1-1-1', address2: '',
      phoneCountry: '+81', phoneNumber: '09012345678',
    })).toBeTruthy();
  });
  it('billingDataSchema accepts valid structure', () => {
    const valid = {
      company: { companyName: 'テスト株式会社' },
      subscription: {
        id: 's1', planName: 'P', cycle: 'monthly', unitAmount: '1000',
        status: 'active', renewalDate: '2026-04-01', nextEstimate: '1000',
      },
      paymentMethods: [{ id: 'pm1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2027, isDefault: true }],
      billingAddress: {
        name: 'N', email: 'e@e.com', country: 'JP', postalCode: '1000001',
        prefecture: '東京都', city: '千代田区', address1: '1-1', address2: '',
        phoneCountry: '+81', phoneNumber: '03',
      },
      invoices: [],
    };
    expect(billingDataSchema.parse(valid)).toBeTruthy();
  });
});

describe('plan.schema', () => {
  it('planSelectRequestSchema accepts LIGHT/STANDARD/PREMIUM', () => {
    expect(planSelectRequestSchema.parse({ plan_code: 'LIGHT' })).toBeTruthy();
    expect(planSelectRequestSchema.parse({ plan_code: 'STANDARD' })).toBeTruthy();
    expect(planSelectRequestSchema.parse({ plan_code: 'PREMIUM' })).toBeTruthy();
  });
  it('planSelectRequestSchema rejects invalid', () => {
    expect(() => planSelectRequestSchema.parse({ plan_code: 'FREE' })).toThrow();
  });
  it('planSelectResponseSchema accepts valid', () => {
    expect(planSelectResponseSchema.parse({ changed: true, plan_name: 'ライトプラン' })).toBeTruthy();
  });
  it('couponApplyRequestSchema accepts valid', () => {
    expect(couponApplyRequestSchema.parse({ coupon_code: 'SAVE20' })).toBeTruthy();
  });
  it('couponApplyRequestSchema rejects empty', () => {
    expect(() => couponApplyRequestSchema.parse({ coupon_code: '' })).toThrow();
  });
  it('couponApplyResponseSchema accepts valid', () => {
    expect(couponApplyResponseSchema.parse({ applied: true, discount_type: '1', free_days: 30 })).toBeTruthy();
  });
});

describe('report.schema', () => {
  it('reportListParamsSchema accepts valid', () => {
    expect(reportListParamsSchema.parse({ from: '2026-01-01', to: '2026-03-31' })).toBeTruthy();
  });
  it('reportListParamsSchema rejects invalid date', () => {
    expect(() => reportListParamsSchema.parse({ from: 'bad', to: '2026-03-31' })).toThrow();
  });
  it('reportDetailParamsSchema accepts valid', () => {
    expect(reportDetailParamsSchema.parse({ reportId: 'r1' })).toBeTruthy();
  });
  it('reportSummaryParamsSchema accepts valid', () => {
    expect(reportSummaryParamsSchema.parse({
      from: '2026-01-01', to: '2026-03-31', groupBy: 'day',
    })).toBeTruthy();
  });
});

describe('settings.schema', () => {
  describe('settingsAccountUpdateRequestSchema', () => {
    const valid = {
      branch_name: '拠点', prefecture_code: '13', city: '渋谷', status: '1' as const,
    };
    it('accepts valid', () => { expect(settingsAccountUpdateRequestSchema.parse(valid)).toBeTruthy(); });
  });

  describe('billingAddressUpdateRequestSchema', () => {
    const valid = {
      name: 'N', email: 'e@e.com', country: 'JP', postalCode: '100',
      prefecture: '東京', city: '新宿', address1: '1-1', address2: '',
      phoneCountry: '+81', phoneNumber: '0312345678',
    };
    it('accepts valid', () => { expect(billingAddressUpdateRequestSchema.parse(valid)).toBeTruthy(); });
    it('rejects invalid email', () => {
      expect(() => billingAddressUpdateRequestSchema.parse({ ...valid, email: 'bad' })).toThrow();
    });
  });

  describe('notificationSettingItemSchema', () => {
    it('accepts valid', () => {
      expect(notificationSettingItemSchema.parse({ function_code: 'POST', is_enabled: true, notification_type: '1' })).toBeTruthy();
    });
    it('rejects invalid notification_type', () => {
      expect(() => notificationSettingItemSchema.parse({ function_code: 'POST', is_enabled: true, notification_type: '9' })).toThrow();
    });
  });

  describe('notificationSettingsPayloadSchema', () => {
    it('accepts array', () => {
      expect(notificationSettingsPayloadSchema.parse([
        { function_code: 'POST', is_enabled: true, notification_type: '1' },
      ])).toHaveLength(1);
    });
  });

  describe('contactInquiryRequestSchema', () => {
    it('accepts valid', () => {
      expect(contactInquiryRequestSchema.parse({ subject: '件名', message: '内容' })).toBeTruthy();
    });
    it('rejects empty subject', () => {
      expect(() => contactInquiryRequestSchema.parse({ subject: '', message: '内容' })).toThrow();
    });
  });

  describe('contactInquiryResponseSchema', () => {
    it('accepts valid', () => {
      expect(contactInquiryResponseSchema.parse({ inquiry_id: 'a'.repeat(26), submitted: true })).toBeTruthy();
    });
  });

  describe('executionHistoryListParamsSchema', () => {
    it('accepts empty', () => { expect(executionHistoryListParamsSchema.parse({})).toEqual({}); });
    it('accepts with category', () => { expect(executionHistoryListParamsSchema.parse({ category: '投稿' })).toBeTruthy(); });
  });
});

describe('agreement.schema', () => {
  it('agreementTypeSchema accepts TEMPLATE_LICENSE', () => {
    expect(agreementTypeSchema.parse('TEMPLATE_LICENSE')).toBe('TEMPLATE_LICENSE');
  });
  it('agreementTypeSchema rejects other', () => {
    expect(() => agreementTypeSchema.parse('OTHER')).toThrow();
  });
  it('agreementLogCreateRequestSchema accepts valid', () => {
    expect(agreementLogCreateRequestSchema.parse({
      company_id: 'cid', user_id: 'uid', agreement_type: 'TEMPLATE_LICENSE',
      agreement_version: '1.0.0', agreed_at: '2026-03-14T00:00:00Z',
      template_id: 'tpl01', user_agent: 'Mozilla/5.0',
    })).toBeTruthy();
  });
  it('agreementLogCreateResponseSchema accepts valid', () => {
    expect(agreementLogCreateResponseSchema.parse({ created: true })).toEqual({ created: true });
  });
});
