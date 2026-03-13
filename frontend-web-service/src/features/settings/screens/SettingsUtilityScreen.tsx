import React, { useMemo } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

type ScreenContent = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

const CONTENT_BY_PATH: Record<string, ScreenContent> = {
  '/settings/account': {
    eyebrow: 'Account',
    title: 'アカウント情報の変更',
    description: 'ログインユーザーの基本情報、連絡先、所属情報を見直すための管理画面です。',
    bullets: ['表示名とログインIDの確認', '担当者連絡先の更新', '所属プランと権限の確認'],
  },
  '/settings/notifications': {
    eyebrow: 'Notifications',
    title: '通知設定',
    description: 'メール通知、アプリ内通知、運用アラートの受信条件をまとめて管理できます。',
    bullets: ['重要通知の受信チャネル設定', 'レポート配信タイミングの変更', '投稿エラー通知のON/OFF'],
  },
  '/settings/billing': {
    eyebrow: 'Billing',
    title: '請求管理',
    description: '契約中プラン、請求先情報、支払い方法を確認するための管理画面です。',
    bullets: ['現在の契約プラン確認', '請求書送付先の更新', '支払い方法の変更導線'],
  },
  '/settings/history': {
    eyebrow: 'Execution History',
    title: '実行履歴',
    description: '投稿処理や配信処理の実行記録を確認するための履歴画面です。',
    bullets: ['投稿予約の更新履歴', 'エラー発生時刻の追跡', '担当者別の操作記録'],
  },
  '/settings/contact': {
    eyebrow: 'Support',
    title: 'お問い合わせ',
    description: 'サポートへの問い合わせ導線と、対応時に必要な情報をまとめた画面です。',
    bullets: ['問い合わせ内容の整理', '契約情報の事前確認', 'サポートへの連絡導線'],
  },
};

const fallbackContent: ScreenContent = {
  eyebrow: 'Settings',
  title: '管理画面',
  description: 'この画面は準備中です。',
  bullets: ['今後の管理機能をここに集約します。'],
};

const SettingsUtilityScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const content = useMemo(() => CONTENT_BY_PATH[location.pathname] ?? fallbackContent, [location.pathname]);

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          width: 'min(960px, 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'linear-gradient(145deg, rgba(12,21,38,0.88), rgba(13,31,55,0.7))',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
          p: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1.5}>
            <Chip
              label={content.eyebrow}
              sx={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(255,255,255,0.14)',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            />
            <Typography sx={{ color: '#fff', fontSize: { xs: '1.9rem', md: '2.5rem' }, fontWeight: 800, letterSpacing: '-0.03em' }}>
              {content.title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '52rem' }}>
              {content.description}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {content.bullets.map((item) => (
              <Box
                key={item}
                sx={{
                  borderRadius: '18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                  p: 2.25,
                  minHeight: '128px',
                }}
              >
                <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 700, mb: 1.2 }}>
                  {item}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  実データ連携前の導線確認用レイアウトです。機能追加時はこの枠をそのまま詳細フォームや一覧に差し替えられます。
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>
              ヘッダーメニューから直接遷移できるように接続済みです。
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{
                alignSelf: { xs: 'stretch', sm: 'auto' },
                px: 3,
                py: 1.25,
                borderRadius: '999px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(70,148,255,0.96), rgba(23,101,216,0.92))',
                boxShadow: '0 12px 26px rgba(0,0,0,0.24)',
              }}
            >
              ホームへ戻る
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default SettingsUtilityScreen;