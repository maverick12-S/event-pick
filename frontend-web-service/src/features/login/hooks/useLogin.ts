import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { authApi } from '../api/authApi';
import type { LoginRequest, Realm } from '../../../types/auth';

export const useLogin = () => {
  const { login, isLoading, error, clearAuthError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [realms, setRealms] = useState<Realm[]>([]);

  // ログイン後の遷移先（元ページ or ダッシュボード）
  const from = (location.state as { from?: { pathname: string } })
    ?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    authApi.getRealms()
      .then(setRealms)
      .catch(() => console.warn('拠点レルム取得失敗'));
  }, []);

  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data);       // AuthContext → Redux Thunk → API
      navigate(from, { replace: true });
    } catch {
      // エラーは Redux state.auth.error に格納 → UIで表示
    }
  };

  return { realms, isLoading, error, login: handleLogin, clearAuthError };
};
