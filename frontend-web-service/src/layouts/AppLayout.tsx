/**
 * AppLayout — ログイン後画面の共通レイアウト
 * ─────────────────────────────────────────────
 * ・AppHeader (ユーザー名・ドロップダウン付き)
 * ・背景は login-bg と同じ
 * ・スクロール対応 (min-height: 100dvh)
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const AppLayout: React.FC = () => {
  return (
    <Background>
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        <AppHeader />
        <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </Background>
  );
};

export default AppLayout;
