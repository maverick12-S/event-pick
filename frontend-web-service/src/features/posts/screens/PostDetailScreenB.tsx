/**
 * PostDetailScreenB — 投稿詳細画面 (デザイン案 B · モダンリニューアル)
 * ─────────────────────────────────────────────
 * 縦スクロール・情報カードスタック型（構成・背景色は案Bを完全踏襲）
 *
 * アップグレード内容:
 *   - フルワイドカルーセル + ボトムグラデーションオーバーレイにタイトルを重ねる
 *   - サムネイルドットを下部に配置し視認性を強化
 *   - 基本情報は横並びアイコンバッジ、数字・日付は大きくタイポグラフィで表示
 *   - 概要・詳細テキストは読みやすいラインハイトとトラッキング設定
 *   - 予約ボタンはホバーアニメーション付きのCTAデザイン
 *   - セクション区切りは洗練されたドット＋グラデーションライン
 *   - エリアマップはワイドアスペクト・角丸で高品質な見た目に
 *
 * 配置ファイル:
 *   frontend-web-service/src/features/posts/screens/PostDetailScreenB.tsx
 *
 * ルーティング追加 (routes/index.tsx):
 *   { path: '/posts/:tab/:id', element: lazyLoad(() => import('../features/posts/screens/PostDetailScreenB')) }
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, ButtonBase, Chip, MenuItem, Select, TextField, Typography } from '@mui/material';
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiTag,
  FiExternalLink,
  FiCalendar,
  FiAlignLeft,
  FiFileText,
} from 'react-icons/fi';
import postManagementMockApi from '../../../api/mock/postManagementMockApi';
import { CarouselIndicator } from '../components';

/* ─────────────────────────────────────────────
   カテゴリーカラーパレット
───────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  食事: '#e74c6f',
  体験: '#2e86de',
  買い物: '#f39c12',
  イベント: '#8e44ad',
  ライブ: '#e84393',
  観光: '#27ae60',
  祭り: '#d35400',
  温泉: '#16a085',
  車: '#2c3e50',
};

interface ScheduledEditForm {
  title: string;
  category: string;
  ward: string;
  venue: string;
  description: string;
  timeLabel: string;
  nextPostDate: string;
  reservationContact: string;
}

const createScheduledEditForm = (params: {
  title: string;
  category: string;
  ward: string;
  venue: string;
  description: string;
  timeLabel: string;
  nextPostDate: string;
  reservationContact: string;
}): ScheduledEditForm => ({
  title: params.title,
  category: params.category,
  ward: params.ward,
  venue: params.venue,
  description: params.description,
  timeLabel: params.timeLabel,
  nextPostDate: params.nextPostDate,
  reservationContact: params.reservationContact,
});

/* ─────────────────────────────────────────────
   共通カードスタイル（案Bの白カード構成を保持）
───────────────────────────────────────────── */
const glassCardSx = {
  borderRadius: '20px',
  border: '1px solid rgba(228, 232, 238, 0.86)',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(20, 48, 84, 0.10), 0 1.5px 4px rgba(20,48,84,0.06)',
};

/* ─────────────────────────────────────────────
   セクションヘッダー（アクセントライン付き）
───────────────────────────────────────────── */
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  size?: 'lg' | 'md';
}> = ({ icon, label, size = 'md' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: size === 'lg' ? 1.75 : 1.35 }}>
    <Box
      sx={{
        width: size === 'lg' ? 36 : 30,
        height: size === 'lg' ? 36 : 30,
        borderRadius: '10px',
        background: 'linear-gradient(145deg, #ddeeff, #eef5ff)',
        border: '1px solid rgba(171,198,236,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a6fa5',
        fontSize: size === 'lg' ? '1.05rem' : '0.9rem',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        color: '#1a2e4a',
        fontWeight: 800,
        fontSize: size === 'lg'
          ? { xs: '1.35rem', md: '1.6rem' }
          : { xs: '1.05rem', md: '1.18rem' },
        letterSpacing: '-0.01em',
        lineHeight: 1.25,
      }}
    >
      {label}
    </Typography>
  </Box>
);

