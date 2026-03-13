import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Divider, Typography } from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';
import { getBillingData } from '../../../api/db/billing.db';

const SCALE = 1.2;

const labelSx = { color: 'rgba(215, 232, 252, 0.72)', fontSize: '0.82rem', fontWeight: 700, mb: 0.2 };
const valueSx = { color: '#f0f8ff', fontSize: '0.96rem', fontWeight: 700 };
const dividerSx = { borderColor: 'rgba(214, 233, 255, 0.14)', my: 1.4 };

const BillingSubscriptionScreen: React.FC = () => {
  const navigate = useNavigate();
  const billing = useMemo(() => getBillingData(), []);
  const sub = billing.subscription;

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
          サブスクリプション詳細
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
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography sx={labelSx}>プラン名</Typography>
                <Typography sx={valueSx}>{sub.planName}</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>ステータス</Typography>
                <Typography sx={{ ...valueSx, color: sub.status === 'active' ? '#7be8b0' : '#ffb27d' }}>
                  {sub.status === 'active' ? '有効' : sub.status === 'trialing' ? 'トライアル中' : sub.status === 'past_due' ? '支払い遅延' : 'キャンセル済み'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>請求サイクル</Typography>
                <Typography sx={valueSx}>{sub.cycle}</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>単価</Typography>
                <Typography sx={valueSx}>{sub.unitAmount}</Typography>
              </Box>
            </Box>

            <Divider sx={dividerSx} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography sx={labelSx}>次回更新日</Typography>
                <Typography sx={valueSx}>{sub.renewalDate}</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>次回推定支払い額</Typography>
                <Typography sx={valueSx}>{sub.nextEstimate}</Typography>
              </Box>
              {sub.stripePriceId && (
                <Box>
                  <Typography sx={labelSx}>Stripe Price ID</Typography>
                  <Typography sx={{ ...valueSx, fontSize: '0.84rem', fontFamily: 'monospace' }}>
                    {sub.stripePriceId}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingSubscriptionScreen;
