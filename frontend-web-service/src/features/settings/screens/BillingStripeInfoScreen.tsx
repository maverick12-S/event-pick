import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Typography } from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const SCALE = 0.96;

const BillingStripeInfoScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
        px: { xs: 2.2, md: 3.4 },
        pt: { xs: 2.3, md: 3.4 },
        pb: { xs: 4.2, md: 6 },
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 0% 100%, rgba(20, 173, 255, 0.24), rgba(4, 18, 38, 0) 36%), radial-gradient(circle at 100% 0%, rgba(47, 223, 255, 0.22), rgba(4, 18, 38, 0) 32%), linear-gradient(180deg, #092345 0%, #081b37 48%, #08172f 100%)',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', lg: `${100 / SCALE}%` },
          maxWidth: 760,
          mx: 'auto',
          zoom: { xs: 1, lg: SCALE },
          transformOrigin: 'top center',
        }}
      >
        <ButtonBase
          onClick={() => navigate('/settings/billing')}
          sx={{
            borderRadius: 999, px: 1.35, py: 0.62,
            border: '1px solid rgba(186, 214, 250, 0.5)',
            backgroundColor: 'rgba(11, 34, 67, 0.58)',
            color: '#d8ebff', display: 'inline-flex', alignItems: 'center', gap: 0.62,
            fontSize: '0.79rem', fontWeight: 700, mb: 1.55,
          }}
        >
          <FiArrowLeft /> 請求管理に戻る
        </ButtonBase>

        <Typography
          sx={{
            color: '#f4fbff', textAlign: 'center',
            fontSize: { xs: '2.1rem', md: '2.75rem' },
            fontWeight: 900, letterSpacing: '0.03em', mb: 2.2,
            textShadow: '0 10px 28px rgba(8, 19, 45, 0.42)',
          }}
        >
          Stripe Billing の詳細
        </Typography>

        <Box
          sx={{
            borderRadius: '22px',
            border: '1px solid rgba(102, 205, 255, 0.5)',
            background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.9), rgba(11, 32, 60, 0.92))',
            backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.16), 0 18px 42px rgba(3, 14, 31, 0.58), 0 0 26px rgba(58, 194, 255, 0.2)',
            px: { xs: 2, sm: 2.6, md: 3 }, py: { xs: 2, sm: 2.4, md: 2.8 },
            position: 'relative', overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute', inset: 0,
              background: 'linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0) 62%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ color: '#f4fbff', fontSize: '1.1rem', fontWeight: 800 }}>
              Stripe Billing とは
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              Stripe Billing は、サブスクリプションや定期請求を柔軟に管理できるオンライン決済プラットフォームです。
              世界中の企業が利用しており、PCI DSS Level 1 に準拠した高いセキュリティ基準で運営されています。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800, mt: 1 }}>
              主な機能
            </Typography>
            {[
              '定期課金の自動処理と請求書の自動生成',
              'クレジットカード・デビットカード・銀行振込など多様な決済手段に対応',
              'プロレーション（日割り計算）によるプラン変更時の公平な課金',
              'Webhook によるリアルタイムのイベント通知',
              'カスタマーポータルによるセルフサービス管理',
            ].map((item) => (
              <Box key={item} sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start' }}>
                <Typography sx={{ color: '#7dc8ff', fontSize: '0.88rem', lineHeight: 1.6 }}>•</Typography>
                <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Box>
            ))}

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800, mt: 1 }}>
              セキュリティ
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              すべての決済データは Stripe のサーバーで処理され、当サービスのサーバーにカード情報が保存されることはありません。
              通信は TLS 1.2 以上で暗号化され、不正利用検知（Stripe Radar）により安全性がさらに強化されています。
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingStripeInfoScreen;
