import { useQuery } from '@tanstack/react-query';
import openapiClient, { NotificationsResponse } from '../../api/openapiClient';
import { queryKeys } from '../../api/queryKeys';

export const useNotifications = (params?: Record<string, unknown>) => {
  return useQuery<NotificationsResponse>({
    queryKey: [...queryKeys.notifications, params],
    queryFn: () => openapiClient.getNotifications(params),
    staleTime: 30 * 1000,
  });
};

export default useNotifications;