/* ─────────────────────────────────────────────
   情報バッジ（開催日・時間・場所）
───────────────────────────────────────────── */
const InfoBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}> = ({ icon, label, value, fullWidth }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      p: '12px 16px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #f4f9ff 0%, #eef5ff 100%)',
      border: '1px solid rgba(171,198,236,0.45)',
      gridColumn: fullWidth ? { xs: '1', sm: '1 / -1' } : undefined,
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 4px 12px rgba(74,112,165,0.12)' },
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: '11px',
        background: 'linear-gradient(145deg, #ddeeff, #c8e0fa)',
        border: '1px solid rgba(171,198,236,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3a6098',
        fontSize: '1.05rem',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{ color: '#7a9cc4', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.2 }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: '#1a2e4a', fontSize: '0.97rem', fontWeight: 700, lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

/* ─────────────────────────────────────────────
   セクション区切り線
───────────────────────────────────────────── */
const SectionDivider: React.FC = () => (
  <Box sx={{ my: { xs: 2.4, md: 2.8 }, display: 'flex', alignItems: 'center', gap: 1.25 }}>
    <Box
      sx={{
        width: 9,
        height: 9,
        borderRadius: 999,
        background: 'linear-gradient(145deg, #5f88bd, #8fb2df)',
        boxShadow: '0 0 0 3px rgba(143,178,223,0.2)',
        flexShrink: 0,
      }}
    />
    <Box
      sx={{
        flex: 1,
        height: 1.5,
        background:
          'linear-gradient(90deg, rgba(122,160,209,0.55) 0%, rgba(122,160,209,0.18) 55%, rgba(122,160,209,0) 100%)',
        borderRadius: 999,
      }}
    />
  </Box>
);

/* ─────────────────────────────────────────────
   本文テキストブロック
───────────────────────────────────────────── */
const TextBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      px: { xs: 1.6, md: 2 },
      py: { xs: 1.4, md: 1.6 },
      borderRadius: '14px',
      background: 'linear-gradient(160deg, rgba(245,250,255,0.9) 0%, rgba(252,254,255,0.95) 100%)',
      border: '1px solid rgba(171,198,236,0.28)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
    }}
  >
    {children}
  </Box>
);

