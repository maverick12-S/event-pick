import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi, eventApi, userApi, authService } from './client';

export const useCompanyList = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['companies', params ? JSON.stringify(params) : null],
    queryFn: () => companyApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCompanyGet = (companyId: string) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companyApi.get(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompanyCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => companyApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useCompanyUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, payload }: { companyId: string; payload: unknown }) =>
      companyApi.update(companyId, payload),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useCompanyDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companyId: string) => companyApi.delete(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useEventList = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['events', params ? JSON.stringify(params) : null],
    queryFn: () => eventApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEventGet = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.get(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEventCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => eventApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useEventUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: unknown }) =>
      eventApi.update(eventId, payload),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUserList = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['users', params ? JSON.stringify(params) : null],
    queryFn: () => userApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUserGet = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.get(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuthLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => authService.login(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useAuthLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export default {
  useCompanyList,
  useCompanyGet,
  useCompanyCreate,
  useCompanyUpdate,
  useCompanyDelete,
  useEventList,
  useEventGet,
  useEventCreate,
  useEventUpdate,
  useUserList,
  useUserGet,
  useAuthLogin,
  useAuthLogout,
};
