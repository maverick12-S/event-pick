import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  loginThunk,
  logout as logoutAction,
  initializeAuthThunk,
  clearError,
} from '../store/slices/authSlice';
import type { LoginRequest, AuthUser } from '../types/auth';

// ── 公開インターフェース ───────────────────────────
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

// ── Provider ──────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error, isInitialized } =
    useAppSelector((state) => state.auth);

  // 起動時: localStorageのトークンで認証状態を復元
  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  // 🚀 Cognito移行時: Auth.signOut() をここに追加するだけ
  const logout = () => dispatch(logoutAction());

  const clearAuthError = () => dispatch(clearError());

  return (
    <AuthContext.Provider value={{
      isAuthenticated, user, isLoading, error, isInitialized,
      login, logout, clearAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── カスタムhook ──────────────────────────────────
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth は AuthProvider 内で使用してください');
  return ctx;
};
