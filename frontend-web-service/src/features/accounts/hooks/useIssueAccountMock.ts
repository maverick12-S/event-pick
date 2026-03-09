import { useMutation, useQueryClient } from '@tanstack/react-query';
import accountsMockApi, { type IssueAccountPayload } from '../../../api/mock/accountsMockApi';

export const useIssueAccountMock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssueAccountPayload) => accountsMockApi.issueAccount(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts'] });
    },
  });
};

export default useIssueAccountMock;
