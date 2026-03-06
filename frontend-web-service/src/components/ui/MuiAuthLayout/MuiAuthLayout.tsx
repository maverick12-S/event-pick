/**
 * MuiAuthLayout
 * ─────────────────────────────────────────────
 * MUI Grid2 ベースの認証系画面ページ構造。
 * Header・Footer は BaseLayout が担当するため、
 * ここではコンテンツ領域（タイトル + カードスロット）を提供する。
 *
 * 使い方:
 *   <MuiAuthLayout title="企業ログイン" subtitle="...">
 *     <MyCard />
 *   </MuiAuthLayout>
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

interface MuiAuthLayoutProps {
  title: string;
  subtitle?: string;
  /** ワイドカード（サインアップ等）用 */
  wide?: boolean;
  /** レイアウト倍率（ログイン画面のみ拡大したい場合に使用） */
  layoutScale?: number;
  children: React.ReactNode;
}

const MuiAuthLayout: React.FC<MuiAuthLayoutProps> = ({
  title,
  subtitle,
  wide = false,
  layoutScale = 1,
  children,
}) => {
  return (
    <Box
      component="section"
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
        py: { xs: 4, sm: 5 },
        px: 2,
        gap: 3,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          width: layoutScale !== 1 ? `calc(100% / ${layoutScale})` : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: layoutScale !== 1 ? `scale(${layoutScale})` : 'none',
          transformOrigin: 'center center',
        }}
      >
        {/* タイトルセクション */}
        <Box
          sx={{
            textAlign: 'center',
            width: '100%',
            maxWidth: wide ? 920 : 540,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* カード列 */}
        <Grid
          container
          justifyContent="center"
          sx={{ width: '100%', maxWidth: wide ? 860 : 480 }}
        >
          <Grid size={12}>
            {children}
          </Grid>
        </Grid>

        {/* 下部余白 */}
        <Box sx={{ height: 32 }} aria-hidden />
      </Box>
    </Box>
  );
};

export default MuiAuthLayout;
