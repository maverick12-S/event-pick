import { useMemo } from 'react';
import reportSummaryMockApi from '../../../api/mock/reportSummaryMockApi';
import type { ReportListItem } from '../../../api/db/reports.screen';

const useReportAggregateSummary = (rows: ReportListItem[]) => {
  return useMemo(() => reportSummaryMockApi.buildSummary(rows), [rows]);
};

export default useReportAggregateSummary;
