import type { ReportListItem } from '../../types/models/report';
import type { ReportAggregateSummary } from '../../types/models/reportSummary';
import { reportDetailDb } from '../db/reportDetail.screen';

export type { ReportAggregateSummary } from '../../types/models/reportSummary';

export const reportSummaryMockApi = {
  buildSummary: (rows: ReportListItem[]): ReportAggregateSummary => {
    const detailById = new Map(reportDetailDb.map((item) => [item.id, item]));

    const totalPosts = rows.length;
    const totalImpressions = rows.reduce((sum, item) => sum + item.views * 2, 0);
    const totalViews = rows.reduce((sum, item) => sum + item.views, 0);
    const totalLikes = rows.reduce((sum, item) => sum + item.likes, 0);

    const totalFavorites = rows.reduce((sum, item) => {
      const detail = detailById.get(item.id);
      return sum + (detail?.favoritesCount ?? Math.max(0, Math.round(item.likes * 0.38)));
    }, 0);

    // User-level source is pending; keep same temporary behavior.
    const totalUsersWhoFavoriteCompanies = totalFavorites;

    return {
      totalPosts,
      totalImpressions,
      totalViews,
      totalLikes,
      totalFavorites,
      totalUsersWhoFavoriteCompanies,
    };
  },
};

export default reportSummaryMockApi;
