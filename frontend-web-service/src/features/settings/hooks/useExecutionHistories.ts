import { useQuery } from '@tanstack/react-query';
import executionHistoryMockApi from '../../../api/mock/executionHistoryMockApi';
import type { ExecutionHistoryItem } from '../../../types/models/executionHistory';

export const useExecutionHistories = () => {
  return useQuery<ExecutionHistoryItem[]>({
    queryKey: ['executionHistory'],
    queryFn: () => executionHistoryMockApi.getHistories(),
    staleTime: 1000 * 60 * 5,
  });
};
