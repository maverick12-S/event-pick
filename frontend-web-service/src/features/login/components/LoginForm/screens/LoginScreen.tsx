// =============================================
// LoginScreen — MUI リファクタ版
// =============================================

import React from 'react';
import { Box } from '@mui/material';
import MuiAuthLayout from '../../../../../components/ui/MuiAuthLayout/MuiAuthLayout';
import LoginForm from '../LoginForm';
import { useLogin } from '../../../hooks/useLogin';

const LoginScreen: React.FC = () => {
  const { isLoading, error, login } = useLogin();

  const handlePasswordReset = () => window.location.assign('/password-reset');
  const handleNewAccount    = () => window.location.assign('/signup');

  return (
    <MuiAuthLayout
      title="企業ログイン"
      subtitle="拠点アカウントでログインしてください"
      layoutScale={1}
    >
      <Box sx={{ mt: { xs: 2.5, sm: 3.25 } }}>
        <LoginForm
          isLoading={isLoading}
          error={error}
          onSubmit={login}
          onPasswordReset={handlePasswordReset}
          onNewAccount={handleNewAccount}
        />
      </Box>
    </MuiAuthLayout>
  );
};

export default LoginScreen;
