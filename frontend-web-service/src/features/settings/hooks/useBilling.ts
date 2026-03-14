import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import billingMockApi from '../../../api/mock/billingMockApi';
import { queryKeys } from '../../../api/queryKeys';
import type { BillingData, BillingAddress } from '../../../types/models/billing';

export const useBillingData = () => {
  return useQuery<BillingData>({
    queryKey: queryKeys.billing,
    queryFn: () => billingMockApi.getBillingData(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useBillingAddress = () => {
  return useQuery<BillingAddress>({
    queryKey: [...queryKeys.billing, 'address'],
    queryFn: () => billingMockApi.getBillingAddress(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateBillingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<BillingAddress>) => billingMockApi.updateBillingAddress(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing });
    },
  });
};
