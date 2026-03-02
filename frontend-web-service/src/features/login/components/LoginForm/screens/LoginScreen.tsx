// =============================================
// 原則：Screenは「組み立て」だけをする
// 背景配置 / レイアウト / hookの呼び出し
// UIの細かい実装はコンポーネントに任せる
// =============================================

import React from 'react';
import Header from '../../../../../components/Header/Header';
import LoginForm from '../LoginForm';
import { useLogin } from '../../../api/hooks/useLogin';
import styles from './LoginScreen.module.css';

const LoginScreen: React.FC = () => {
    const {isLoading, error, login} = useLogin();
  

    const handlePasswordReset = () => {
        // 【TO_DO】パスワードリセット画面へ遷移
        console.log('パスワードリセット画面へ遷移');
    }

    const handleNewAccount = () => {
        // 【TO_DO】新規アカウント作成画面へ遷移
        console.log('新規アカウント作成画面へ遷移');
    }
    
  return (
    // 画面全体のラッパー（背景画像をここに適用）
    <div className={styles.pageWrapper}>

      {/* ========== ヘッダーバー ========== */}
      <Header />

      {/* ========== メインコンテンツ（中央寄せ） ========== */}
      <main className={styles.main}>
        {/* タイトルセクション（中央寄せ） */}
        <div className={styles.titleSection}>
          <h1>企業ログイン</h1>
          <p className={styles.subtitle}>拠点アカウントでログインしてください</p>
        </div>

        {/* フロストガラスカード */}
        <div className={styles.card}>
          <LoginForm
            isLoading={isLoading}
            error={error}
            onSubmit={login}
            onPasswordReset={handlePasswordReset}
            onNewAccount={handleNewAccount}
          />
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;