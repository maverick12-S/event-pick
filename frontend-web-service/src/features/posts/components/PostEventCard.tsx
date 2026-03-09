import React, { useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, ButtonBase, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import type { PostEventDbItem } from '../../../api/db/posts.screen';
import CarouselIndicator from './CarouselIndicator';

interface PostEventCardProps {
  event: PostEventDbItem;
  onEdit?: (event: PostEventDbItem) => void;
  onDelete?: (event: PostEventDbItem) => void;
}

const PostEventCard: React.FC<PostEventCardProps> = ({ event, onEdit, onDelete }) => {
  const imageUrls = useMemo(() => {
    if (event.imageUrls && event.imageUrls.length > 0) {
      return event.imageUrls.slice(0, 10);
    }
    return [event.imageUrl];
  }, [event.imageUrl, event.imageUrls]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const numericId = Number(event.id.split('-').pop() ?? '1');
  const likeCount = 20 + (Number.isNaN(numericId) ? 0 : numericId % 360);
  const isFirstImage = activeImageIndex <= 0;
  const isLastImage = activeImageIndex >= imageUrls.length - 1;

  const onNextImage = () => {
    setActiveImageIndex((prev) => Math.min(imageUrls.length - 1, prev + 1));
  };

  const onPrevImage = () => {
    setActiveImageIndex((prev) => Math.max(0, prev - 1));
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartXRef.current == null) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) < 24) {
      return;
    }

    if (deltaX < 0) {
      onNextImage();
      return;
    }

    onPrevImage();
  };

  const hasPostMenu = Boolean(onEdit || onDelete);
  const isMenuOpen = Boolean(menuAnchorEl);

  return (
    <Box
      component="article"
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(228, 232, 238, 0.86)',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 1.25, px: 1.5, pt: 1.25, pb: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Box
            aria-hidden
            sx={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'linear-gradient(145deg, #2f466d, #5f80b7)',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            TE
          </Box>
          <Typography
            sx={{
              color: '#222222',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            TOKYO EVENTS CO.
          </Typography>
        </Box>
        <IconButton
          aria-label="投稿メニュー"
          size="small"
          disableRipple
          onClick={(eventButton) => {
            if (!hasPostMenu) return;
            setMenuAnchorEl(eventButton.currentTarget);
          }}
          sx={{
            color: hasPostMenu ? '#1f3d62' : '#7b8da4',
            fontSize: '1.1rem',
            p: 0.2,
            opacity: hasPostMenu ? 1 : 0.62,
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          ⋯
        </IconButton>
      </Box>

      {hasPostMenu && (
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={() => setMenuAnchorEl(null)}
          MenuListProps={{ dense: true }}
          PaperProps={{
            sx: {
              mt: 0.5,
              borderRadius: 1.5,
              border: '1px solid rgba(176, 201, 232, 0.72)',
              backgroundColor: '#10243c',
              boxShadow: '0 10px 24px rgba(2, 8, 22, 0.45)',
              '& .MuiMenuItem-root': {
                color: '#e9f2ff',
                fontSize: '0.84rem',
                fontWeight: 700,
                minHeight: 34,
              },
            },
          }}
        >
          {onEdit && (
            <MenuItem
              onClick={() => {
                onEdit(event);
                setMenuAnchorEl(null);
              }}
              sx={{ '&:hover': { backgroundColor: 'rgba(120, 180, 255, 0.2)' } }}
            >
              編集
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem
              onClick={() => {
                onDelete(event);
                setMenuAnchorEl(null);
              }}
              sx={{
                color: '#ff9fb4',
                '&:hover': { backgroundColor: 'rgba(235,97,131,0.2)' },
              }}
            >
              削除
            </MenuItem>
          )}
        </Menu>
      )}

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'pan-y',
          borderRadius: 1.5,
          mx: 1.5,
          aspectRatio: { xs: '4 / 3', md: '16 / 10' },
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <ButtonBase onClick={onNextImage} aria-label="次の画像へ" sx={{ width: '100%', height: '100%', display: 'block' }}>
          <Box component="img" src={imageUrls[activeImageIndex]} alt={event.title} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </ButtonBase>

        <ButtonBase
          onClick={onPrevImage}
          aria-label="前の画像を表示"
          disabled={isFirstImage}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            display: 'grid',
            justifyItems: 'start',
            alignItems: 'center',
            pl: 1,
            color: 'rgba(244, 250, 255, 0.94)',
            opacity: isFirstImage ? 0.32 : 1,
          }}
        >
          <Box component="span" aria-hidden sx={{ fontSize: 17, fontWeight: 500, transform: 'scaleX(-0.84) scaleY(1.74)', opacity: 0.86 }}>
            {'>'}
          </Box>
        </ButtonBase>

        <ButtonBase
          onClick={onNextImage}
          aria-label="次の画像を表示"
          disabled={isLastImage}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            display: 'grid',
            justifyItems: 'end',
            alignItems: 'center',
            pr: 1,
            color: 'rgba(244, 250, 255, 0.94)',
            opacity: isLastImage ? 0.32 : 1,
          }}
        >
          <Box component="span" aria-hidden sx={{ fontSize: 17, fontWeight: 500, transform: 'scaleX(0.84) scaleY(1.74)', opacity: 0.86 }}>
            {'>'}
          </Box>
        </ButtonBase>

        <CarouselIndicator total={imageUrls.length} currentIndex={activeImageIndex} />
      </Box>

      <Box sx={{ p: '10px 12px 12px', display: 'grid', gridTemplateRows: 'auto auto auto auto 1fr auto', gap: 0.75, minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', mb: 1 }}>
          <Box sx={{ display: 'grid', justifyItems: 'center', alignItems: 'start', gap: 0.25 }}>
            <ButtonBase aria-label="お気に入り" sx={{ color: '#222222', fontSize: '2.1rem', lineHeight: 1 }}>
              ♡
            </ButtonBase>
            <Typography sx={{ fontSize: '0.72rem', color: '#666666', lineHeight: 1 }}>{likeCount}</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.35, letterSpacing: '0.012em', color: '#222222', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.title}
        </Typography>
        <Typography sx={{ color: '#666666', fontSize: '0.78rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>🕒 {event.timeLabel}</Typography>
        <Typography sx={{ color: '#666666', fontSize: '0.78rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {event.venue}</Typography>
        <Box>
          <Typography sx={{ color: '#666666', fontSize: '0.77rem', lineHeight: 1.3 }}>カテゴリー: {event.category}</Typography>
          <Typography sx={{ mt: '2ch', color: '#666666', fontSize: '0.9rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.description}
          </Typography>
        </Box>
        <Box sx={{ justifySelf: 'end' }}>
          <ButtonBase
            component={RouterLink}
            to={event.detailPath}
            sx={{ minHeight: 32, px: 1.75, borderRadius: 999, border: '1px solid rgba(164, 181, 206, 0.72)', backgroundColor: '#f8fbff', color: '#2f4a78', fontSize: '0.78rem', boxShadow: '0 2px 6px rgba(16, 30, 53, 0.12)' }}
          >
            {event.detailLabel}
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default PostEventCard;
