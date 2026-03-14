import { describe, it, expect } from 'vitest';
import {
  ISSUE_SCREEN_SCALE, PLAN_OPTIONS, INITIAL_ISSUE_FORM,
  PLAN_DETAILS,
} from '../accountsIssue.constants';

describe('accountsIssue.constants', () => {
  it('ISSUE_SCREEN_SCALE is a positive number', () => {
    expect(ISSUE_SCREEN_SCALE).toBeGreaterThan(0);
    expect(typeof ISSUE_SCREEN_SCALE).toBe('number');
  });

  it('PLAN_OPTIONS has 3 plans', () => {
    expect(PLAN_OPTIONS).toEqual(['プレミアムプラン', 'スタンダードプラン', 'ライトプラン']);
  });

  it('INITIAL_ISSUE_FORM has correct defaults', () => {
    expect(INITIAL_ISSUE_FORM.baseName).toBe('');
    expect(INITIAL_ISSUE_FORM.displayName).toBe('');
    expect(INITIAL_ISSUE_FORM.address).toBe('');
    expect(INITIAL_ISSUE_FORM.initialPassword).toBe('');
    expect(INITIAL_ISSUE_FORM.plan).toBe('スタンダードプラン');
    expect(INITIAL_ISSUE_FORM.couponCode).toBe('');
  });

  describe('PLAN_DETAILS', () => {
    it('has all 3 plans', () => {
      expect(Object.keys(PLAN_DETAILS)).toHaveLength(3);
      expect(PLAN_DETAILS).toHaveProperty('プレミアムプラン');
      expect(PLAN_DETAILS).toHaveProperty('スタンダードプラン');
      expect(PLAN_DETAILS).toHaveProperty('ライトプラン');
    });

    it('each plan has monthly, outline, and featureList', () => {
      for (const plan of PLAN_OPTIONS) {
        const detail = PLAN_DETAILS[plan];
        expect(detail.monthly).toBeTruthy();
        expect(detail.outline).toBeTruthy();
        expect(detail.featureList.length).toBeGreaterThan(0);
      }
    });

    it('premium has more features than light', () => {
      expect(PLAN_DETAILS['プレミアムプラン'].featureList.length)
        .toBeGreaterThanOrEqual(PLAN_DETAILS['ライトプラン'].featureList.length);
    });
  });
});
