import { describe, it, expect } from 'vitest';
import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
  it('has auth key', () => {
    expect(queryKeys.auth).toEqual(['auth']);
  });

  it('has companies key', () => {
    expect(queryKeys.companies).toEqual(['companies']);
  });

  it('company() creates parameterized key', () => {
    expect(queryKeys.company('c1')).toEqual(['company', 'c1']);
  });

  it('has events key', () => {
    expect(queryKeys.events).toEqual(['events']);
  });

  it('event() creates parameterized key', () => {
    expect(queryKeys.event('e1')).toEqual(['event', 'e1']);
  });

  it('has user() and users keys', () => {
    expect(queryKeys.users).toEqual(['users']);
    expect(queryKeys.user('u1')).toEqual(['user', 'u1']);
  });

  it('reportSummary creates key with params', () => {
    const params = { from: '2026-01-01', to: '2026-03-31' };
    expect(queryKeys.reportSummary(params)).toEqual(['reports', 'summary', params]);
  });

  it('has admin namespace', () => {
    expect(queryKeys.admin.dashboard).toEqual(['admin', 'dashboard']);
    expect(queryKeys.admin.consumers).toEqual(['admin', 'consumers']);
    expect(queryKeys.admin.locationAccounts).toEqual(['admin', 'locationAccounts']);
    expect(queryKeys.admin.users).toEqual(['admin', 'users']);
    expect(queryKeys.admin.coupons).toEqual(['admin', 'coupons']);
    expect(queryKeys.admin.categories).toEqual(['admin', 'categories']);
    expect(queryKeys.admin.inquiries).toEqual(['admin', 'inquiries']);
    expect(queryKeys.admin.reviews).toEqual(['admin', 'reviews']);
    expect(queryKeys.admin.authLogs).toEqual(['admin', 'authLogs']);
    expect(queryKeys.admin.activityLogs).toEqual(['admin', 'activityLogs']);
    expect(queryKeys.admin.settings).toEqual(['admin', 'settings']);
  });

  it('has posts related keys', () => {
    expect(queryKeys.posts).toEqual(['posts']);
    expect(queryKeys.postDrafts).toEqual(['posts', 'drafts']);
    expect(queryKeys.postScheduled).toEqual(['posts', 'scheduled']);
  });

  it('has other domain keys', () => {
    expect(queryKeys.notifications).toEqual(['notifications']);
    expect(queryKeys.billing).toEqual(['billing']);
    expect(queryKeys.tickets).toEqual(['tickets']);
    expect(queryKeys.settings).toEqual(['settings']);
    expect(queryKeys.plans).toEqual(['plans']);
    expect(queryKeys.agreementLogs).toEqual(['agreement-logs']);
  });

  it('keys are arrays', () => {
    expect(Array.isArray(queryKeys.auth)).toBe(true);
  });
});
