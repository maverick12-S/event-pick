/**
 * HomeScreen — ホーム画面
 * ─────────────────────────────────────────────
 * ログイン後のランディング画面。
 * 4つの機能ボタン（投稿一覧確認 / 投稿 / レポート / 拠点アカウント管理）を表示。
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, CardActionArea, Typography } from '@mui/material';
import {
  FiClipboard,
  FiEdit3,
  FiBarChart2,
  FiUsers,
} from 'react-icons/fi';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'posts',
    label: '投稿一覧確認',
    icon: <FiClipboard />,
    path: '/posts',
  },
  {
    id: 'post',
    label: '投稿',
    icon: <FiEdit3 />,
    path: '/post/new',
  },
  {
    id: 'report',
    label: 'レポート',
    icon: <FiBarChart2 />,
    path: '/report',
  },
  {
    id: 'accounts',
    label: '拠点アカウント管理',
    icon: <FiUsers />,
    path: '/accounts',
  },
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3.2, sm: 5 },
        py: { xs: 6, sm: 8 },
        gap: { xs: 4.5, sm: 5.8 },
        minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ textAlign: 'center', color: '#fff' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: 'clamp(2.8rem, 6vw, 4.9rem)',
            fontWeight: 700,
            letterSpacing: '0.02em',
            mb: 1.6,
            textShadow: '0 10px 28px rgba(5, 10, 24, 0.45)',
          }}
        >
          ホーム
        </Typography>
        <Typography
          sx={{
            fontSize: 'clamp(1.2rem, 2.8vw, 1.65rem)',
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          4つの機能からお選びください
        </Typography>
      </Box>

      <Grid
        container
        spacing={{ xs: 2.6, sm: 3.4, md: 3.8 }}
        sx={{ width: '100%', maxWidth: 1360 }}
        role="navigation"
        aria-label="メインメニュー"
      >
        {MENU_ITEMS.map((item, index) => (
          <Grid key={item.id} size={{ xs: 6 }}>
            <CardActionArea
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              sx={{
                minHeight: { xs: 210, sm: 262, md: 286 },
                borderRadius: '22px',
                border: '1px solid rgba(255,255,255,0.28)',
                background: 'linear-gradient(160deg, rgba(255,255,255,0.26) 0%, rgba(206,226,255,0.09) 35%, rgba(132,171,228,0.06) 100%)',
                backdropFilter: 'blur(22px) saturate(145%)',
                WebkitBackdropFilter: 'blur(22px) saturate(145%)',
                boxShadow: '0 20px 46px rgba(3, 10, 28, 0.52), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -1px 0 rgba(120,168,235,0.14)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: { xs: 2.2, sm: 2.8 },
                px: { xs: 3.2, sm: 4.6 },
                py: { xs: 3.4, sm: 4.8 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(10px) scale(0.98)',
                opacity: 0,
                animation: `homeCardEnter 380ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 65}ms forwards`,
                transition: 'transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1), background 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(128deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 34%, rgba(255,255,255,0) 56%)',
                },
                '&:hover': {
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.3) 0%, rgba(208,232,255,0.13) 35%, rgba(140,182,246,0.09) 100%)',
                  borderColor: 'rgba(255,255,255,0.46)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 24px 52px rgba(3, 10, 28, 0.58), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(130,182,255,0.2)',
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                },
                '&:focus-visible': {
                  outline: '2px solid rgba(100,160,255,0.6)',
                  outlineOffset: '2px',
                },
                '@keyframes homeCardEnter': {
                  from: { opacity: 0, transform: 'translateY(10px) scale(0.98)' },
                  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: { xs: 64, sm: 80, md: 92 },
                  height: { xs: 64, sm: 80, md: 92 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  color: 'rgba(255,255,255,0.96)',
                  filter: 'drop-shadow(0 5px 8px rgba(6, 14, 36, 0.52))',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: 'clamp(1.4rem, 2.9vw, 2.35rem)',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  lineHeight: 1.3,
                  textShadow: '0 8px 18px rgba(6, 14, 36, 0.4)',
                }}
              >
                {item.label}
              </Typography>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomeScreen;
