import { reportRowsDb } from '../db/reports.screen';
import type { ReportListItem, ReportSortKey } from '../../types/models/report';

export interface GetReportsParams {
  from?: string;
  to?: string;
  accountId?: string;
  sortBy?: ReportSortKey;
}

const sortRows = (rows: ReportListItem[], sortBy: ReportSortKey): ReportListItem[] => {
  return [...rows].sort((a, b) => {
    switch (sortBy) {
      case 'postedAtAsc':
        return a.postedAt.localeCompare(b.postedAt);
      case 'viewsDesc':
        return b.views - a.views;
      case 'likesDesc':
        return b.likes - a.likes;
      case 'titleAsc':
        return a.title.localeCompare(b.title, 'ja');
      case 'postedAtDesc':
      default:
        return b.postedAt.localeCompare(a.postedAt);
    }
  });
};

export const reportsMockApi = {
  getReports: async (params: GetReportsParams): Promise<ReportListItem[]> => {
    const from = params.from ? new Date(params.from).getTime() : null;
    const to = params.to ? new Date(params.to).getTime() : null;
    const accountQuery = (params.accountId ?? '').trim().toLowerCase();

    const filtered = reportRowsDb.filter((item) => {
      const postedAt = new Date(item.postedAt).getTime();
      const inRange = (from === null || postedAt >= from) && (to === null || postedAt <= to);
      const byAccount = !accountQuery || item.accountId.toLowerCase().includes(accountQuery);
      return inRange && byAccount;
    });

    const sorted = sortRows(filtered, params.sortBy ?? 'postedAtDesc');
    return Promise.resolve(sorted.map((item) => ({ ...item })));
  },
};

export default reportsMockApi;
