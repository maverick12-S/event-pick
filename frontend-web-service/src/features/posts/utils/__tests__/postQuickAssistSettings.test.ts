import { describe, it, expect } from 'vitest';
import { getPostQuickAssistSettings, ASSIST_NONE_VALUE, DEFAULT_APPLY_FIELDS } from '../postQuickAssistSettings';
import type { PostQuickAssistSettings, AssistFieldKey } from '../postQuickAssistSettings';

describe('postQuickAssistSettings', () => {
  describe('ASSIST_NONE_VALUE', () => {
    it('is empty string', () => {
      expect(ASSIST_NONE_VALUE).toBe('');
    });
  });

  describe('DEFAULT_APPLY_FIELDS', () => {
    it('contains all 6 default fields', () => {
      expect(DEFAULT_APPLY_FIELDS).toEqual(['summary', 'detail', 'budget', 'startTime', 'endTime', 'reservation']);
    });
  });

  describe('getPostQuickAssistSettings', () => {
    let settings: PostQuickAssistSettings;

    beforeAll(() => {
      settings = getPostQuickAssistSettings();
    });

    it('returns templates array', () => {
      expect(settings.templates).toBeDefined();
      expect(settings.templates.length).toBeGreaterThan(0);
    });

    it('each template has required fields', () => {
      for (const t of settings.templates) {
        expect(t.key).toBeTruthy();
        expect(t.label).toBeTruthy();
        expect(t.summary).toBeTruthy();
        expect(typeof t.buildDetail).toBe('function');
        expect(typeof t.reservationHint).toBe('string');
      }
    });

    it('first template is event-standard', () => {
      expect(settings.templates[0].key).toBe('event-standard');
    });

    it('buildDetail returns string with context', () => {
      const ctx = {
        title: 'テスト', category: '音楽', venueName: '公園',
        address: '渋谷', startTime: '14:00', endTime: '20:00', budget: '無料',
      };
      for (const t of settings.templates) {
        const detail = t.buildDetail(ctx);
        expect(typeof detail).toBe('string');
        expect(detail.length).toBeGreaterThan(0);
      }
    });

    it('returns eventTimes array', () => {
      expect(settings.eventTimes.length).toBeGreaterThan(0);
      for (const et of settings.eventTimes) {
        expect(et.key).toBeTruthy();
        expect(et.startTime).toMatch(/^\d{2}:\d{2}$/);
        expect(et.endTime).toMatch(/^\d{2}:\d{2}$/);
      }
    });

    it('returns budgets array', () => {
      expect(settings.budgets.length).toBeGreaterThan(0);
      for (const b of settings.budgets) {
        expect(b.key).toBeTruthy();
        expect(b.label).toBeTruthy();
        expect(b.value).toBeTruthy();
      }
    });

    it('returns fieldOptions array', () => {
      expect(settings.fieldOptions.length).toBe(6);
      const keys = settings.fieldOptions.map(o => o.key);
      expect(keys).toContain('summary');
      expect(keys).toContain('detail');
      expect(keys).toContain('budget');
    });
  });
});
