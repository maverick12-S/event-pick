import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Collapse, Grid, InputBase, Typography } from '@mui/material';
import { FiArrowLeft, FiCalendar, FiClock, FiFileText, FiSearch, FiX } from 'react-icons/fi';
import { type PostDraftItem } from '../../../api/db/postDrafts.db.ts';
import postManagementMockApi from '../../../api/mock/postManagementMockApi';

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
};

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const DraftCard: React.FC<{
  item: PostDraftItem;
  onUse: (item: PostDraftItem) => void;
}> = ({ item, onUse }) => (
  <Box
    sx={{
      borderRadius: '10px',
      border: '1px solid rgba(206,224,246,0.2)',
      background: 'linear-gradient(160deg, rgba(14,28,52,0.9) 0%, rgba(10,20,40,0.95) 100%)',
      boxShadow: '0 4px 16px rgba(2,8,22,0.35)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'box-shadow 0.2s, border-color 0.2s',
      '&:hover': {
        boxShadow: '0 8px 28px rgba(2,8,22,0.5)',
        borderColor: 'rgba(206,224,246,0.32)',
      },
    }}
  >
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Box
        sx={{
          width: { xs: 106, sm: 116 },
          flexShrink: 0,
          borderRight: '1px solid rgba(200,220,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.65,
          px: 1,
          py: 1.2,
          background: 'linear-gradient(160deg, rgba(35,58,92,0.4) 0%, rgba(24,40,66,0.2) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
          <FiCalendar style={{ color: 'rgba(160,200,255,0.6)', fontSize: '0.72rem' }} />
          <Typography sx={{ color: '#d7e8ff', fontSize: '0.68rem', fontWeight: 700 }}>
            保存日
          </Typography>
        </Box>
        <Typography sx={{ color: '#f0f6ff', fontSize: '0.74rem', fontWeight: 700, lineHeight: 1.2 }}>
          {formatDate(item.savedAt)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
          <FiClock style={{ color: 'rgba(160,200,255,0.55)', fontSize: '0.68rem' }} />
          <Typography sx={{ color: 'rgba(190,215,255,0.72)', fontSize: '0.68rem' }}>{formatTime(item.savedAt)}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0.85, minWidth: 0 }}>
        <Typography
          sx={{
            color: '#eef4ff',
            fontSize: '1.02rem',
            fontWeight: 700,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 54,
          }}
        >
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6 }}>
          <FiFileText style={{ color: 'rgba(160,200,255,0.55)', fontSize: '0.78rem', marginTop: 2, flexShrink: 0 }} />
          <Typography
            sx={{
              color: 'rgba(180,210,250,0.65)',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 58,
            }}
          >
            {item.summary || '説明概要が未入力です。'}
          </Typography>
        </Box>

        <Box
          sx={{
            minHeight: 34,
            borderRadius: '6px',
            border: '1px solid rgba(160,200,255,0.2)',
            backgroundColor: 'rgba(160,200,255,0.06)',
            px: 0.8,
            py: 0.45,
            display: 'flex',
            alignItems: 'center',
            gap: 0.55,
          }}
        >
          <Typography sx={{ color: 'rgba(170,205,255,0.62)', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
            カテゴリー:
          </Typography>
          <Typography
            sx={{
              color: '#dcecff',
              fontSize: '0.74rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.category || '未設定'}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: 108,
          flexShrink: 0,
          borderLeft: '1px solid rgba(200,220,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.8,
          py: 1,
        }}
      >
      <ButtonBase
        onClick={() => onUse(item)}
        sx={{
          width: '100%',
          minHeight: 44,
          borderRadius: '8px',
          border: '1px solid rgba(120,180,255,0.38)',
          background: 'linear-gradient(165deg, rgba(36,93,178,0.9), rgba(31,75,145,0.9))',
          color: '#f5faff',
          fontWeight: 700,
          fontSize: '0.79rem',
          lineHeight: 1,
          px: 0.5,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          '&:hover': { filter: 'brightness(1.08)' },
        }}
      >
        下書きを反映
      </ButtonBase>
      </Box>
    </Box>
  </Box>
);

const PostDraftsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [savedWithinDays, setSavedWithinDays] = useState<'all' | 7 | 30 | 90>('all');

  const drafts = useMemo(() => postManagementMockApi.listPostDrafts(), []);
  const categories = useMemo(
    () => Array.from(new Set(drafts.map((item) => item.category).filter(Boolean))),
    [drafts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();

    return drafts.filter((item) => {
      const textMatched = !q
        || item.title.toLowerCase().includes(q)
        || item.summary.toLowerCase().includes(q)
        || formatDate(item.savedAt).includes(q);

      if (!textMatched) return false;

      const categoryMatched = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      if (!categoryMatched) return false;

      if (savedWithinDays === 'all') return true;
      const savedAtMs = new Date(item.savedAt).getTime();
      return now - savedAtMs <= savedWithinDays * 24 * 60 * 60 * 1000;
    });
  }, [drafts, query, selectedCategories, savedWithinDays]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    );
  };

  const handleUseDraft = (item: PostDraftItem) => {
    navigate('/posts/create', {
      state: {
        restoreForm: {
          title: item.title,
          images: item.images,
          summary: item.summary,
          detail: item.detail,
          reservation: item.reservation,
          address: item.address,
          venueName: item.venueName,
          budget: item.budget,
          startTime: item.startTime,
          endTime: item.endTime,
          category: item.category,
        },
      },
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px))',
        display: 'flex',
        flexDirection: 'column',
        pb: '22px',
      }}
    >
      <Box
        sx={{
          flex: 1,
          px: { xs: 1.25, sm: 2, md: 2.5 },
          pb: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            mt: { xs: 1, md: 1.5 },
            borderRadius: { xs: '14px', md: '16px' },
            border: '1px solid rgba(236,244,255,0.32)',
            background:
              'radial-gradient(circle at 50% 52%, rgba(8,24,48,0) 0%, rgba(9,26,52,0.4) 52%, rgba(255,255,255,0.22) 100%), linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.09))',
            boxShadow: 'inset 0 1px 0 rgba(248,252,255,0.34), 0 12px 28px rgba(2,8,22,0.34)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 0.75, sm: 1.1 },
              px: { xs: 1.5, md: 2 },
              py: { xs: 1.25, md: 1.5 },
              borderBottom: '1px solid rgba(206,224,246,0.45)',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: { xs: 1, md: '0 1 auto' } }}>
              <ButtonBase
                onClick={() => navigate('/posts/create')}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '999px',
                  border: '1px solid rgba(194,216,243,0.55)',
                  backgroundColor: 'rgba(235,245,255,0.12)',
                  color: '#ddeeff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                }}
              >
                <FiArrowLeft />
              </ButtonBase>
              <Typography sx={{ color: '#f4f8ff', fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700 }}>
                投稿下書き一覧
              </Typography>
            </Box>

            <Typography sx={{ color: 'rgba(220,236,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>
              {drafts.length} 件の下書き
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1.05, borderBottom: '1px solid rgba(206,224,246,0.2)' }}>
            <Box
              onClick={() => setFilterOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
                border: '1px solid rgba(194, 216, 243, 0.58)',
                backgroundColor: 'rgba(235, 245, 255, 0.12)',
                px: 1.1,
                py: 0.35,
                gap: 0.7,
                minHeight: 38,
              }}
            >
              <FiSearch style={{ color: 'rgba(241, 249, 255, 0.98)', fontSize: '0.95rem' }} />
              <InputBase
                value={query}
                onFocus={() => setFilterOpen(true)}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="イベントタイトルで検索"
                inputProps={{ 'aria-label': 'イベントタイトルで検索' }}
                sx={{
                  flex: 1,
                  color: '#f2f8ff',
                  fontSize: '0.88rem',
                  '& input::placeholder': {
                    color: 'rgba(221, 235, 250, 0.78)',
                    opacity: 1,
                  },
                }}
              />
              <ButtonBase
                onClick={(event) => {
                  event.stopPropagation();
                  setFilterOpen((open) => !open);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '999px',
                  color: filterOpen ? '#f07090' : '#ddeeff',
                  border: filterOpen ? '1px solid rgba(235,97,131,0.45)' : '1px solid rgba(194,216,243,0.35)',
                }}
              >
                {filterOpen ? <FiX size={13} /> : <FiSearch size={13} />}
              </ButtonBase>
            </Box>

            <Collapse in={filterOpen} timeout={220}>
              <Box sx={{ mt: 1.05, p: 1, borderRadius: '10px', border: '1px solid rgba(188,212,241,0.24)', backgroundColor: 'rgba(20,35,58,0.34)' }}>
                <Typography sx={{ color: 'rgba(214,230,250,0.86)', fontSize: '0.74rem', fontWeight: 700, mb: 0.7 }}>
                  カテゴリーで絞り込み
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 0.9 }}>
                  {categories.map((category) => {
                    const active = selectedCategories.includes(category);
                    return (
                      <ButtonBase
                        key={category}
                        onClick={() => toggleCategory(category)}
                        sx={{
                          px: 1,
                          py: 0.36,
                          borderRadius: '999px',
                          border: active
                            ? '1px solid rgba(120,180,255,0.8)'
                            : '1px solid rgba(188,212,241,0.36)',
                          backgroundColor: active
                            ? 'rgba(36,93,178,0.3)'
                            : 'rgba(235,245,255,0.06)',
                          color: active ? '#dff0ff' : 'rgba(214,230,250,0.86)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                        }}
                      >
                        {category}
                      </ButtonBase>
                    );
                  })}
                </Box>

                <Typography sx={{ color: 'rgba(214,230,250,0.86)', fontSize: '0.74rem', fontWeight: 700, mb: 0.6 }}>
                  保存日時で絞り込み
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {[
                    { label: 'すべて', value: 'all' as const },
                    { label: '7日以内', value: 7 as const },
                    { label: '30日以内', value: 30 as const },
                    { label: '90日以内', value: 90 as const },
                  ].map((option) => {
                    const active = savedWithinDays === option.value;
                    return (
                      <ButtonBase
                        key={option.label}
                        onClick={() => setSavedWithinDays(option.value)}
                        sx={{
                          px: 1,
                          py: 0.36,
                          borderRadius: '999px',
                          border: active
                            ? '1px solid rgba(120,180,255,0.8)'
                            : '1px solid rgba(188,212,241,0.36)',
                          backgroundColor: active
                            ? 'rgba(36,93,178,0.3)'
                            : 'rgba(235,245,255,0.06)',
                          color: active ? '#dff0ff' : 'rgba(214,230,250,0.86)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                        }}
                      >
                        {option.label}
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ p: { xs: 1.25, md: 1.5 } }}>
            {filtered.length === 0 ? (
              <Box
                sx={{
                  borderRadius: '10px',
                  border: '1px dashed rgba(188,212,241,0.36)',
                  backgroundColor: 'rgba(20,35,58,0.34)',
                  p: { xs: 2.2, md: 2.6 },
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'rgba(214,230,250,0.9)', fontSize: '0.95rem', fontWeight: 700, mb: 0.5 }}>
                  下書きが見つかりません
                </Typography>
                <Typography sx={{ color: 'rgba(183,206,233,0.72)', fontSize: '0.8rem' }}>
                  投稿作成画面で「下書保存」するとここに表示されます。
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={1.2}>
                {filtered.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                    <DraftCard item={item} onUse={handleUseDraft} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDraftsScreen;
