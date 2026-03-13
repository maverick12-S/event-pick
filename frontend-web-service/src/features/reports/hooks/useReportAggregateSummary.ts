import { useMemo } from 'react';
import reportSummaryMockApi from '../../../api/mock/reportSummaryMockApi';
import type { ReportListItem } from '../../../types/models/report';

const useReportAggregateSummary = (rows: ReportListItem[]) => {
  return useMemo(() => reportSummaryMockApi.buildSummary(rows), [rows]);
};

export default useReportAggregateSummary;
