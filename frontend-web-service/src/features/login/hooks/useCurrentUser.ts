import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { tokenService } from '../../../api/tokenService';
import type { AuthUser } from '../../../types/auth';

export const useCurrentUser = () => {
  const hasToken = Boolean(tokenService.getAccessToken());
  return useQuery<AuthUser, unknown>({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: hasToken,
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });
};

export default useCurrentUser;
