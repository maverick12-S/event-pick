import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  Divider,
  Typography,
} from '@mui/material';
import {
  FiArrowLeft,
  FiCreditCard,
  FiFileText,
  FiChevronRight,
  FiPlus,
} from 'react-icons/fi';
import { getBillingData } from '../../../api/db/billing.db';
import type { BillingData } from '../../../types/models/billing';

const BILLING_SCREEN_SCALE = 1.2;

// ---------- shared sx helpers ----------
const sectionCardSx = {
  borderRadius: '16px',
  border: '1px solid rgba(102, 205, 255, 0.35)',
  background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.88), rgba(11, 32, 60, 0.92))',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.12), 0 14px 32px rgba(3, 14, 31, 0.48)',
  px: { xs: 2, md: 2.6 },
  py: { xs: 1.8, md: 2.2 },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 36%, rgba(255,255,255,0) 62%)',
    pointerEvents: 'none',
  },
};

const sectionTitleSx = {
  color: '#f4fbff',
  fontSize: { xs: '1.05rem', md: '1.15rem' },
  fontWeight: 800,
  letterSpacing: '0.02em',
  mb: 1.4,
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
};

const linkBtnSx = {
  color: '#7dc8ff',
  fontSize: '0.88rem',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.35,
  mt: 0.5,
  '&:hover': {
    textDecoration: 'underline',
  },
};

const labelSx = {
  color: 'rgba(215, 232, 252, 0.72)',
  fontSize: '0.82rem',
  fontWeight: 700,
  mb: 0.2,
};

const valueSx = {
  color: '#f0f8ff',
  fontSize: '0.96rem',
  fontWeight: 700,
};

const dividerSx = {
  borderColor: 'rgba(214, 233, 255, 0.14)',
  my: 1.4,
};

