import { keepPreviousData, useQuery } from '@tanstack/react-query';
import reportsMockApi, { type GetReportsParams } from '../../../api/mock/reportsMockApi';

export const useReportsMock = (params: GetReportsParams) => {
  return useQuery({
    queryKey: ['mock', 'reports', params],
    queryFn: () => reportsMockApi.getReports(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useReportsMock;
