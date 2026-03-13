import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import accountsMockApi, {
  type UpdateAccountPayload,
} from '../../../api/mock/accountsMockApi';

export const useAccountDetailMock = (id: string) => {
  return useQuery({
    queryKey: ['mock', 'accounts', 'detail', id],
    queryFn: () => accountsMockApi.getAccountDetail(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
};

export const useUpdateAccountMock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountPayload }) => {
      return accountsMockApi.updateAccount(id, payload);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts', 'detail', variables.id] });
    },
  });
};

export const useDeleteAccountMock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsMockApi.deleteAccount(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts', 'detail', id] });
    },
  });
};

export const useCancelAccountDeletionMock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsMockApi.cancelScheduledDeletion(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['mock', 'accounts', 'detail', id] });
    },
  });
};
