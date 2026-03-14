import { describe, it, expect } from 'vitest';
import {
  accountStatusSchema,
  contractPlanSchema,
  baseAccountItemSchema,
  accountIssueRequestSchema,
  accountIssueResponseSchema,
  accountUpdateRequestSchema,
  accountDeleteRequestSchema,
  accountCancelDeletionRequestSchema,
  accountListParamsSchema,
  accountDetailResponseSchema,
} from '../account.schema';

describe('account.schema', () => {
  describe('accountStatusSchema', () => {
    it.each(['利用中', '停止中', '削除予定'])('accepts "%s"', (v) => {
      expect(accountStatusSchema.parse(v)).toBe(v);
    });
    it('rejects invalid status', () => {
      expect(() => accountStatusSchema.parse('無効')).toThrow();
    });
  });

  describe('contractPlanSchema', () => {
    it.each(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン'])('accepts "%s"', (v) => {
      expect(contractPlanSchema.parse(v)).toBe(v);
    });
    it('rejects invalid plan', () => {
      expect(() => contractPlanSchema.parse('フリー')).toThrow();
    });
  });

  describe('baseAccountItemSchema', () => {
    const valid = {
      id: '1', companyCode: 'C001', baseName: '渋谷拠点',
      accountId: 'A001', status: '利用中' as const, plan: 'スタンダードプラン' as const,
    };
    it('accepts valid data', () => {
      expect(baseAccountItemSchema.parse(valid)).toEqual(valid);
    });
    it('accepts with optional scheduledDeletionAt', () => {
      expect(baseAccountItemSchema.parse({ ...valid, scheduledDeletionAt: '2026-04-01' })).toBeTruthy();
    });
    it('rejects empty id', () => {
      expect(() => baseAccountItemSchema.parse({ ...valid, id: '' })).toThrow();
    });
  });

  describe('accountIssueRequestSchema', () => {
    const valid = {
      branch_name: '新宿拠点', prefecture_code: '13', city: '新宿区',
      initial_password: 'Abcdefg1', plan_code: 'STANDARD', company_role_id: '01' as const,
    };
    it('accepts valid minimal data', () => {
      expect(accountIssueRequestSchema.parse(valid)).toMatchObject(valid);
    });
    it('accepts optional fields', () => {
      const full = {
        ...valid, branch_display_name: '新宿', postal_code: '1600022',
        address_line: '1-1-1', contact_email: 'a@b.com', phone_number: '09012345678',
        coupon_code: 'C100',
      };
      expect(accountIssueRequestSchema.parse(full)).toBeTruthy();
    });
    it('rejects invalid postal_code format', () => {
      expect(() => accountIssueRequestSchema.parse({ ...valid, postal_code: '123' })).toThrow();
    });
    it('rejects branch_name over 40 chars', () => {
      expect(() => accountIssueRequestSchema.parse({ ...valid, branch_name: 'x'.repeat(41) })).toThrow();
    });
    it('rejects invalid company_role_id', () => {
      expect(() => accountIssueRequestSchema.parse({ ...valid, company_role_id: '99' })).toThrow();
    });
  });

  describe('accountIssueResponseSchema', () => {
    it('accepts valid response', () => {
      const v = { company_account_id: 'uuid-123', branch_code: 'BR001' };
      expect(accountIssueResponseSchema.parse(v)).toEqual(v);
    });
    it('rejects empty company_account_id', () => {
      expect(() => accountIssueResponseSchema.parse({ company_account_id: '', branch_code: 'BR' })).toThrow();
    });
  });

  describe('accountUpdateRequestSchema', () => {
    const valid = {
      branch_name: '拠点A', prefecture_code: '13', city: '渋谷区', status: '1' as const,
    };
    it('accepts valid data', () => {
      expect(accountUpdateRequestSchema.parse(valid)).toMatchObject(valid);
    });
    it('rejects invalid status', () => {
      expect(() => accountUpdateRequestSchema.parse({ ...valid, status: '9' })).toThrow();
    });
  });

  describe('accountDeleteRequestSchema', () => {
    it('accepts valid', () => {
      expect(accountDeleteRequestSchema.parse({ company_account_id: 'abc' })).toBeTruthy();
    });
    it('rejects empty', () => {
      expect(() => accountDeleteRequestSchema.parse({ company_account_id: '' })).toThrow();
    });
  });

  describe('accountCancelDeletionRequestSchema', () => {
    it('accepts valid', () => {
      expect(accountCancelDeletionRequestSchema.parse({ company_account_id: 'abc' })).toBeTruthy();
    });
  });

  describe('accountListParamsSchema', () => {
    it('accepts empty object', () => {
      expect(accountListParamsSchema.parse({})).toEqual({});
    });
    it('accepts full params', () => {
      expect(accountListParamsSchema.parse({ query: 'test', sortBy: 'baseName', page: 1, perPage: 20 })).toBeTruthy();
    });
    it('rejects invalid sortBy', () => {
      expect(() => accountListParamsSchema.parse({ sortBy: 'invalid' })).toThrow();
    });
    it('rejects perPage over 100', () => {
      expect(() => accountListParamsSchema.parse({ perPage: 101 })).toThrow();
    });
  });

  describe('accountDetailResponseSchema', () => {
    const valid = {
      company_account_id: 'id1', branch_code: 'BR01', branch_name: '拠点',
      prefecture_code: '13', city: '新宿', plan_code: 'STANDARD',
      status: '1' as const, company_role_id: '01' as const,
    };
    it('accepts valid', () => {
      expect(accountDetailResponseSchema.parse(valid)).toMatchObject(valid);
    });
  });
});
