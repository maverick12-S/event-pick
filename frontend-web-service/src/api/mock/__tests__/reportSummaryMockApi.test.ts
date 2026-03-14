import { describe, it, expect } from 'vitest';
import reportSummaryMockApi from '../reportSummaryMockApi';
import type { ReportListItem } from '../../../types/models/report';

describe('reportSummaryMockApi.buildSummary', () => {
  const makeRow = (overrides: Partial<ReportListItem> = {}): ReportListItem => ({
    id: `r-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Test',
    eventName: 'Test Event',
    postedAt: '2026-01-01',
    views: 100,
    likes: 10,
    status: 'published',
    ...overrides,
  } as ReportListItem);

  it('returns zeros for empty rows', () => {
    const summary = reportSummaryMockApi.buildSummary([]);
    expect(summary.totalPosts).toBe(0);
    expect(summary.totalImpressions).toBe(0);
    expect(summary.totalViews).toBe(0);
    expect(summary.totalLikes).toBe(0);
    expect(summary.totalFavorites).toBe(0);
  });

  it('calculates totalPosts as row count', () => {
    const rows = [makeRow(), makeRow(), makeRow()];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary.totalPosts).toBe(3);
  });

  it('calculates totalViews from views field', () => {
    const rows = [makeRow({ views: 50 }), makeRow({ views: 30 })];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary.totalViews).toBe(80);
  });

  it('calculates totalImpressions as views * 2', () => {
    const rows = [makeRow({ views: 100 })];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary.totalImpressions).toBe(200);
  });

  it('calculates totalLikes from likes field', () => {
    const rows = [makeRow({ likes: 5 }), makeRow({ likes: 15 })];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary.totalLikes).toBe(20);
  });

  it('returns totalFavorites >= 0', () => {
    const rows = [makeRow({ views: 100, likes: 10 })];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary.totalFavorites).toBeGreaterThanOrEqual(0);
  });

  it('returns all expected summary fields', () => {
    const rows = [makeRow()];
    const summary = reportSummaryMockApi.buildSummary(rows);
    expect(summary).toHaveProperty('totalPosts');
    expect(summary).toHaveProperty('totalImpressions');
    expect(summary).toHaveProperty('totalViews');
    expect(summary).toHaveProperty('totalLikes');
    expect(summary).toHaveProperty('totalFavorites');
    expect(summary).toHaveProperty('totalUsersWhoFavoriteCompanies');
  });
});
