import { useQuery } from '@tanstack/react-query';
import openapiClient, { PaginatedEvents } from '../../api/openapiClient';
import { queryKeys } from '../../api/queryKeys';

export const useEvents = (params?: Record<string, unknown>) => {
  return useQuery<PaginatedEvents>({
    queryKey: [...queryKeys.events, params],
    queryFn: () => openapiClient.getEvents(params),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export default useEvents;
