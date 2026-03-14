import { describe, it, expect } from 'vitest';
import {
  postCreateRequestSchema, postCreateResponseSchema,
  postSearchParamsSchema, postDetailEditRequestSchema,
  scheduledPostUpdateRequestSchema, scheduledPostListParamsSchema,
} from '../post.schema';

describe('post.schema', () => {
  describe('postCreateRequestSchema', () => {
    const valid = {
      title: 'イベント', image_urls: ['https://img.example.com/1.jpg'],
      summary: '概要テスト', category_id: 'cat01', scheduled_dates: ['2026-04-01'],
    };
    it('accepts valid minimal', () => {
      expect(postCreateRequestSchema.parse(valid)).toMatchObject(valid);
    });
    it('accepts with all optional fields', () => {
      const full = {
        ...valid, description: '詳細', reservation_url: 'https://reserve.example.com',
        location_id: 'loc01', venue_name: '会場A',
        event_start_time: '14:30', event_end_time: '21:00',
      };
      expect(postCreateRequestSchema.parse(full)).toBeTruthy();
    });
    it('rejects empty title', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, title: '' })).toThrow();
    });
    it('rejects title over 20 chars', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, title: 'あ'.repeat(21) })).toThrow();
    });
    it('rejects empty image_urls', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, image_urls: [] })).toThrow();
    });
    it('rejects more than 3 images', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, image_urls: ['a', 'b', 'c', 'd'] })).toThrow();
    });
    it('rejects empty scheduled_dates', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, scheduled_dates: [] })).toThrow();
    });
    it('rejects invalid date format', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, scheduled_dates: ['2026/04/01'] })).toThrow();
    });
    it('accepts multiple dates', () => {
      expect(postCreateRequestSchema.parse({ ...valid, scheduled_dates: ['2026-04-01', '2026-04-02'] })).toBeTruthy();
    });
    it('validates time format HH:MM', () => {
      expect(postCreateRequestSchema.parse({ ...valid, event_start_time: '09:00' })).toBeTruthy();
    });
    it('validates time format HH:MM:SS', () => {
      expect(postCreateRequestSchema.parse({ ...valid, event_start_time: '09:00:30' })).toBeTruthy();
    });
    it('rejects invalid time format', () => {
      expect(() => postCreateRequestSchema.parse({ ...valid, event_start_time: '9am' })).toThrow();
    });
  });

  describe('postCreateResponseSchema', () => {
    it('accepts valid', () => {
      expect(postCreateResponseSchema.parse({
        template_id: 'a'.repeat(26), schedule_ids: ['b'.repeat(26)],
      })).toBeTruthy();
    });
    it('rejects invalid template_id length', () => {
      expect(() => postCreateResponseSchema.parse({ template_id: 'short', schedule_ids: [] })).toThrow();
    });
  });

  describe('postSearchParamsSchema', () => {
    it('accepts empty', () => {
      expect(postSearchParamsSchema.parse({})).toEqual({});
    });
    it('accepts full', () => {
      expect(postSearchParamsSchema.parse({
        title: 'test', category_ids: ['c1'], tab: 'today', sortBy: 'newest',
        date_from: '2026-01-01', date_to: '2026-12-31', page: 1, perPage: 20,
      })).toBeTruthy();
    });
    it('rejects invalid tab', () => {
      expect(() => postSearchParamsSchema.parse({ tab: 'invalid' })).toThrow();
    });
    it('rejects invalid sortBy', () => {
      expect(() => postSearchParamsSchema.parse({ sortBy: 'invalid' })).toThrow();
    });
  });

  describe('postDetailEditRequestSchema', () => {
    it('accepts empty (all optional)', () => {
      expect(postDetailEditRequestSchema.parse({})).toEqual({});
    });
    it('accepts partial', () => {
      expect(postDetailEditRequestSchema.parse({ title: 'New', status: '2' })).toBeTruthy();
    });
    it('rejects invalid status', () => {
      expect(() => postDetailEditRequestSchema.parse({ status: '9' })).toThrow();
    });
  });

  describe('scheduledPostUpdateRequestSchema', () => {
    it('accepts empty', () => {
      expect(scheduledPostUpdateRequestSchema.parse({})).toEqual({});
    });
    it('accepts with dates', () => {
      expect(scheduledPostUpdateRequestSchema.parse({ scheduled_dates: ['2026-05-01'] })).toBeTruthy();
    });
  });

  describe('scheduledPostListParamsSchema', () => {
    it('accepts empty', () => {
      expect(scheduledPostListParamsSchema.parse({})).toEqual({});
    });
    it('accepts with filters', () => {
      expect(scheduledPostListParamsSchema.parse({
        company_account_id: 'uuid', title: 'test', page: 1, perPage: 50,
      })).toBeTruthy();
    });
  });
});
