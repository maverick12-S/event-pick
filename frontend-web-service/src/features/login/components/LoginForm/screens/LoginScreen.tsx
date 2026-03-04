// =============================================
// 原則：Screenは「組み立て」だけをする
// 背景配置 / レイアウト / hookの呼び出し
// UIの細かい実装はコンポーネントに任せる
// =============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Header/Footer are provided by BaseLayout; avoid duplicate rendering here
import LoginForm from '../LoginForm';
import { useLogin } from '../../../api/hooks/useLogin';
import styles from './LoginScreen.module.css';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const {isLoading, error, login} = useLogin();

    const handlePasswordReset = () => {
        navigate('/password-reset');
    }

    const handleNewAccount = () => {
      navigate('/signup');
    }

  return (
    <>
      <div className={styles.titleSection}>
        <h1>企業ログイン</h1>
        <p className={styles.subtitle}>拠点アカウントでログインしてください</p>
      </div>

      <div className={styles.card}>
        <LoginForm
          isLoading={isLoading}
          error={error}
          onSubmit={login}
          onPasswordReset={handlePasswordReset}
          onNewAccount={handleNewAccount}
        />
      </div>
    </>
  );
};

export default LoginScreen;