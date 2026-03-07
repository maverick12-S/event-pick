import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Chip, Typography } from '@mui/material';
import { FiArrowLeft, FiClock, FiLink, FiMapPin, FiTag } from 'react-icons/fi';
import { CarouselIndicator } from '../components';

type PreviewPostPayload = {
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

type PreviewLocationState = {
  previewForm?: PreviewPostPayload;
};

const cardSx = {
  borderRadius: '18px',
  border: '1px solid rgba(218, 234, 253, 0.54)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,253,255,0.95))',
  boxShadow: '0 10px 24px rgba(2, 10, 26, 0.22)',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

const PostPreviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PreviewLocationState | null;
  const preview = state?.previewForm;

  const images = useMemo(() => (preview?.images?.length ? preview.images : [fallbackImage]), [preview?.images]);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  if (!preview) {
    return (
      <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Box sx={{ ...cardSx, p: 3, width: '100%', maxWidth: 560, textAlign: 'center' }}>
          <Typography sx={{ color: '#1a2e4a', fontSize: '1.1rem', fontWeight: 800, mb: 1 }}>
            プレビューデータが見つかりません
          </Typography>
          <Typography sx={{ color: '#4a5e72', fontSize: '0.9rem', mb: 2 }}>
            投稿作成画面からもう一度プレビューを開いてください。
          </Typography>
          <ButtonBase
            onClick={() => navigate('/posts/create')}
            sx={{
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid rgba(171,198,236,0.56)',
              backgroundColor: '#f8fbff',
              color: '#2f4a78',
              fontWeight: 700,
            }}
          >
            投稿作成へ戻る
          </ButtonBase>
        </Box>
      </Box>
    );
  }

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartXRef.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 24) return;
    setActiveImage((prev) => (deltaX < 0 ? Math.min(images.length - 1, prev + 1) : Math.max(0, prev - 1)));
  };

  const timeLabel = preview.startTime && preview.endTime
    ? `${preview.startTime} - ${preview.endTime}`
    : preview.startTime || preview.endTime || '未設定';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100dvh',
        px: { xs: 1.2, sm: 2, md: 2.4 },
        pt: { xs: 1.1, md: 1.6 },
        pb: { xs: 4.5, md: 6 },
        background:
          'radial-gradient(circle at 10% 0%, rgba(94, 165, 255, 0.24), rgba(8, 22, 44, 0) 36%), radial-gradient(circle at 88% 14%, rgba(66, 196, 255, 0.2), rgba(8, 22, 44, 0) 34%), linear-gradient(180deg, #081a34 0%, #0b2345 56%, #0f2a50 100%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1120, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.4 }}>
          <ButtonBase
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              px: 1.3,
              py: 0.62,
              border: '1px solid rgba(183, 213, 247, 0.48)',
              backgroundColor: 'rgba(14, 40, 77, 0.6)',
              color: '#dcefff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.7,
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            <FiArrowLeft aria-hidden /> 投稿作成へ戻る
          </ButtonBase>
          <Typography sx={{ color: 'rgba(223, 238, 255, 0.92)', fontSize: '0.76rem', fontWeight: 600 }}>
            入力中プレビュー
          </Typography>
        </Box>

        <Box
          sx={{
            ...cardSx,
            overflow: 'hidden',
            mb: 1.5,
            position: 'relative',
            aspectRatio: '16 / 9',
            border: '1px solid rgba(226, 242, 255, 0.36)',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Box
            component="img"
            src={images[activeImage]}
            alt={preview.title || 'preview-image'}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <CarouselIndicator total={images.length} currentIndex={activeImage} />
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 }, mb: 1.4 }}>
          <Typography sx={{ color: '#10243f', fontSize: { xs: '1.4rem', md: '2.2rem' }, fontWeight: 800, lineHeight: 1.24, mb: 1 }}>
            {preview.title || 'タイトル未入力'}
          </Typography>
          {preview.category && (
            <Chip
              icon={<FiTag />}
              label={preview.category}
              sx={{
                borderRadius: 999,
                border: '1px solid rgba(171,205,255,0.48)',
                backgroundColor: 'rgba(13, 110, 253, 0.16)',
                color: '#244a7c',
                fontWeight: 700,
              }}
            />
          )}
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 }, mb: 1.2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1 }}>
            <Box sx={{ p: 1.1, borderRadius: '12px', backgroundColor: '#f3f9ff', border: '1px solid rgba(184, 207, 233, 0.82)', display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <FiClock size={14} />
              <Typography sx={{ color: '#2d496e', fontSize: '0.82rem', fontWeight: 700 }}>{timeLabel}</Typography>
            </Box>
            <Box sx={{ p: 1.1, borderRadius: '12px', backgroundColor: '#f3f9ff', border: '1px solid rgba(184, 207, 233, 0.82)', display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <FiMapPin size={14} />
              <Typography sx={{ color: '#2d496e', fontSize: '0.82rem', fontWeight: 700 }}>
                {preview.address || '住所未入力'}
              </Typography>
            </Box>
            <Box sx={{ p: 1.1, borderRadius: '12px', backgroundColor: '#f3f9ff', border: '1px solid rgba(184, 207, 233, 0.82)', display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <FiMapPin size={14} />
              <Typography sx={{ color: '#2d496e', fontSize: '0.82rem', fontWeight: 700 }}>
                {preview.venueName || '会場名未入力'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 }, mb: 1.2 }}>
          <Typography sx={{ color: '#122745', fontSize: '1rem', fontWeight: 800, mb: 0.8 }}>概要</Typography>
          <Typography sx={{ color: '#374a5e', fontSize: '0.92rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {preview.summary || '概要未入力'}
          </Typography>
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 }, mb: 1.2 }}>
          <Typography sx={{ color: '#122745', fontSize: '1rem', fontWeight: 800, mb: 0.8 }}>詳細説明</Typography>
          <Typography sx={{ color: '#374a5e', fontSize: '0.92rem', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
            {preview.detail || '詳細説明未入力'}
          </Typography>
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 }, mb: 1.2 }}>
          <Typography sx={{ color: '#122745', fontSize: '1rem', fontWeight: 800, mb: 0.8 }}>予約欄</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <FiLink size={14} color="#2f4f75" />
            <Typography sx={{ color: '#2f4f75', fontSize: '0.9rem', lineHeight: 1.6, wordBreak: 'break-all' }}>
              {preview.reservation || '予約情報未入力'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ ...cardSx, p: { xs: 1.5, md: 2 } }}>
          <Typography sx={{ color: '#122745', fontSize: '1rem', fontWeight: 800, mb: 0.8 }}>予算</Typography>
          <Typography sx={{ color: '#374a5e', fontSize: '0.92rem', fontWeight: 700 }}>
            {preview.budget || '未設定'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PostPreviewScreen;
