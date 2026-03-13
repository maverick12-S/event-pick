import { useQuery } from '@tanstack/react-query';
import reportDetailMockApi from '../../../api/mock/reportDetailMockApi';

export const useReportDetailMock = (reportId: string) => {
  return useQuery({
    queryKey: ['mock', 'report-detail', reportId],
    queryFn: () => reportDetailMockApi.getById(reportId),
    enabled: Boolean(reportId),
    staleTime: 60 * 1000,
  });
};

export default useReportDetailMock;
