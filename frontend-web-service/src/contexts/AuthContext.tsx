/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, type ReactNode, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../features/login/api/authApi';
import { tokenService } from '../api/tokenService';
import { useCurrentUser } from '../features/login/hooks/useCurrentUser';
import type { LoginRequest, AuthUser, LoginResponse } from '../types/auth';

// ─── 利用規約承諾バージョン ───
const TERMS_VERSION = '2026-03-14';
const TERMS_STORAGE_KEY = 'eventpick_terms_accepted';

// 公開インターフェース（既存 API と互換）
interface AuthContextValue {
  isAuthenticated: boolean;
  isOperator: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  termsAccepted: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  acceptTerms: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(
    () => localStorage.getItem(TERMS_STORAGE_KEY) === TERMS_VERSION,
  );
  const meQuery = useCurrentUser();

  const user = (meQuery.data as AuthUser | undefined) ?? null;
  const isInitialized = !meQuery.isFetching;
  const isCookieAuth = tokenService.isUsingCookies();
  const accessToken = tokenService.getAccessToken();
  const isOperatorFromToken = Boolean(accessToken?.startsWith('mock-ops-access-token-'));
  const isOperatorFromUser = user?.id === 'operator-root';

  const loginMutation = useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      tokenService.setAccessToken(data.access_token ?? null);
      tokenService.setRefreshToken(data.refresh_token ?? null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
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

  const acceptTerms = () => {
    localStorage.setItem(TERMS_STORAGE_KEY, TERMS_VERSION);
    setTermsAccepted(true);
  };

  const clearAuthError = () => setError(null);

  const value: AuthContextValue = {
    // Cookie認証時は access token をJSで参照できないため /me の成否で判定する
    isAuthenticated: isCookieAuth ? Boolean(user) : Boolean(tokenService.getAccessToken()),
    isOperator: isOperatorFromUser || isOperatorFromToken,
    user,
    isLoading: loginMutation.isPending,
    error,
    isInitialized,
    termsAccepted,
    login,
    logout,
    clearAuthError,
    acceptTerms,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // HMRや一時的な描画順の揺らぎでProvider外評価になっても全体クラッシュを避ける
    console.error('useAuth は AuthProvider 内で使用してください');
    return {
      isAuthenticated: false,
      isOperator: false,
      user: null,
      isLoading: false,
      error: '認証コンテキストが初期化されていません',
      isInitialized: true,
      termsAccepted: false,
      login: async () => {
        throw new Error('AuthProvider が見つからないためログインできません');
      },
      logout: () => {
        // no-op
      },
      clearAuthError: () => {
        // no-op
      },
      acceptTerms: () => {
        // no-op
      },
    };
  }
  return ctx;
};
