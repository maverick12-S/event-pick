import { keepPreviousData, useQuery } from '@tanstack/react-query';
import accountsMockApi, { type GetAccountsParams } from '../../../api/mock/accountsMockApi';

export const useAccountsMock = (params: GetAccountsParams) => {
  return useQuery({
    queryKey: ['mock', 'accounts', params],
    queryFn: () => accountsMockApi.getAccounts(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useAccountsMock;
