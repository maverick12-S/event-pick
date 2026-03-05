/**
 * SuspenseLoading
 * ─────────────────────────────────────────────
 * lazy import 中に表示するフォールバックUI。
 * ログイン画面と同じ背景・ヘッダー・フッターを維持し、
 * 中央に「読み込み中」インジケーターを表示。
 */

import React, { Suspense } from 'react';
import bg from '../../assets/images/login-bg.png';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#071020',
    }}
  >
    {/* ダークオーバーレイ */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(160deg, rgba(7,16,32,0.7) 0%, rgba(11,42,74,0.6) 60%, rgba(7,16,32,0.75) 100%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />

    {/* ヘッダー */}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <Header />
    </div>

    {/* メインコンテンツ：読み込み中 */}
    <Box
      component="main"
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        py: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          px: 5,
          py: 4,
          minWidth: 220,
        }}
      >
        <CircularProgress
          size={36}
          thickness={3.5}
          sx={{ color: 'rgba(255,255,255,0.75)' }}
        />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.04em',
          }}
        >
          読み込み中…
        </Typography>
      </Box>
    </Box>

    {/* フッター */}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <Footer />
    </div>
  </div>
);

const SuspenseLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export default SuspenseLoading;