/* ─────────────────────────────────────────────
   メイン画面
───────────────────────────────────────────── */
const PostDetailScreenB: React.FC = () => {
  const { tab, id } = useParams<{ tab: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isScheduledEditMode = tab === 'scheduled' && searchParams.get('mode') === 'edit';

  const previewForm = (location.state as {
    previewForm?: {
      title: string;
      images: string[];
      summary: string;
      detail: string;
      reservation: string;
      address: string;
      venueName: string;
      budget: string;
      startTime: string;
      endTime: string;
      category: string;
    };
    returnTo?: string;
  } | null)?.previewForm;

  const previewReturnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const previewFrom = (location.state as { from?: 'posts' | 'reservations' } | null)?.from;
  const previewRestoreSelectedPostDates = (location.state as { restoreSelectedPostDates?: string[] } | null)?.restoreSelectedPostDates;
  const previewRestoreAutoPostEnabled = (location.state as { restoreAutoPostEnabled?: boolean } | null)?.restoreAutoPostEnabled;

  const event = useMemo(() => postManagementMockApi.findPostEventByRoute(tab, id), [tab, id]);
  const scheduledPost = useMemo(() => {
    if (tab !== 'scheduled') return null;
    return postManagementMockApi.findScheduledPostById(id);
  }, [tab, id]);

  const isPreviewMode = Boolean(previewForm);

  const [editForm, setEditForm] = useState<ScheduledEditForm | null>(null);

  const baseTitle = previewForm?.title || scheduledPost?.title || event?.title || '';
  const baseCategory = previewForm?.category || scheduledPost?.category || event?.category || '';
  const baseWard = previewForm
    ? (previewForm.address?.split(/[\s、,]+/).find(Boolean) || '入力中')
    : (scheduledPost?.ward || event?.ward || '');
  const baseVenue = previewForm?.venueName || scheduledPost?.venue || event?.venue || '';
  const baseDescription = previewForm?.summary || scheduledPost?.description || event?.description || '';
  const baseTimeLabel = previewForm
    ? (previewForm.startTime && previewForm.endTime
      ? `${previewForm.startTime}-${previewForm.endTime}`
      : previewForm.startTime || previewForm.endTime || '未設定')
    : (scheduledPost?.timeLabel || event?.timeLabel || '未設定');
  const baseDateLabel = isPreviewMode ? '入力中プレビュー' : (scheduledPost?.dateLabel || event?.dateLabel || '');
  const baseBudgetLabel = previewForm?.budget || '￥3,000～￥3,999';
  const baseReservationContact = previewForm?.reservation || event?.reservationContact || 'https://www.google.com/';
  const baseNextPostDate = scheduledPost?.nextPostDate || '';

  useEffect(() => {
    if (!isScheduledEditMode || !scheduledPost) {
      setEditForm(null);
      return;
    }

    setEditForm(createScheduledEditForm({
      title: baseTitle,
      category: baseCategory,
      ward: baseWard,
      venue: baseVenue,
      description: baseDescription,
      timeLabel: baseTimeLabel,
      nextPostDate: baseNextPostDate,
      reservationContact: baseReservationContact,
    }));
  }, [
    isScheduledEditMode,
    scheduledPost,
    baseTitle,
    baseCategory,
    baseWard,
    baseVenue,
    baseDescription,
    baseTimeLabel,
    baseNextPostDate,
    baseReservationContact,
  ]);

  const title = editForm?.title ?? baseTitle;
  const category = editForm?.category ?? baseCategory;
  const ward = editForm?.ward ?? baseWard;
  const venue = editForm?.venue ?? baseVenue;
  const description = editForm?.description ?? baseDescription;
  const timeLabel = editForm?.timeLabel ?? baseTimeLabel;
  const dateLabel = isPreviewMode ? '入力中プレビュー' : (editForm?.nextPostDate || baseDateLabel);
  const budgetLabel = baseBudgetLabel;
  const reservationContact = editForm?.reservationContact ?? baseReservationContact;

  const imageUrls = useMemo(() => {
    if (previewForm) {
      if (previewForm.images.length > 0) return previewForm.images.slice(0, 10);
      return ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'];
    }

    if (scheduledPost) {
      return [scheduledPost.imageUrl];
    }

    if (!event) return [];
    return event.imageUrls?.length ? event.imageUrls.slice(0, 10) : [event.imageUrl];
  }, [event, previewForm, scheduledPost]);

  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  /* ── 存在しないイベント ── */
  if (!event && !previewForm && !scheduledPost) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #ddeeff, #eef5ff)',
            border: '1px solid rgba(171,198,236,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#7a9cc4',
          }}
        >
          🔍
        </Box>
        <Typography sx={{ color: '#1a2e4a', fontSize: '1.15rem', fontWeight: 700 }}>
          イベントが見つかりませんでした
        </Typography>
        <ButtonBase
          onClick={() => navigate(-1)}
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.6,
            color: '#2f4a78', fontSize: '0.9rem', fontWeight: 700,
            borderRadius: 999, px: 1.75, py: 0.9,
            border: '1px solid rgba(171,198,236,0.56)',
            backgroundColor: '#f8fbff',
            '&:hover': { backgroundColor: '#eef5ff' },
          }}
        >
          <FiArrowLeft /> 一覧へ戻る
        </ButtonBase>
      </Box>
    );
  }

  const chipColor = CATEGORY_COLORS[category] ?? '#4a6fa5';
  const encodedVenue = encodeURIComponent(`${ward} ${venue || previewForm?.address || ''}`);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodedVenue}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodedVenue}&output=embed&z=15&hl=ja`;
  const eventDetailSeed = previewForm?.detail
    || (
      `【${title}｜公式ご案内】\n\n` +
      `季節の空気と街の魅力を、五感で楽しんでいただくための特別企画として本イベントを開催します。` +
      `会場は${venue}。${dateLabel} ${timeLabel} の時間帯で、` +
      `「おいしい」「たのしい」「つながる」をテーマに、地域の個性が伝わるコンテンツを丁寧に編成しました。`
    );
  const normalizedEventDetailText = eventDetailSeed.replace(/[。]+$/u, '');
  const clippedEventDetailText = normalizedEventDetailText.slice(0, 1399);
  const eventDetailText = `${clippedEventDetailText.padEnd(1, ' ')}。`;
  const isPhoneContact = /^tel:/i.test(reservationContact)
    || (/^[+\d][\d\s\-()]{7,}$/.test(reservationContact) && !/^https?:\/\//i.test(reservationContact));

  const canSaveScheduledEdit = Boolean(
    isScheduledEditMode
    && editForm
    && scheduledPost
    && (
      editForm.title !== scheduledPost.title
      || editForm.category !== scheduledPost.category
      || editForm.ward !== scheduledPost.ward
      || editForm.venue !== scheduledPost.venue
      || editForm.description !== scheduledPost.description
      || editForm.timeLabel !== scheduledPost.timeLabel
      || editForm.nextPostDate !== scheduledPost.nextPostDate
    ),
  );

  const handleSaveScheduledEdit = () => {
    if (!scheduledPost || !editForm) return;

    const saved = postManagementMockApi.updateScheduledPostById(scheduledPost.id, {
      title: editForm.title,
      category: editForm.category,
      ward: editForm.ward,
      venue: editForm.venue,
      description: editForm.description,
      timeLabel: editForm.timeLabel,
      nextPostDate: editForm.nextPostDate,
    });

    if (!saved) return;

    navigate(`/posts/scheduled/${saved.id}`, { replace: true });
  };

  const handleCancelScheduledEdit = () => {
    if (!scheduledPost) {
      navigate('/posts/scheduled');
      return;
    }
    navigate(`/posts/scheduled/${scheduledPost.id}`, { replace: true });
  };

  const openReservationContact = () => {
    const contact = reservationContact.trim();
    if (!contact) return;

    if (isPhoneContact) {
      const digitsOnly = contact.replace(/^tel:/i, '').replace(/[^\d+]/g, '');
      if (!digitsOnly) return;
      window.location.href = `tel:${digitsOnly}`;
      return;
    }

    const targetUrl = /^https?:\/\//i.test(contact) ? contact : `https://${contact}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(imageUrls.length - 1, i + 1));

  const onTouchStart: React.TouchEventHandler = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 24) return;
    dx < 0 ? next() : prev();
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1160,
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 2.5 },
        py: { xs: 2, md: 3 },
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.8,
      }}
    >

      {/* ── 戻るボタン ── */}
      <Box>
        <ButtonBase
          onClick={() => {
            if (isPreviewMode && previewForm) {
              navigate(previewReturnTo || '/posts/create', {
                state: {
                  restoreForm: previewForm,
                  from: previewFrom,
                  restoreSelectedPostDates: previewRestoreSelectedPostDates,
                  restoreAutoPostEnabled: previewRestoreAutoPostEnabled,
                },
              });
              return;
            }
            if (isScheduledEditMode) {
              handleCancelScheduledEdit();
              return;
            }
            navigate(-1);
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.7,
            color: '#2f4a78',
            fontSize: '0.93rem',
            fontWeight: 700,
            borderRadius: 999,
            px: 1.6,
            py: 0.85,
            border: '1px solid rgba(171,198,236,0.56)',
            backgroundColor: '#f8fbff',
            boxShadow: '0 2px 8px rgba(74,112,165,0.08)',
            transition: 'background 0.18s, box-shadow 0.18s',
            '&:hover': {
              backgroundColor: '#eef5ff',
              boxShadow: '0 4px 14px rgba(74,112,165,0.14)',
            },
          }}
        >
          <FiArrowLeft />
          {isPreviewMode ? '投稿作成に戻る' : isScheduledEditMode ? '編集を終了する' : '投稿一覧に戻る'}
        </ButtonBase>
      </Box>

      {isScheduledEditMode && editForm && (
        <Box
          sx={{
            ...glassCardSx,
            p: { xs: 1.6, md: 2.1 },
            border: '1px solid rgba(235,97,131,0.38)',
            boxShadow: '0 10px 22px rgba(35, 14, 34, 0.18)',
          }}
        >
          <Typography sx={{ color: '#8f2e4b', fontWeight: 800, fontSize: { xs: '1rem', md: '1.08rem' }, mb: 1.2 }}>
            予約投稿を編集
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1 }}>
            <TextField
              size="small"
              label="タイトル"
              value={editForm.title}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
            />
            <TextField
              size="small"
              label="市区"
              value={editForm.ward}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, ward: event.target.value } : prev))}
            />
            <TextField
              size="small"
              label="会場名"
              value={editForm.venue}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, venue: event.target.value } : prev))}
            />

            <Select
              size="small"
              value={editForm.category}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, category: event.target.value } : prev))}
              sx={{ minHeight: 40 }}
            >
              {Object.keys(CATEGORY_COLORS).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>

            <TextField
              size="small"
              label="時間帯"
              placeholder="18:00-20:00"
              value={editForm.timeLabel}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, timeLabel: event.target.value } : prev))}
            />
            <TextField
              size="small"
              label="次回投稿日"
              type="date"
              value={editForm.nextPostDate}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, nextPostDate: event.target.value } : prev))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              size="small"
              label="概要"
              value={editForm.description}
              onChange={(event) => setEditForm((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
              multiline
              minRows={2}
              sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.8, mt: 1.2 }}>
            <ButtonBase
              onClick={handleCancelScheduledEdit}
              sx={{
                minHeight: 36,
                px: 1.6,
                borderRadius: 999,
                border: '1px solid rgba(171,198,236,0.56)',
                backgroundColor: '#f8fbff',
                color: '#2f4a78',
                fontSize: '0.86rem',
                fontWeight: 700,
              }}
            >
              キャンセル
            </ButtonBase>

            <ButtonBase
              onClick={handleSaveScheduledEdit}
              disabled={!canSaveScheduledEdit}
              sx={{
                minHeight: 36,
                px: 1.6,
                borderRadius: 999,
                border: '1px solid rgba(255,182,198,0.5)',
                background: 'linear-gradient(165deg, rgba(235,97,131,0.96), rgba(221,78,116,0.96))',
                color: '#f7fbff',
                fontSize: '0.86rem',
                fontWeight: 700,
                opacity: canSaveScheduledEdit ? 1 : 0.55,
              }}
            >
              保存する
            </ButtonBase>
          </Box>
        </Box>
      )}

      {/* ══════════════════════════════════
          1. フルワイドカルーセル
      ══════════════════════════════════ */}
      <Box sx={{ ...glassCardSx, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: { xs: '16/10', md: '21/9' },
            touchAction: 'pan-y',
            overflow: 'hidden',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* メイン画像 */}
          <Box
            component="img"
            src={imageUrls[activeIdx]}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
          />

          {/* ボトムグラデーション */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background:
                'linear-gradient(to top, rgba(10,20,40,0.82) 0%, rgba(10,20,40,0.45) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* 左矢印 */}
          {activeIdx > 0 && (
            <ButtonBase
              onClick={prev}
              aria-label="前の画像"
              sx={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: 999,
                background: 'rgba(5,15,32,0.52)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s',
                '&:hover': { background: 'rgba(5,15,32,0.72)' },
              }}
            >
              ‹
            </ButtonBase>
          )}

          {/* 右矢印 */}
          {activeIdx < imageUrls.length - 1 && (
            <ButtonBase
              onClick={next}
              aria-label="次の画像"
              sx={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: 999,
                background: 'rgba(5,15,32,0.52)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s',
                '&:hover': { background: 'rgba(5,15,32,0.72)' },
              }}
            >
              ›
            </ButtonBase>
          )}

          {/* インジケータードット */}
          <CarouselIndicator total={imageUrls.length} currentIndex={activeIdx} />
        </Box>

        {/* ── サムネイルストリップ ── */}
        {imageUrls.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              px: { xs: 1.2, sm: 1.5, md: 1.75 },
              py: { xs: 1, sm: 1.15, md: 1.25 },
              overflowX: 'auto',
              background: 'linear-gradient(180deg, #f9fbfe 0%, #f3f8ff 100%)',
              borderTop: '1px solid rgba(171,198,236,0.35)',
              scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { borderRadius: 999, backgroundColor: 'rgba(74,112,165,0.24)' },
            }}
          >
            {imageUrls.slice(0, 10).map((url, i) => (
              <ButtonBase
                key={i}
                onClick={() => setActiveIdx(i)}
                sx={{
                  flexShrink: 0,
                  width: { xs: 72, sm: 76, md: 82 },
                  height: { xs: 48, sm: 52, md: 56 },
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: i === activeIdx
                    ? '2.5px solid #4a7fd4'
                    : '1.5px solid rgba(171,198,236,0.45)',
                  opacity: i === activeIdx ? 1 : 0.72,
                  boxShadow: i === activeIdx ? '0 6px 16px rgba(74,127,212,0.25)' : 'none',
                  scrollSnapAlign: 'start',
                  transition: 'opacity 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  '&:hover': { opacity: 1, transform: 'translateY(-1px)' },
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt=""
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </ButtonBase>
            ))}
          </Box>
        )}
      </Box>

      {/* ══════════════════════════════════
          2. イベント基本情報カード
      ══════════════════════════════════ */}
      <Box sx={{ ...glassCardSx, p: { xs: 2.2, md: 3 } }}>

        {/* イベント名 */}
        <Typography
          component="h1"
          sx={{
            color: '#0f1e35',
            fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.6rem' },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            mb: 0.75,
          }}
        >
          {title || 'タイトル未入力'}
        </Typography>

        {/* カテゴリー・エリアチップ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
          <FiTag style={{ color: '#7a9cc4', fontSize: '0.85rem' }} />
          {[category, ward].map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                backgroundColor: label === category ? chipColor : '#eef4ff',
                color: label === category ? '#fff' : '#2d5080',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.02em',
                border:
                  label === category
                    ? '1px solid rgba(0,0,0,0.08)'
                    : '1px solid rgba(171,198,236,0.55)',
                height: 26,
              }}
            />
          ))}
        </Box>

        {/* 基本情報バッジグリッド */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.25,
            mb: 0,
          }}
        >
          <InfoBadge icon={<FiCalendar />} label="開催日" value={dateLabel} />
          <InfoBadge icon={<FiClock />} label="時間帯" value={timeLabel} />
          <InfoBadge icon={<FiMapPin />} label="会場名" value={venue || '未入力'} />
          <InfoBadge icon={<FiTag />} label="予算" value={budgetLabel} />
        </Box>

        {/* ── セクション区切り ── */}
        <SectionDivider />

        {/* 概要 */}
        <SectionHeader icon={<FiAlignLeft />} label="概要" size="lg" />
        <TextBlock>
          <Typography
            sx={{
              color: '#2e4564',
              fontSize: { xs: '1rem', md: '1.05rem' },
              lineHeight: 1.95,
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {description || '概要未入力'}
          </Typography>
        </TextBlock>

        {/* ── セクション区切り ── */}
        <SectionDivider />

        {/* 詳細説明 */}
        <SectionHeader icon={<FiFileText />} label="イベント詳細" size="md" />
        <Typography
          sx={{
            color: '#2e4564',
            fontSize: { xs: '0.94rem', md: '0.99rem' },
            lineHeight: 1.95,
            fontWeight: 500,
            letterSpacing: '0.01em',
            whiteSpace: 'pre-line',
            px: { xs: 0.15, md: 0.2 },
            height: 'auto',
            overflow: 'visible',
            maxWidth: '100%',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {eventDetailText}
        </Typography>
      </Box>

      {/* ══════════════════════════════════
          3. 予約セクション
      ══════════════════════════════════ */}
      <Box sx={{ ...glassCardSx, p: { xs: 2.2, md: 2.8 }, border: '1px solid rgba(228, 232, 238, 0.86)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
          <Typography sx={{ color: '#1f2f45', fontWeight: 700, fontSize: '1.15rem' }}>
            予約
          </Typography>
        </Box>

        <Typography sx={{ color: '#5d7aa2', fontSize: '0.86rem', mb: 0.7, fontWeight: 600 }}>
          連絡先（電話番号またはリンク）
        </Typography>

        <Box
          component="input"
          readOnly
          value={reservationContact}
          aria-label="予約連絡先"
          sx={{
            width: '100%',
            height: 40,
            px: 1.2,
            mb: 1.4,
            borderRadius: 1.25,
            border: '1px solid rgba(171, 198, 236, 0.58)',
            backgroundColor: '#f8fbff',
            color: '#2b4368',
            fontSize: '0.97rem',
            fontFamily: 'inherit',
            lineHeight: 1,
            outline: 'none',
          }}
        />

        <ButtonBase
          onClick={openReservationContact}
          sx={{
            width: '100%', py: 1.55, borderRadius: 999,
            background: 'linear-gradient(165deg, rgba(235,97,131,0.96), rgba(221,78,116,0.96))',
            color: '#f7fbff', fontWeight: 700, fontSize: '1.12rem',
            letterSpacing: '0.04em',
            border: '1px solid rgba(255,182,198,0.5)',
            boxShadow: '0 6px 16px rgba(35,14,34,0.36), inset 0 1px 0 rgba(255,226,233,0.34)',
            transition: 'background 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8,
            '&:hover': { filter: 'brightness(1.08)' },
          }}
        >
          {isPhoneContact ? '電話で予約する' : '予約ページを開く'}
        </ButtonBase>
      </Box>

      {/* ══════════════════════════════════
          4. エリアマップ
      ══════════════════════════════════ */}
      <Box sx={{ ...glassCardSx, overflow: 'hidden' }}>

        {/* マップヘッダー */}
        <Box
          sx={{
            px: 2.25,
            py: 1.75,
            borderBottom: '1px solid rgba(171,198,236,0.35)',
            background: 'linear-gradient(135deg, #f8fbff 0%, #f3f8ff 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              sx={{ color: '#0f1e35', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em', mb: 0.4 }}
            >
              エリアマップ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <FiMapPin style={{ color: '#4a6fa5', fontSize: '0.88rem' }} />
              <Typography sx={{ color: '#4d6a8a', fontSize: '0.88rem', fontWeight: 500 }}>
                {venue || '会場未入力'}
              </Typography>
            </Box>
          </Box>

          <ButtonBase
            component="a"
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.55,
              px: 1.4,
              py: 0.7,
              borderRadius: '10px',
              border: '1px solid rgba(171,198,236,0.55)',
              backgroundColor: '#fff',
              color: '#2d6ec4',
              fontSize: '0.84rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(74,112,165,0.1)',
              transition: 'background 0.18s, box-shadow 0.18s',
              '&:hover': {
                backgroundColor: '#eef5ff',
                boxShadow: '0 4px 12px rgba(74,112,165,0.18)',
              },
            }}
          >
            マップで開く
            <FiExternalLink size={12} />
          </ButtonBase>
        </Box>

        {/* Google Map iFrame */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: { xs: '16/8', md: '21/8' },
          }}
        >
          <Box
            component="iframe"
            src={mapSrc}
            title="エリアマップ"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sx={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </Box>
      </Box>

    </Box>
  );
};

export default PostDetailScreenB;
