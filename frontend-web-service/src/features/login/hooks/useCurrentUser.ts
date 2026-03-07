import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { tokenService } from '../../../api/tokenService';
import type { AuthUser } from '../../../types/auth';

export const useCurrentUser = () => {
  const hasToken = Boolean(tokenService.getAccessToken());
  const canUseCookieAuth = tokenService.isUsingCookies();

  return useQuery<AuthUser, unknown>({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    // Cookie認証ではトークンをJSから読めないため、常に /me でログイン状態を確認する
    enabled: canUseCookieAuth || hasToken,
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });
};

export default useCurrentUser;
