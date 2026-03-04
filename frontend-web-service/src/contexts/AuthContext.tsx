/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, ReactNode, useState } from 'react';
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

  const user = meQuery.data ?? null;
  const isInitialized = !meQuery.isFetching;

  const loginMutation = useMutation<LoginResponse, unknown, LoginRequest>(
    (data) => authApi.login(data),
    {
      onSuccess: (data) => {
        // token 保存
        tokenService.setAccessToken(data.access_token ?? null);
        tokenService.setRefreshToken(data.refresh_token ?? null);
        // ユーザー情報があればセット（APIが返さない場合は null のまま）
        // setUser({ id: '', username: '', realm: '' });
        setError(null);
        queryClient.invalidateQueries();
      },
      onError: (err: unknown) => {
          console.error('login error', err);
        },
    }
  );

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
    setUser(null);
    queryClient.clear();
  };

  const clearAuthError = () => setError(null);

  const value: AuthContextValue = {
    isAuthenticated: Boolean(tokenService.getAccessToken()),
    user,
    isLoading: loginMutation.isLoading,
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
