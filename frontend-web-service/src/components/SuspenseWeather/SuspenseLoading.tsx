/**
 * SuspenseLoading
 * ─────────────────────────────────────────────
 * lazy import 中に表示するフォールバックUI。
 * Header / Footer / 背景は BaseLayout 側が担当しているため、
 * ここでは中央のローディングインジケーターのみを表示する。
 */

import React, { Suspense, useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingFallback: React.FC = () => (
  <Box
    component="section"
    sx={{
      flex: '1 0 auto',
      minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      py: { xs: 6, sm: 8 },
      boxSizing: 'border-box',
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
        読み込み中...
      </Typography>
    </Box>
  </Box>
);

const DelayedLoadingFallback: React.FC<{ delayMs?: number }> = ({ delayMs = 120 }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShouldRender(true);
      // マウント直後にopacityを上げてフェードイン
      requestAnimationFrame(() => setFadeIn(true));
    }, delayMs);
    return () => {
      clearTimeout(timerId);
    };
  }, [delayMs]);

  if (!shouldRender) return null;

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <LoadingFallback />
    </Box>
  );
};

const SuspenseLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<DelayedLoadingFallback delayMs={120} />}>
    {children}
  </Suspense>
);

export default SuspenseLoading;
