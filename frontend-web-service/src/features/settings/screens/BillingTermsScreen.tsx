import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Typography } from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const SCALE = 0.96;

const BillingTermsScreen: React.FC = () => {
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
          決済サービス利用規約
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
              本規約は、シバ カズキ（屋号：Solvevia、以下「運営者」）が提供する「EventPick」利用規約に基づき、
              決済・請求に関する事項を補足して定めるものです。EventPick の利用企業は、本規約およびEventPick利用規約に同意したうえで本機能を利用するものとします。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第1条（適用範囲）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              本規約は、EventPick におけるサブスクリプション契約、チケット課金、請求書発行、決済手段管理その他の請求関連取引に適用されます。
              本規約に定めのない事項は、EventPick利用規約の定めに従うものとします。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第2条（課金と請求サイクル）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              利用料金は、契約プランに基づき初回申込時および以後の更新日に自動課金されます。
              プラン変更時の差額精算（プロレーション）や請求タイミングは、EventPick利用規約第5条・第7条の定めに従います。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第3条（決済手段および外部サービス）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              決済処理は Stripe, Inc. が提供する決済基盤を用いて行われます。
              利用企業は、Stripe の利用条件・プライバシーポリシーに従って決済手段を登録・管理するものとし、決済情報の真正性・有効性を保証する責任を負います。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第4条（解約・返金）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              解約手続き・返金可否・日割り計算の有無は、EventPick利用規約第7条および第8条に従います。
              特段の定めがある場合を除き、支払済み料金は返金されません。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第5条（支払い遅延・利用停止）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              決済失敗または未払いが継続した場合、運営者は通知のうえで本サービスの一部または全部を停止できるものとします。
              停止・解約・再開条件は、EventPick利用規約第7条4項および第8条に従います。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第6条（免責）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              運営者の責任範囲および損害賠償の上限は、EventPick利用規約に定める範囲に従います。
              Stripe など外部サービス起因の障害・遅延・中断について、運営者は自己の故意または重大な過失がある場合を除き責任を負いません。
            </Typography>

            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800 }}>
              第7条（準拠法・管轄）
            </Typography>
            <Typography sx={{ color: 'rgba(215, 232, 252, 0.78)', fontSize: '0.92rem', lineHeight: 1.75 }}>
              本規約の準拠法および管轄は、EventPick利用規約に定める準拠法・管轄条項に従います。
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

export default BillingTermsScreen;
