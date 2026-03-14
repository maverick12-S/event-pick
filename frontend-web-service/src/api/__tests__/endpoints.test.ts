import { describe, it, expect } from 'vitest';
import endpoints, { API_PREFIX } from '../endpoints';

describe('endpoints', () => {
  it('API_PREFIX is /api/v1', () => {
    expect(API_PREFIX).toBe('/api/v1');
  });

  describe('auth endpoints', () => {
    it('authLogin', () => expect(endpoints.authLogin).toBe('/api/v1/auth/login'));
    it('authLogout', () => expect(endpoints.authLogout).toBe('/api/v1/auth/logout'));
    it('authRefresh', () => expect(endpoints.authRefresh).toBe('/api/v1/auth/refresh'));
    it('authSignup', () => expect(endpoints.authSignup).toBe('/api/v1/auth/signup'));
    it('authMfaVerify', () => expect(endpoints.authMfaVerify).toBe('/api/v1/auth/mfa/verify'));
    it('authPasswordReset', () => expect(endpoints.authPasswordReset).toBe('/api/v1/auth/password-reset'));
    it('authPasswordChange', () => expect(endpoints.authPasswordChange).toBe('/api/v1/auth/password-change'));
  });

  describe('parameterized endpoints', () => {
    it('companyAccount(id)', () => expect(endpoints.companyAccount('acc1')).toBe('/api/v1/company-accounts/acc1'));
    it('company(id)', () => expect(endpoints.company('c1')).toBe('/api/v1/companies/c1'));
    it('event(id)', () => expect(endpoints.event('e1')).toBe('/api/v1/events/e1'));
    it('user(id)', () => expect(endpoints.user('u1')).toBe('/api/v1/users/u1'));
    it('reportByAccount(id)', () => expect(endpoints.reportByAccount('a1')).toBe('/api/v1/reports/a1'));
    it('reportByAccountEvent(a,e)', () => expect(endpoints.reportByAccountEvent('a1', 'e1')).toBe('/api/v1/reports/a1/e1'));
    it('eventPublish(id)', () => expect(endpoints.eventPublish('e1')).toBe('/api/v1/events/e1/publish'));
    it('notificationRead(id)', () => expect(endpoints.notificationRead('n1')).toBe('/api/v1/notifications/n1/read'));
  });

  describe('admin endpoints', () => {
    it('admin.companies', () => expect(endpoints.admin.companies).toBe('/api/v1/admin/companies'));
    it('admin.company(id)', () => expect(endpoints.admin.company('c1')).toBe('/api/v1/admin/companies/c1'));
    it('admin.users', () => expect(endpoints.admin.users).toBe('/api/v1/admin/users'));
    it('admin.inquiryReply(id)', () => expect(endpoints.admin.inquiryReply('i1')).toBe('/api/v1/admin/inquiries/i1/reply'));
    it('admin.category(id)', () => expect(endpoints.admin.category('cat1')).toBe('/api/v1/admin/categories/cat1'));
  });

  describe('master endpoints', () => {
    it('master.prefectures', () => expect(endpoints.master.prefectures).toBe('/api/v1/master/prefectures'));
    it('master.region(id)', () => expect(endpoints.master.region('r1')).toBe('/api/v1/admin/master/regions/r1'));
  });

  describe('other static endpoints', () => {
    it('agreementLogs', () => expect(endpoints.agreementLogs).toBe('/api/v1/agreement-logs'));
    it('tickets', () => expect(endpoints.tickets).toBe('/api/v1/tickets'));
    it('billingRoot', () => expect(endpoints.billingRoot).toBe('/api/v1/billing'));
    it('executionHistory', () => expect(endpoints.executionHistory).toBe('/api/v1/execution-history'));
    it('adminSettings', () => expect(endpoints.adminSettings).toBe('/api/v1/admin/settings'));
    it('adminConsumers', () => expect(endpoints.adminConsumers).toBe('/api/v1/admin/consumers'));
    it('adminLocationAccounts', () => expect(endpoints.adminLocationAccounts).toBe('/api/v1/admin/location-accounts'));
  });

  describe('admin consumer/location parameterized', () => {
    it('adminConsumerSuspend(id)', () => expect(endpoints.adminConsumerSuspend('u1')).toBe('/api/v1/admin/consumers/u1/suspend'));
    it('adminLocationAccountDeleteSchedule(id)', () => expect(endpoints.adminLocationAccountDeleteSchedule('c1')).toBe('/api/v1/admin/location-accounts/c1/delete-schedule'));
  });
});
