/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, type ReactNode, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../features/login/api/authApi';
import { tokenService } from '../api/tokenService';
import { useCurrentUser } from '../features/login/hooks/useCurrentUser';
import type { LoginRequest, AuthUser, LoginResponse } from '../types/auth';

// 公開インターフェース（既存 API と互換）
interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const meQuery = useCurrentUser();

  const user = (meQuery.data as AuthUser | undefined) ?? null;
  const isInitialized = !meQuery.isFetching;

  const loginMutation = useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      tokenService.setAccessToken(data.access_token ?? null);
      tokenService.setRefreshToken(data.refresh_token ?? null);
      setError(null);
      queryClient.invalidateQueries({});
    },
    onError: (err: unknown) => {
      console.error('login error', err);
    },
  });

  const login = async (credentials: LoginRequest): Promise<void> => {
    setError(null);
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (e: unknown) {
      // mutation が投げたエラーをキャッチして呼び出し元にも伝播
      const message = e instanceof Error ? e.message : 'ログインに失敗しました';
      setError(message);
      throw e;
    }
  };

  const logout = () => {
    tokenService.clear();
    // clear local user cache via query client
    queryClient.clear();
  };

  const clearAuthError = () => setError(null);

  const value: AuthContextValue = {
    isAuthenticated: Boolean(tokenService.getAccessToken()),
    user,
    isLoading: loginMutation.isPending,
    error,
    isInitialized,
    login,
    logout,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth は AuthProvider 内で使用してください');
  return ctx;
};
