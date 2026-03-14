import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TermsAcceptanceModal from '../features/accounts/components/TermsAcceptanceModal';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitialized, termsAccepted, acceptTerms, logout } = useAuth();
  const location = useLocation();

  // 起動時チェック完了前はローディング表示（チラつき防止）
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0d1b2a', color: '#fff',
      }}>
        読み込み中...
      </div>
    );
  }

  if (!isAuthenticated) {
    // ログイン後に元のページへ戻れるよう、遷移前パスを渡す
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 利用規約が未承諾の場合はモーダルで承諾を求める
  if (!termsAccepted) {
    return <TermsAcceptanceModal open onAccept={acceptTerms} onDecline={logout} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
