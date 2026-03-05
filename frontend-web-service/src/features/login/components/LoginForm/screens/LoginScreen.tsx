// =============================================
// LoginScreen
// =============================================
// 原則：Screenは「組み立て」だけをする
// 背景配置 / レイアウト / hookの呼び出し
// UIの細かい実装はコンポーネントに任せる
// =============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPageLayout, FormCard } from '../../../../../components/ui';
import LoginForm from '../LoginForm';
import { useLogin } from '../../../api/hooks/useLogin';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, login } = useLogin();

  const handlePasswordReset = () => navigate('/password-reset');
  const handleNewAccount = () => navigate('/signup');

  return (
    <AuthPageLayout
      title="企業ログイン"
      subtitle="拠点アカウントでログインしてください"
    >
      <FormCard>
        <LoginForm
          isLoading={isLoading}
          error={error}
          onSubmit={login}
          onPasswordReset={handlePasswordReset}
          onNewAccount={handleNewAccount}
        />
      </FormCard>
    </AuthPageLayout>
  );
};

export default LoginScreen;
