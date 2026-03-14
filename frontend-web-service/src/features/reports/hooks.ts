import { useQuery } from '@tanstack/react-query';
import openapiClient from '../../api/openapiClient';
import type { ReportSummary } from '../../api/openapiClient';
import { queryKeys } from '../../api/queryKeys';

export const useReports = (params: { from: string; to: string; companyAccountId?: string; groupBy?: 'day' | 'week' | 'month'; metrics?: string[] } | null) => {
  return useQuery<ReportSummary>({
    queryKey: [...queryKeys.reports, params],
    queryFn: () => openapiClient.getReportSummary(params as any),
    enabled: !!params && !!params.from && !!params.to,
    staleTime: 60 * 1000,
  });
};

export default useReports;
