import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, Grid, InputBase, MenuItem, Select, Typography } from '@mui/material';
import { FiArrowLeft, FiClock, FiFileText, FiSearch } from 'react-icons/fi';
import { getExecutionHistories } from '../../../api/db/executionHistory.db';
import type { ExecutionHistoryCategory, ExecutionHistoryItem } from '../../../types/models/executionHistory';

const HISTORY_SCREEN_SCALE = 1.2;

const toTimeLabel = (iso: string): string => {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const toDateInputValue = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const categoryOptions: Array<{ value: 'all' | ExecutionHistoryCategory; label: string }> = [
  { value: 'all', label: '全カテゴリ' },
  { value: '投稿', label: '投稿' },
  { value: 'アカウント払出', label: 'アカウント払出' },
  { value: '情報変更', label: '情報変更' },
  { value: '削除', label: '削除' },
  { value: '削除予定', label: '削除予定' },
];

const categoryChipStyle: Record<ExecutionHistoryCategory, { border: string; bg: string; color: string }> = {
  投稿: {
    border: '1px solid rgba(98, 199, 255, 0.7)',
    bg: 'linear-gradient(145deg, rgba(64, 159, 226, 0.24), rgba(24, 95, 171, 0.24))',
    color: '#dff2ff',
  },
  アカウント払出: {
    border: '1px solid rgba(118, 229, 190, 0.7)',
    bg: 'linear-gradient(145deg, rgba(65, 201, 135, 0.24), rgba(31, 151, 95, 0.24))',
    color: '#dffff0',
  },
  情報変更: {
    border: '1px solid rgba(255, 208, 126, 0.74)',
    bg: 'linear-gradient(145deg, rgba(207, 129, 54, 0.24), rgba(157, 82, 24, 0.24))',
    color: '#fff0de',
  },
  削除: {
    border: '1px solid rgba(255, 120, 120, 0.72)',
    bg: 'linear-gradient(145deg, rgba(255, 126, 126, 0.24), rgba(214, 58, 58, 0.24))',
    color: '#ffdede',
  },
  削除予定: {
    border: '1px solid rgba(255, 164, 184, 0.72)',
    bg: 'linear-gradient(145deg, rgba(246, 120, 159, 0.22), rgba(176, 71, 112, 0.22))',
    color: '#ffe2ec',
  },
};

const HistoryCard: React.FC<{ item: ExecutionHistoryItem }> = ({ item }) => {
  const chip = categoryChipStyle[item.category];

  return (
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
            width: { xs: 90, sm: 98 },
            flexShrink: 0,
            borderRight: '1px solid rgba(200,220,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.45,
            px: 1,
            py: 1.2,
            background: 'linear-gradient(160deg, rgba(35,58,92,0.4) 0%, rgba(24,40,66,0.2) 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
            <FiClock style={{ color: 'rgba(160,200,255,0.6)', fontSize: '0.76rem' }} />
            <Typography sx={{ color: '#d7e8ff', fontSize: '0.68rem', fontWeight: 700 }}>実行時間</Typography>
          </Box>
          <Typography sx={{ color: '#f0f6ff', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.2 }}>
            {toTimeLabel(item.executedAt)}
          </Typography>
        </Box>

        <Box sx={{ p: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0.85, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.2, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                color: '#eef4ff',
                fontSize: '0.98rem',
                fontWeight: 700,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.title}
            </Typography>
            <Box
              sx={{
                minHeight: 26,
                borderRadius: 999,
                px: 1.05,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: chip.border,
                background: chip.bg,
                color: chip.color,
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              {item.category}
            </Box>
          </Box>

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
              }}
            >
              {item.description}
            </Typography>
          </Box>

          <Typography sx={{ color: 'rgba(198, 223, 248, 0.75)', fontSize: '0.74rem', fontWeight: 700 }}>
            実行者: {item.actor}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const SettingsHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(toDateInputValue(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExecutionHistoryCategory>('all');

  const histories = useMemo(() => getExecutionHistories(), []);

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return histories.filter((item) => {
      const itemDate = toDateInputValue(new Date(item.executedAt));
      const byDate = !dateFilter || itemDate === dateFilter;
      if (!byDate) return false;

      const byCategory = categoryFilter === 'all' || item.category === categoryFilter;
      if (!byCategory) return false;

      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query)
        || item.description.toLowerCase().includes(query)
        || item.actor.toLowerCase().includes(query)
        || item.category.toLowerCase().includes(query)
      );
    });
  }, [histories, searchText, dateFilter, categoryFilter]);

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
          width: { xs: '100%', lg: `${100 / HISTORY_SCREEN_SCALE}%` },
          maxWidth: 1100,
          mx: 'auto',
          zoom: { xs: 1, lg: HISTORY_SCREEN_SCALE },
          transformOrigin: 'top center',
        }}
      >
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
              gap: 1,
              px: { xs: 1.5, md: 2 },
              py: { xs: 1.25, md: 1.5 },
              borderBottom: '1px solid rgba(206,224,246,0.45)',
              flexWrap: 'wrap',
            }}
          >
            <Typography sx={{ color: '#f4f8ff', fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700 }}>
              実行履歴
            </Typography>
            <Typography sx={{ color: 'rgba(255, 209, 169, 0.92)', fontSize: '0.82rem', fontWeight: 700 }}>
              60日後の実行履歴は削除されます
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1.05, borderBottom: '1px solid rgba(206,224,246,0.2)' }}>
            <Box
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
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="履歴を検索（タイトル・内容・実行者）"
                inputProps={{ 'aria-label': '履歴検索' }}
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
            </Box>

            <Grid container spacing={1.1} sx={{ mt: 0.95 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography sx={{ color: 'rgba(214,230,250,0.86)', fontSize: '0.74rem', fontWeight: 700, mb: 0.55 }}>
                  日付
                </Typography>
                <Box sx={{
                  borderRadius: '9px',
                  border: '1px solid rgba(188,212,241,0.26)',
                  backgroundColor: 'rgba(20,35,58,0.34)',
                  px: 0.9,
                  minHeight: 36,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <InputBase
                    type="date"
                    value={dateFilter}
                    onChange={(event) => setDateFilter(event.target.value)}
                    sx={{
                      width: '100%',
                      color: '#e3f2ff',
                      fontSize: '0.84rem',
                      '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1) brightness(1.7)' },
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography sx={{ color: 'rgba(214,230,250,0.86)', fontSize: '0.74rem', fontWeight: 700, mb: 0.55 }}>
                  カテゴリー
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value as 'all' | ExecutionHistoryCategory)}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: {
                      sx: {
                        backgroundColor: '#17293f',
                        color: '#e9f2ff',
                      },
                    },
                  }}
                  sx={{
                    color: '#f2f8ff',
                    backgroundColor: 'rgba(8, 18, 34, 0.72)',
                    minHeight: 36,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
                    '& .MuiSvgIcon-root': { color: '#d9e9ff' },
                  }}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ px: { xs: 1.35, md: 1.7 }, py: { xs: 1.15, md: 1.4 } }}>
            {filtered.length === 0 ? (
              <Box
                sx={{
                  borderRadius: '10px',
                  border: '1px dashed rgba(176, 201, 232, 0.4)',
                  backgroundColor: 'rgba(14, 28, 52, 0.42)',
                  px: 1.2,
                  py: 2,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'rgba(220,236,255,0.84)', fontSize: '0.9rem', fontWeight: 700 }}>
                  条件に一致する実行履歴はありません
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={1.15}>
                {filtered.map((item) => (
                  <Grid key={item.id} size={{ xs: 12 }}>
                    <HistoryCard item={item} />
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

export default SettingsHistoryScreen;
