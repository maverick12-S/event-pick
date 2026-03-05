/**
 * PlanScreen — MUI Grid/Card リファクタ版
 * ─────────────────────────────────────────────
 * ・MUI Grid でレスポンシブ3カラムレイアウト
 * ・MUI Card でプランカード
 * ・クーポンコード入力 (MUI TextField + Button)
 * ・スクロール・ズーム対応
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, CardActions,
  Typography, Button, TextField, Alert, Chip, Stack, Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

// ────────────────────────────────────────────────
// 型・定数
// ────────────────────────────────────────────────

type PlanId = 'light' | 'standard' | 'premium';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  btnVariant: 'outlined' | 'contained';
}

const PLANS: Plan[] = [
  {
    id: 'light',
    name: 'ライトプラン',
    price: 2980,
    description: '小規模チームや個人に最適な入門プランです。',
    features: [
      'イベント投稿：月10件まで',
      'レポート閲覧：基本レポート',
      'サポート：メールサポート',
      'アカウント数：1アカウント',
    ],
    accentColor: '#00d2e6',
    borderColor: 'rgba(0,210,220,0.6)',
    glowColor: 'rgba(0,210,220,0.12)',
    btnVariant: 'outlined',
  },
  {
    id: 'standard',
    name: 'スタンダードプラン',
    price: 8600,
    description: '成長中のチームに必要な機能をすべて揃えた人気プラン。',
    features: [
      'イベント投稿：月50件まで',
      'レポート閲覧：詳細レポート＋CSV出力',
      'サポート：メール＋チャットサポート',
      'アカウント数：5アカウントまで',
      '通知機能：リアルタイム通知',
    ],
    recommended: true,
    accentColor: '#e6c800',
    borderColor: 'rgba(220,180,0,0.75)',
    glowColor: 'rgba(220,180,0,0.14)',
    btnVariant: 'contained',
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 27600,
    description: '大規模運用に対応する最上位プラン。制限なし。',
    features: [
      'イベント投稿：無制限',
      'レポート閲覧：全レポート＋API連携',
      'サポート：専任担当者によるサポート',
      'アカウント数：無制限',
      '通知機能：カスタム通知設定',
      '優先SLA対応',
    ],
    accentColor: '#c080f0',
    borderColor: 'rgba(160,80,240,0.6)',
    glowColor: 'rgba(160,80,240,0.1)',
    btnVariant: 'outlined',
  },
];

// ────────────────────────────────────────────────
// PlanCard サブコンポーネント
// ────────────────────────────────────────────────

const PlanCard: React.FC<{
  plan: Plan;
  selected: boolean;
  loading: boolean;
  onSelect: (id: PlanId) => void;
}> = ({ plan, selected, loading, onSelect }) => (
  <Box sx={{ position: 'relative', height: '100%', pt: plan.recommended ? '16px' : 0 }}>
    {/* おすすめバッジ */}
    {plan.recommended && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Chip
          label="おすすめ"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #e53935, #ff6f00)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            boxShadow: '0 3px 10px rgba(229,57,53,0.4)',
          }}
        />
      </Box>
    )}

    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${plan.borderColor}`,
        background: 'rgba(8,16,40,0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${plan.glowColor} inset`,
        borderRadius: '14px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: plan.recommended ? 'scale(1.03)' : 'scale(1)',
        outline: selected ? '2px solid rgba(255,255,255,0.5)' : 'none',
        outlineOffset: '2px',
        '&:hover': {
          transform: plan.recommended ? 'scale(1.03) translateY(-4px)' : 'translateY(-4px)',
          boxShadow: `0 18px 48px rgba(0,0,0,0.5), 0 0 32px ${plan.glowColor} inset`,
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, pb: '0 !important' }}>
        {/* プランラベル */}
        <Chip
          label={plan.name}
          size="small"
          sx={{
            mb: 2,
            background: `rgba(${plan.id === 'light' ? '0,210,220' : plan.id === 'standard' ? '220,180,0' : '160,80,240'},0.15)`,
            color: plan.accentColor,
            border: `1px solid ${plan.borderColor}`,
            fontWeight: 700,
            fontSize: '0.82rem',
          }}
        />

        {/* 価格 */}
        <Stack direction="row" alignItems="baseline" gap={0.5} mb={1.5}>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>¥</Typography>
          <Typography
            sx={{
              fontSize: 'clamp(2rem,4vw,2.8rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {plan.price.toLocaleString('ja-JP')}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>/月</Typography>
        </Stack>

        {/* 説明 */}
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mb: 2, lineHeight: 1.6 }}>
          {plan.description}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

        {/* 機能リスト */}
        <Stack gap={1} sx={{ mb: 2 }}>
          {plan.features.map((f, i) => (
            <Stack key={i} direction="row" gap={1} alignItems="flex-start">
              <CheckIcon sx={{ fontSize: '0.9rem', color: plan.accentColor, mt: 0.3, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>
                {f}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: { xs: 2.5, sm: 3 }, pt: '0 !important' }}>
        <Button
          fullWidth
          variant={plan.btnVariant}
          disabled={loading}
          onClick={() => onSelect(plan.id)}
          aria-pressed={selected}
          sx={
            plan.btnVariant === 'contained'
              ? {
                  background: `linear-gradient(135deg, rgba(220,180,0,0.85), rgba(180,140,0,0.85))`,
                  color: '#fff',
                  border: 'none',
                  '&:hover': { filter: 'brightness(1.12)' },
                }
              : {
                  borderColor: plan.borderColor,
                  color: plan.accentColor,
                  '&:hover': { background: `rgba(${plan.id === 'light' ? '0,210,220' : '160,80,240'},0.1)` },
                }
          }
        >
          {loading ? '処理中…' : selected ? '選択済み ✓' : 'このプランを選択'}
        </Button>
      </CardActions>
    </Card>
  </Box>
);

// ────────────────────────────────────────────────
// PlanScreen
// ────────────────────────────────────────────────

const PlanScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan]   = useState<PlanId | null>(null);
  const [selectLoading, setSelectLoading] = useState<PlanId | null>(null);
  const [couponCode, setCouponCode]       = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult]   = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSelectPlan = async (planId: PlanId) => {
    setSelectLoading(planId);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSelectedPlan(planId);
      navigate('/home');
    } finally {
      setSelectLoading(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponResult({ type: 'error', message: 'クーポンコードを入力してください。' });
      return;
    }
    setCouponLoading(true);
    setCouponResult(null);
    try {
      await new Promise((r) => setTimeout(r, 900));
      if (couponCode.trim().toUpperCase() === 'DEMO10') {
        setCouponResult({ type: 'success', message: 'クーポンが適用されました！10% 割引が適用されます。' });
      } else {
        setCouponResult({ type: 'error', message: '無効なクーポンコードです。もう一度ご確認ください。' });
      }
    } catch {
      setCouponResult({ type: 'error', message: 'クーポンの確認中にエラーが発生しました。' });
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 4, sm: 5 },
        px: { xs: 2, sm: 3 },
        gap: 4,
        minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
        boxSizing: 'border-box',
      }}
    >
      {/* タイトル */}
      <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 960 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, fontWeight: 700, color: '#fff', mb: 0.5 }}
        >
          プランを選択
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          ご利用状況に合わせたプランをお選びください。いつでも変更できます。
        </Typography>
      </Box>

      {/* プランカードグリッド */}
      <Grid
        container
        spacing={{ xs: 2, md: 2.5 }}
        sx={{ width: '100%', maxWidth: 980 }}
        alignItems="stretch"
      >
        {PLANS.map((plan) => (
          <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <PlanCard
              plan={plan}
              selected={selectedPlan === plan.id}
              loading={selectLoading === plan.id}
              onSelect={handleSelectPlan}
            />
          </Grid>
        ))}
      </Grid>

      {/* クーポンセクション */}
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <LocalOfferOutlinedIcon sx={{ fontSize: '1rem' }} />
          クーポンコードをお持ちの方
        </Typography>

        <Stack direction="row" gap={1}>
          <TextField
            placeholder="クーポンコードを入力"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            disabled={couponLoading}
            inputProps={{ maxLength: 30, 'aria-label': 'クーポンコード入力' }}
            size="small"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '10px',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.45)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.65)' },
              },
              '& input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
            }}
          />
          <Button
            variant="outlined"
            disabled={couponLoading || !couponCode.trim()}
            onClick={handleApplyCoupon}
            sx={{
              whiteSpace: 'nowrap',
              borderColor: 'rgba(255,255,255,0.28)',
              color: '#fff',
              '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.5)' },
            }}
          >
            {couponLoading ? '確認中…' : 'クーポンを使用する'}
          </Button>
        </Stack>

        {couponResult && (
          <Alert
            severity={couponResult.type === 'success' ? 'success' : 'error'}
            sx={{ mt: 1.5, borderRadius: 2 }}
          >
            {couponResult.message}
          </Alert>
        )}
      </Box>

      <Box sx={{ height: 24 }} aria-hidden />
    </Box>
  );
};

export default PlanScreen;
