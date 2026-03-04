import { } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import type { LoginRequest } from '../../../types/auth';

export const useLogin = () => {
  const { login, isLoading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ログイン後の遷移先（元ページ or ダッシュボード）
  const from = (location.state as { from?: { pathname: string } })
    ?.from?.pathname ?? '/dashboard';

  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch {
      // error は context.state.error に格納される
    }
  };

  return { isLoading, error, login: handleLogin, clearAuthError };
};
