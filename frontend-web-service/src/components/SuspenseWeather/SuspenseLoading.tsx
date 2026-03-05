import React, { Suspense } from 'react';
import bg from '../../assets/images/login-bg.png';

/**
 * SuspenseLoading
 * ─────────────────────────────────────────────
 * lazy import 中に表示するフォールバックUI。
 * 背景画像 + Loading インジケーターのみ。
 * ※ 天気API取得は削除（外部依存によりLoadingが解決しない問題を修正）
 */

const LoadingFallback: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#071020',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        minWidth: 200,
        maxWidth: '70%',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.08)',
        color: '#fff',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 6px 20px rgba(2,6,23,0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      Loading・・・
    </div>
  </div>
);

const SuspenseLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export default SuspenseLoading;
