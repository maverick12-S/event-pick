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
 *
 * ページ遷移アニメーション:
 *   pageTransitions.css の .page-enter アニメーションを自動適用
 *   ルート変更時にスケール〜フェードイン演出を実行
 */

import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pageTransitions.css';

const BaseLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigation = useNavigation();
  const [isEntering, setIsEntering] = useState(false);
  const [skipEnterAnimation, setSkipEnterAnimation] = useState(false);
  const prevLocationRef = useRef(location);
  
  // 公開ルート（ログイン画面など）では背景アニメーションを無効化
  const publicRoutes = ['/login', '/signup', '/password-reset', '/mfa', '/password-change'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showDarkOverlay = isAuthenticated && !isPublicRoute;
  const useAuthenticatedHeader = isAuthenticated && !isPublicRoute;
  const isNavigating = navigation.state !== 'idle';

  const readPostsTab = (search: string): 'today' | 'tomorrow' | null => {
    const params = new URLSearchParams(search);
    if (params.get('scope') === 'account') return null;
    const tab = params.get('tab') ?? 'today';
    return tab === 'today' || tab === 'tomorrow' ? tab : null;
  };

  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    const prevTab = prevLocation.pathname === '/posts' ? readPostsTab(prevLocation.search) : null;
    const nextTab = location.pathname === '/posts' ? readPostsTab(location.search) : null;
    const shouldSkip = prevTab !== null && nextTab !== null && prevTab !== nextTab;

    setSkipEnterAnimation(shouldSkip);

    if (shouldSkip) {
      setIsEntering(true);
      prevLocationRef.current = location;
      return;
    }

    setIsEntering(false);
    const rafId = window.requestAnimationFrame(() => setIsEntering(true));
    prevLocationRef.current = location;
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [location.pathname, location.search]);


  return (
    <Background
      isAuthenticated={showDarkOverlay}
      transitionKey={`${location.pathname}${location.search}`}
      disableMotion={skipEnterAnimation}
    >
      {/* z-index は Background の::before(0), ::after(1) より前面 */}
      <div style={{ position: 'relative', zIndex: 10, flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Header isAuthenticatedView={useAuthenticatedHeader} />
        {isNavigating && <div className="route-loading-bar" aria-hidden />}
        <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <div
            key={`${location.pathname}${location.search}`}
            className={`page-stage ${skipEnterAnimation ? 'no-motion' : ''} ${isEntering ? 'is-enter' : ''}`}
            style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}
          >
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </Background>
  );
};

export default BaseLayout;
