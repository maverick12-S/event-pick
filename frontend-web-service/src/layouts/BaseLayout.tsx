/**
 * BaseLayout
 * ─────────────────────────────────────────────
 * ログイン系画面の共通レイアウト。
 * ・Background (背景)
 * ・Header (sticky)
 * ・<main> → Outlet (各画面)
 * ・Footer
 *
 * スクロール対応:
 *   Background が min-height: 100dvh + flex column 構成。
 *   main は flex:1 で伸縮、コンテンツが少ない時は中央寄せ。
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const BaseLayout: React.FC = () => {
  return (
    <Background>
      {/* z-index は Background の::before(0), ::after(1) より前面 */}
      <div style={{ position: 'relative', zIndex: 10, flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </Background>
  );
};

export default BaseLayout;
