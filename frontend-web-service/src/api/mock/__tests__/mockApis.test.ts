import { describe, it, expect } from 'vitest';
import { postsMockApi } from '../postsMockApi';
import reportsMockApi from '../reportsMockApi';
import { accountsMockApi } from '../accountsMockApi';
import billingMockApi from '../billingMockApi';
import executionHistoryMockApi from '../executionHistoryMockApi';
import { postManagementMockApi } from '../postManagementMockApi';

describe('postsMockApi', () => {
  it('getPosts returns paginated data for today tab', async () => {
    const result = await postsMockApi.getPosts({ tab: 'today' });
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('totalPages');
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.page).toBe(1);
  });

  it('getPosts returns data for tomorrow tab', async () => {
    const result = await postsMockApi.getPosts({ tab: 'tomorrow' });
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('getPosts supports pagination', async () => {
    const page1 = await postsMockApi.getPosts({ tab: 'today', page: 1, limit: 5 });
    expect(page1.items.length).toBeLessThanOrEqual(5);
    expect(page1.page).toBe(1);
  });

  it('getPosts supports search filter', async () => {
    const result = await postsMockApi.getPosts({ tab: 'today', search: 'xxx-no-match-xxx' });
    expect(result.total).toBe(0);
  });

  it('getPosts supports sort', async () => {
    const result = await postsMockApi.getPosts({ tab: 'today', sortBy: 'titleAsc' });
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe('reportsMockApi', () => {
  it('getReports returns array', async () => {
    const result = await reportsMockApi.getReports({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('accountsMockApi', () => {
  it('getAccounts returns data', async () => {
    const result = await accountsMockApi.getAccounts({ query: '', sortBy: 'name-asc' });
    expect(result).toHaveProperty('items');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('getAccounts supports search and sort', async () => {
    const result = await accountsMockApi.getAccounts({ query: 'test', sortBy: 'name-asc' });
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe('billingMockApi', () => {
  it('getBillingData returns billing structure', async () => {
    const result = await billingMockApi.getBillingData();
    expect(result).toHaveProperty('company');
    expect(result).toHaveProperty('subscription');
    expect(result).toHaveProperty('paymentMethods');
    expect(result).toHaveProperty('billingAddress');
    expect(result).toHaveProperty('invoices');
  });
});

describe('executionHistoryMockApi', () => {
  it('getHistories returns array', async () => {
    const result = await executionHistoryMockApi.getHistories();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('postManagementMockApi', () => {
  it('listPostDrafts returns array', () => {
    const result = postManagementMockApi.listPostDrafts();
    expect(Array.isArray(result)).toBe(true);
  });

  it('listScheduledPosts returns array', () => {
    const result = postManagementMockApi.listScheduledPosts();
    expect(Array.isArray(result)).toBe(true);
  });
});
