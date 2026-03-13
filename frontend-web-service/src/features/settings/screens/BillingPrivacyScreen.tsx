import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Typography } from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const SCALE = 1.2;

const BillingPrivacyScreen: React.FC = () => {
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
          決済プライバシーポリシー
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
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              MainFunc PTE. LTD.（以下「当社」）は、決済処理に関するお客様の個人情報の取扱いについて、以下のとおり定めます。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              1. 収集する情報
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              決済処理にあたり、以下の情報を収集します。
            </Typography>
            {[
              '氏名・メールアドレス（請求先情報として）',
              '住所・電話番号（請求書送付・本人確認として）',
              '決済手段情報（クレジットカード番号等は Stripe が直接処理し、当社サーバーには保存されません）',
              '取引履歴（請求金額・日付・ステータス）',
            ].map((item) => (
              <Box key={item} sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start', pl: 1 }}>
                <Typography sx={{ color: '#7dc8ff', fontSize: '0.88rem', lineHeight: 1.6 }}>•</Typography>
                <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Box>
            ))}

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              2. 利用目的
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              収集した情報は、サブスクリプションの課金処理、請求書の発行、支払いステータスの通知、
              サポート対応、および法令で求められる記録保持のためにのみ使用します。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              3. 第三者への提供
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              決済処理に必要な範囲で Stripe, Inc. に情報を共有します。
              Stripe のプライバシーポリシーについては Stripe 社の公式サイトをご参照ください。
              上記を除き、法令に基づく場合を除いて第三者に提供することはありません。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              4. データの保護
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              すべての通信は TLS 1.2 以上で暗号化されています。
              カード情報は PCI DSS Level 1 準拠の Stripe インフラ上で処理され、当社のサーバーに保存されることはありません。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              5. お問い合わせ
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              決済に関する個人情報のお問い合わせは、サポートページよりご連絡ください。
            </Typography>

            <Typography sx={{ color: 'rgba(215, 232, 252, 0.5)', fontSize: '0.82rem', mt: 1 }}>
              最終更新日: 2026年3月1日
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingPrivacyScreen;
