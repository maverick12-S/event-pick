import { describe, it, expect } from 'vitest';
import {
  adminCouponCreateRequestSchema, adminCouponCreateResponseSchema,
  adminCategoryCreateRequestSchema, adminCategoryDeleteRequestSchema,
  adminInquiryReplyRequestSchema, adminInquiryCloseRequestSchema,
  adminReviewApproveRequestSchema, adminReviewRejectRequestSchema,
  adminConsumerSuspendRequestSchema, adminConsumerDeleteScheduleRequestSchema,
  adminLocationAccountSuspendRequestSchema, adminLocationAccountDeleteScheduleRequestSchema,
  adminSettingsUpdateRequestSchema,
  adminUsersParamsSchema, adminAuthLogsParamsSchema, adminActivityLogsParamsSchema,
} from '../admin.schema';

const ulid26 = 'a'.repeat(26);

describe('admin.schema', () => {
  describe('adminCouponCreateRequestSchema', () => {
    const valid = { coupon_code: 'SAVE20', target_type: '1' as const, discount_type: '1' as const };
    it('accepts valid', () => { expect(adminCouponCreateRequestSchema.parse(valid)).toMatchObject(valid); });
    it('accepts with free_days', () => { expect(adminCouponCreateRequestSchema.parse({ ...valid, free_days: 30 })).toBeTruthy(); });
    it('rejects empty coupon_code', () => { expect(() => adminCouponCreateRequestSchema.parse({ ...valid, coupon_code: '' })).toThrow(); });
    it('rejects coupon_code over 20', () => { expect(() => adminCouponCreateRequestSchema.parse({ ...valid, coupon_code: 'x'.repeat(21) })).toThrow(); });
    it('rejects invalid target_type', () => { expect(() => adminCouponCreateRequestSchema.parse({ ...valid, target_type: '3' })).toThrow(); });
  });

  describe('adminCouponCreateResponseSchema', () => {
    it('accepts valid', () => { expect(adminCouponCreateResponseSchema.parse({ coupon_id: ulid26 })).toBeTruthy(); });
    it('rejects wrong length', () => { expect(() => adminCouponCreateResponseSchema.parse({ coupon_id: 'short' })).toThrow(); });
  });

  describe('adminCategoryCreateRequestSchema', () => {
    it('accepts valid', () => { expect(adminCategoryCreateRequestSchema.parse({ name: '音楽' })).toBeTruthy(); });
    it('rejects empty', () => { expect(() => adminCategoryCreateRequestSchema.parse({ name: '' })).toThrow(); });
    it('rejects over 20', () => { expect(() => adminCategoryCreateRequestSchema.parse({ name: 'x'.repeat(21) })).toThrow(); });
  });

  describe('adminCategoryDeleteRequestSchema', () => {
    it('accepts valid', () => { expect(adminCategoryDeleteRequestSchema.parse({ categoryId: 'c1' })).toBeTruthy(); });
  });

  describe('adminInquiryReplyRequestSchema', () => {
    const valid = {
      inquiry_id: ulid26, inquiry_type: '1' as const, inquiry_status: '2' as const,
      message: '返信内容', admin_user_id: ulid26,
    };
    it('accepts valid', () => { expect(adminInquiryReplyRequestSchema.parse(valid)).toBeTruthy(); });
    it('rejects message over 1500', () => { expect(() => adminInquiryReplyRequestSchema.parse({ ...valid, message: 'x'.repeat(1501) })).toThrow(); });
  });

  describe('adminInquiryCloseRequestSchema', () => {
    it('accepts valid', () => { expect(adminInquiryCloseRequestSchema.parse({ inquiry_id: ulid26, inquiry_status: '3' })).toBeTruthy(); });
    it('rejects non-3 status', () => { expect(() => adminInquiryCloseRequestSchema.parse({ inquiry_id: ulid26, inquiry_status: '1' })).toThrow(); });
  });

  describe('adminReviewApproveRequestSchema', () => {
    const valid = { review_id: ulid26, company_id: ulid26, review_status: '2' as const, reviewer_id: ulid26 };
    it('accepts valid', () => { expect(adminReviewApproveRequestSchema.parse(valid)).toBeTruthy(); });
    it('rejects non-2 status', () => { expect(() => adminReviewApproveRequestSchema.parse({ ...valid, review_status: '3' })).toThrow(); });
  });

  describe('adminReviewRejectRequestSchema', () => {
    const valid = { review_id: ulid26, company_id: ulid26, review_status: '3' as const, review_comment: '理由', reviewer_id: ulid26 };
    it('accepts valid', () => { expect(adminReviewRejectRequestSchema.parse(valid)).toBeTruthy(); });
    it('rejects status 2', () => { expect(() => adminReviewRejectRequestSchema.parse({ ...valid, review_status: '2' })).toThrow(); });
    it('rejects empty comment', () => { expect(() => adminReviewRejectRequestSchema.parse({ ...valid, review_comment: '' })).toThrow(); });
  });

  describe('adminConsumerSuspendRequestSchema', () => {
    it('accepts valid', () => { expect(adminConsumerSuspendRequestSchema.parse({ userId: 'u1' })).toBeTruthy(); });
  });

  describe('adminConsumerDeleteScheduleRequestSchema', () => {
    it('accepts valid', () => { expect(adminConsumerDeleteScheduleRequestSchema.parse({ userId: 'u1', deleteScheduledAt: '2026-04-01' })).toBeTruthy(); });
    it('rejects invalid date', () => { expect(() => adminConsumerDeleteScheduleRequestSchema.parse({ userId: 'u1', deleteScheduledAt: 'bad' })).toThrow(); });
  });

  describe('adminLocationAccountSuspendRequestSchema', () => {
    it('accepts valid', () => { expect(adminLocationAccountSuspendRequestSchema.parse({ companyId: 'c1' })).toBeTruthy(); });
  });

  describe('adminLocationAccountDeleteScheduleRequestSchema', () => {
    it('accepts valid', () => { expect(adminLocationAccountDeleteScheduleRequestSchema.parse({ companyId: 'c1', deleteScheduledAt: '2026-05-01' })).toBeTruthy(); });
  });

  describe('adminSettingsUpdateRequestSchema', () => {
    const valid = {
      account: { displayName: 'Admin', username: 'admin', email: 'a@b.com' },
      site: { siteName: 'EP', siteUrl: 'https://ep.com', adminEmail: 'a@b.com', supportEmail: 's@b.com', timezone: 'Asia/Tokyo' as const, language: 'ja' as const },
      notifications: { emailNewReview: true, emailNewInquiry: false, emailDailyReport: true, emailWeeklyReport: false },
      security: { twoFactorRequired: true, sessionTimeoutMin: 30, maxLoginAttempts: 5, passwordMinLength: 8 },
    };
    it('accepts valid', () => { expect(adminSettingsUpdateRequestSchema.parse(valid)).toBeTruthy(); });
    it('rejects invalid timezone', () => {
      expect(() => adminSettingsUpdateRequestSchema.parse({ ...valid, site: { ...valid.site, timezone: 'Mars' } })).toThrow();
    });
  });

  describe('adminUsersParamsSchema', () => {
    it('accepts empty', () => { expect(adminUsersParamsSchema.parse({})).toEqual({}); });
    it('accepts full', () => { expect(adminUsersParamsSchema.parse({ search: 'q', status: 'active', page: 1, perPage: 20 })).toBeTruthy(); });
    it('rejects invalid status', () => { expect(() => adminUsersParamsSchema.parse({ status: 'bad' })).toThrow(); });
  });

  describe('adminAuthLogsParamsSchema', () => {
    it('accepts empty', () => { expect(adminAuthLogsParamsSchema.parse({})).toEqual({}); });
    it('accepts full', () => { expect(adminAuthLogsParamsSchema.parse({ status: 'success', method: 'cookie', page: 1 })).toBeTruthy(); });
  });

  describe('adminActivityLogsParamsSchema', () => {
    it('accepts empty', () => { expect(adminActivityLogsParamsSchema.parse({})).toEqual({}); });
    it('accepts with category', () => { expect(adminActivityLogsParamsSchema.parse({ category: '審査' })).toBeTruthy(); });
  });
});