// ---------- Component ----------
const SettingsBillingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showAllInvoices, setShowAllInvoices] = useState(false);

  const billing: BillingData = useMemo(() => getBillingData(), []);
  const visibleInvoices = showAllInvoices ? billing.invoices : billing.invoices.slice(0, 3);

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
          width: { xs: '100%', lg: `${100 / BILLING_SCREEN_SCALE}%` },
          maxWidth: 840,
          mx: 'auto',
          zoom: { xs: 1, lg: BILLING_SCREEN_SCALE },
          transformOrigin: 'top center',
        }}
      >
        {/* --- Back button --- */}
        <ButtonBase
          onClick={() => navigate('/home')}
          sx={{
            borderRadius: 999,
            px: 1.35,
            py: 0.62,
            border: '1px solid rgba(186, 214, 250, 0.5)',
            backgroundColor: 'rgba(11, 34, 67, 0.58)',
            color: '#d8ebff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.62,
            fontSize: '0.79rem',
            fontWeight: 700,
            mb: 1.55,
          }}
        >
          <FiArrowLeft /> Homeに戻る
        </ButtonBase>

        {/* --- Stripe header --- */}
        <Box sx={{ textAlign: 'center', mb: 2.4 }}>
          <Typography
            sx={{
              color: 'rgba(215, 232, 252, 0.72)',
              fontSize: '0.84rem',
              fontWeight: 600,
              mb: 0.35,
            }}
          >
            {billing.company.companyName} は Stripe を使用しています
          </Typography>
          <Typography
            sx={{
              color: '#f4fbff',
              fontSize: { xs: '2.1rem', md: '2.75rem' },
              fontWeight: 900,
              letterSpacing: '0.03em',
              textShadow: '0 10px 28px rgba(8, 19, 45, 0.42)',
            }}
          >
            請求管理
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 0.6, flexWrap: 'wrap' }}>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.55)', fontSize: '0.76rem' }}>
              Powered by <strong style={{ color: 'rgba(215, 232, 252, 0.78)' }}>Stripe</strong>
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.35)', fontSize: '0.76rem' }}>|</Typography>
            <ButtonBase
              onClick={() => navigate('/settings/billing/stripe-info')}
              sx={{ color: 'rgba(168, 208, 255, 0.7)', fontSize: '0.76rem', '&:hover': { textDecoration: 'underline' } }}
            >
              Stripe Billing の詳細
            </ButtonBase>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.35)', fontSize: '0.76rem' }}>|</Typography>
            <ButtonBase
              onClick={() => navigate('/settings/billing/terms')}
              sx={{ color: 'rgba(168, 208, 255, 0.7)', fontSize: '0.76rem', '&:hover': { textDecoration: 'underline' } }}
            >
              規約
            </ButtonBase>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.35)', fontSize: '0.76rem' }}>|</Typography>
            <ButtonBase
              onClick={() => navigate('/settings/billing/privacy')}
              sx={{ color: 'rgba(168, 208, 255, 0.7)', fontSize: '0.76rem', '&:hover': { textDecoration: 'underline' } }}
            >
              プライバシー
            </ButtonBase>
          </Box>
        </Box>

        {/* === SECTIONS === */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
          {/* ---- 現在のサブスクリプション ---- */}
          <Box sx={sectionCardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={sectionTitleSx}>
                <FiFileText size={17} /> 現在のサブスクリプション
              </Typography>

              <Typography sx={{ color: '#f0f8ff', fontSize: '1.06rem', fontWeight: 800 }}>
                {billing.subscription.planName}
              </Typography>
              <Typography sx={{ color: 'rgba(215, 232, 252, 0.7)', fontSize: '0.88rem', mt: 0.3 }}>
                {billing.subscription.cycle}
              </Typography>

              <Divider sx={dividerSx} />

              <Typography sx={{ color: 'rgba(215, 232, 252, 0.72)', fontSize: '0.86rem', lineHeight: 1.65 }}>
                サービスは <strong style={{ color: '#ffffff' }}>{billing.subscription.renewalDate}</strong> に更新されます。
              </Typography>
              <Typography sx={{ color: 'rgba(215, 232, 252, 0.72)', fontSize: '0.86rem', lineHeight: 1.65, mt: 0.3 }}>
                次回の推定支払い額は <strong style={{ color: '#ffffff' }}>{billing.subscription.nextEstimate}</strong> です
              </Typography>

              <ButtonBase onClick={() => navigate('/settings/billing/subscription')} sx={linkBtnSx}>
                詳細を表示 <FiChevronRight size={14} />
              </ButtonBase>
            </Box>
          </Box>

          {/* ---- 決済手段 ---- */}
          <Box sx={sectionCardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={sectionTitleSx}>
                <FiCreditCard size={17} /> 決済手段
              </Typography>

              {billing.paymentMethods.length === 0 ? (
                <Typography sx={{ color: 'rgba(215, 232, 252, 0.56)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  決済手段が登録されていません
                </Typography>
              ) : (
                billing.paymentMethods.map((pm) => (
                  <Typography key={pm.id} sx={valueSx}>
                    {pm.brand} •••• {pm.last4}（{pm.expMonth}/{pm.expYear}）{pm.isDefault ? ' [デフォルト]' : ''}
                  </Typography>
                ))
              )}

              <ButtonBase sx={{ ...linkBtnSx, mt: 1 }}>
                <FiPlus size={14} /> 決済手段を追加
              </ButtonBase>
            </Box>
          </Box>

          {/* ---- 請求先情報 ---- */}
          <Box sx={sectionCardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={sectionTitleSx}>
                請求先情報
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Box>
                  <Typography sx={labelSx}>名前</Typography>
                  <Typography sx={valueSx}>
                    {billing.billingAddress.name || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={labelSx}>メールアドレス</Typography>
                  <Typography sx={valueSx}>
                    {billing.billingAddress.email || '—'}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                  <Typography sx={labelSx}>請求先住所</Typography>
                  <Typography sx={valueSx}>
                    {billing.billingAddress.country}{billing.billingAddress.postalCode ? ` 〒${billing.billingAddress.postalCode}` : ''}{billing.billingAddress.prefecture ? ` ${billing.billingAddress.prefecture}` : ''}{billing.billingAddress.city ? ` ${billing.billingAddress.city}` : ''}{billing.billingAddress.address1 ? ` ${billing.billingAddress.address1}` : ''}{(!billing.billingAddress.country && !billing.billingAddress.postalCode) ? '—' : ''}
                  </Typography>
                </Box>
              </Box>

              <ButtonBase
                onClick={() => navigate('/settings/billing/edit')}
                sx={{ ...linkBtnSx, mt: 1.2 }}
              >
                情報を更新 <FiChevronRight size={14} />
              </ButtonBase>
            </Box>
          </Box>

          {/* ---- 請求履歴 ---- */}
          <Box sx={sectionCardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={sectionTitleSx}>
                請求履歴
              </Typography>

              {billing.invoices.length === 0 ? (
                <Typography sx={{ color: 'rgba(215, 232, 252, 0.56)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  請求履歴がありません
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                      gap: 0.5,
                      pb: 0.8,
                      borderBottom: '1px solid rgba(214, 233, 255, 0.16)',
                    }}
                  >
                    <Typography sx={{ ...labelSx, mb: 0 }}>請求書番号</Typography>
                    <Typography sx={{ ...labelSx, mb: 0 }}>日付</Typography>
                    <Typography sx={{ ...labelSx, mb: 0 }}>金額</Typography>
                    <Typography sx={{ ...labelSx, mb: 0 }}>ステータス</Typography>
                  </Box>

                  {visibleInvoices.map((inv) => (
                    <Box
                      key={inv.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                        gap: 0.5,
                        py: 0.9,
                        borderBottom: '1px solid rgba(214, 233, 255, 0.1)',
                      }}
                    >
                      <Typography sx={{ color: '#7dc8ff', fontSize: '0.88rem', fontWeight: 700 }}>
                        {inv.id}
                      </Typography>
                      <Typography sx={{ ...valueSx, fontSize: '0.88rem' }}>{inv.date}</Typography>
                      <Typography sx={{ ...valueSx, fontSize: '0.88rem' }}>{inv.amount}</Typography>
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: inv.status === '支払い済み' ? '#7be8b0' : '#ffb27d',
                        }}
                      >
                        {inv.status}
                      </Typography>
                    </Box>
                  ))}

                  {billing.invoices.length > 3 && !showAllInvoices && (
                    <ButtonBase
                      onClick={() => setShowAllInvoices(true)}
                      sx={{ ...linkBtnSx, mt: 0.8 }}
                    >
                      すべて表示 <FiChevronRight size={14} />
                    </ButtonBase>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* --- Footer link --- */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <ButtonBase
            onClick={() => navigate('/home')}
            sx={{
              color: 'rgba(168, 208, 255, 0.7)',
              fontSize: '0.84rem',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {billing.company.companyName} に戻る
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsBillingScreen;
