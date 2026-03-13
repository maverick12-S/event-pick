import { useAuth } from '../../../contexts/AuthContext';
import type { LoginRequest } from '../../../types/auth';
import { isOperatorCredential } from '../constants/operatorCredentials';

export const useLogin = () => {
  const { login, isLoading, error, clearAuthError } = useAuth();

  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data);
      // Router hook 依存を避けて、ログイン後の遷移を安定させる
      window.location.assign(isOperatorCredential(data) ? '/admin/dashboard' : '/plan');
    } catch {
      // error は context.state.error に格納される
    }
  };

  return { isLoading, error, login: handleLogin, clearAuthError };
};
