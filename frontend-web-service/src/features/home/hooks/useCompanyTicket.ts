import { useQuery } from '@tanstack/react-query';
import ticketMockApi from '../../../api/mock/ticketMockApi';
import { queryKeys } from '../../../api/queryKeys';
import type { CompanyTicket } from '../../../types/entities';

export const useCompanyTicket = (enabled: boolean) => {
  return useQuery<CompanyTicket>({
    queryKey: queryKeys.tickets,
    queryFn: () => ticketMockApi.getCurrent(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
