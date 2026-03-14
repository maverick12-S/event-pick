import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiList,
  FiBookmark,
  FiX,
  FiAlertTriangle,
  FiRepeat,
  FiHash,
  FiTag,
} from 'react-icons/fi';
import type { ScheduledPostItem } from '../../../types/models/scheduledPost';
import type { PostEventDbItem, PostsTabKey } from '../../../types/models/post';
import type { PostListSortKey } from '../../../types/models/postSort';
import { postManagementApi } from '../hooks/usePostManagement';
import { PostEventCard, PostSortSelect } from '../components';
import {
  defaultPostSearchFilters,
  detectTimeSlot,
  toSelectedValues,
  type PostSearchFilters,
} from '../utils/postSearchFilters';
import { sortPostsByKey } from '../utils/postSort';

const {
  categories: categoryOptions,
  cities: cityOptions,
  prefectures: prefectureOptions,
  timeSlots: timeSlotOptions,
} = postManagementApi.getPostFilterOptions();

type FooterTab = 'posts' | 'reservations';
type MainTab = PostsTabKey;

const MAIN_TABS: Array<{ key: MainTab; label: string }> = [
  { key: 'today', label: '今日' },
  { key: 'tomorrow', label: '明日' },
  { key: 'scheduled', label: '予約・確認' },
];

const ACCOUNT_POSTS_SCALE = 0.86;
const POSTS_PAGE_LIMIT = 60;

const formatDateLabel = (value: string, placeholder: string): string => {
  if (!value) return placeholder;
  return value.replace(/-/g, '/');
};

const STATUS_CONFIG: Record<
  ScheduledPostItem['status'],
  { label: string; bg: string; color: string }
> = {
  scheduled: { label: '予約中', bg: 'rgba(235,97,131,0.22)', color: '#f07090' },
  posted: { label: '投稿済', bg: 'rgba(39,174,96,0.22)', color: '#4dd88a' },
  paused: { label: '停止中', bg: 'rgba(100,120,160,0.22)', color: '#8899bb' },
};

const DeleteDialog: React.FC<{
  open: boolean;
  target: ScheduledPostItem | null;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, target, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    disableScrollLock
    PaperProps={{
      sx: {
        background: 'linear-gradient(145deg, #0e2040 0%, #091628 100%)',
        border: '1px solid rgba(200,220,255,0.25)',
        borderRadius: '12px',
        color: '#e8f2ff',
        minWidth: { xs: 300, sm: 400 },
      },
    }}
  >
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        fontWeight: 700,
        fontSize: '1rem',
        color: '#ffaabb',
        borderBottom: '1px solid rgba(200,220,255,0.15)',
        pb: 1.5,
      }}
    >
      <FiAlertTriangle size={18} />
      投稿を削除しますか？
    </DialogTitle>
    <DialogContent sx={{ pt: 2 }}>
      <Typography sx={{ color: 'rgba(210,230,255,0.8)', fontSize: '0.9rem', lineHeight: 1.75 }}>
        「{target?.title}」を削除します。
        <br />
        この操作は取り消せません。
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
      <ButtonBase
        onClick={onClose}
        sx={{
          flex: 1,
          py: 1.1,
          borderRadius: '8px',
          border: '1px solid rgba(180,210,255,0.3)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#c8deff',
          fontWeight: 600,
          fontSize: '0.88rem',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
        }}
      >
        キャンセル
      </ButtonBase>
      <ButtonBase
        onClick={onConfirm}
        sx={{
          flex: 1,
          py: 1.1,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #e7506a 0%, #c03050 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 4px 14px rgba(200,50,80,0.4)',
          '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
        }}
      >
        削除する
      </ButtonBase>
    </DialogActions>
  </Dialog>
);

const ScheduledCard: React.FC<{
  item: ScheduledPostItem;
  canEdit: boolean;
  onEdit: (item: ScheduledPostItem) => void;
  onDelete: (item: ScheduledPostItem) => void;
}> = ({ item, canEdit, onEdit, onDelete }) => {
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <Box
      component="article"
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
            width: { xs: 108, sm: 120 },
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              left: 6,
              px: 0.75,
              py: 0.2,
              borderRadius: '4px',
              backgroundColor: statusCfg.bg,
              backdropFilter: 'blur(6px)',
              border: `1px solid ${statusCfg.color}44`,
            }}
          >
            <Typography sx={{ color: statusCfg.color, fontSize: '0.6rem', fontWeight: 800 }}>
              {statusCfg.label}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
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
            }}
          >
            {item.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiClock style={{ color: 'rgba(160,200,255,0.6)', fontSize: '0.7rem', flexShrink: 0 }} />
              <Typography sx={{ color: 'rgba(190,215,255,0.72)', fontSize: '0.72rem' }}>
                {item.timeLabel}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiMapPin style={{ color: 'rgba(160,200,255,0.6)', fontSize: '0.7rem', flexShrink: 0 }} />
              <Typography
                sx={{
                  color: 'rgba(190,215,255,0.72)',
                  fontSize: '0.78rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 170,
                }}
              >
                {item.venue}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35, mr: 0.2 }}>
              <FiTag style={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.66rem' }} />
              <Typography sx={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.66rem' }}>
                投稿条件:
              </Typography>
            </Box>
            {item.condition.platforms.slice(0, 2).map((platform) => (
              <Box
                key={platform}
                sx={{
                  px: 0.7,
                  py: 0.15,
                  borderRadius: '4px',
                  border: '1px solid rgba(160,200,255,0.28)',
                  backgroundColor: 'rgba(160,200,255,0.08)',
                }}
              >
                <Typography sx={{ color: 'rgba(190,220,255,0.75)', fontSize: '0.68rem', fontWeight: 600 }}>
                  {platform}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <FiRepeat style={{ color: 'rgba(160,200,255,0.5)', fontSize: '0.65rem' }} />
              <Typography sx={{ color: 'rgba(170,205,255,0.6)', fontSize: '0.72rem' }}>
                {item.condition.repeatInterval}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              color: 'rgba(180,210,250,0.58)',
              fontSize: '0.76rem',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexWrap: 'wrap' }}>
            <FiHash style={{ color: 'rgba(140,180,240,0.45)', fontSize: '0.65rem', flexShrink: 0 }} />
            <Typography
              sx={{
                color: 'rgba(160,200,250,0.5)',
                fontSize: '0.72rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 220,
              }}
            >
              {item.condition.hashtags.slice(0, 3).join(' ')}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            px: 0.75,
            py: 1,
            borderLeft: '1px solid rgba(200,220,255,0.1)',
            flexShrink: 0,
          }}
        >
          <IconButton
            aria-label="編集"
            size="small"
            onClick={() => onEdit(item)}
            disabled={!canEdit}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              border: `1px solid ${canEdit ? 'rgba(120,180,255,0.35)' : 'rgba(100,120,160,0.18)'}`,
              backgroundColor: canEdit ? 'rgba(120,180,255,0.1)' : 'rgba(80,100,140,0.06)',
              color: canEdit ? '#7eb8ff' : 'rgba(100,130,170,0.4)',
              '&:hover:not(:disabled)': {
                backgroundColor: 'rgba(120,180,255,0.2)',
                borderColor: 'rgba(120,180,255,0.55)',
              },
              '&.Mui-disabled': { color: 'rgba(100,130,170,0.35)' },
            }}
          >
            <FiEdit2 size={13} />
          </IconButton>
          <IconButton
            aria-label="削除"
            size="small"
            onClick={() => onDelete(item)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              border: '1px solid rgba(235,97,131,0.35)',
              backgroundColor: 'rgba(235,97,131,0.1)',
              color: '#f07090',
              '&:hover': {
                backgroundColor: 'rgba(235,97,131,0.22)',
                borderColor: 'rgba(235,97,131,0.6)',
              },
            }}
          >
            <FiTrash2 size={13} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderTop: '1px solid rgba(200,220,255,0.1)',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <FiCalendar style={{ color: 'rgba(160,200,255,0.5)', fontSize: '0.72rem' }} />
        <Typography sx={{ color: 'rgba(180,210,255,0.55)', fontSize: '0.7rem' }}>次回投稿日:</Typography>
        <Typography sx={{ color: '#aad0ff', fontSize: '0.76rem', fontWeight: 700 }}>
          {item.nextPostDate}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            px: 0.75,
            py: 0.15,
            borderRadius: '4px',
            backgroundColor: item.condition.autoPost ? 'rgba(39,174,96,0.18)' : 'rgba(100,120,160,0.18)',
            border: `1px solid ${item.condition.autoPost ? 'rgba(39,174,96,0.35)' : 'rgba(100,120,160,0.28)'}`,
          }}
        >
          <Typography
            sx={{
              color: item.condition.autoPost ? '#4dd88a' : '#8899bb',
              fontSize: '0.6rem',
              fontWeight: 700,
            }}
          >
            {item.condition.autoPost ? '自動投稿ON' : '自動投稿OFF'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ScheduledPostsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDateInputRef = useRef<HTMLInputElement | null>(null);
  const toDateInputRef = useRef<HTMLInputElement | null>(null);
  const initialFooterTab: FooterTab = searchParams.get('view') === 'posts' ? 'posts' : 'reservations';

  const [mainTab, setMainTab] = useState<MainTab>('scheduled');
  const [footerTab, setFooterTab] = useState<FooterTab>(initialFooterTab);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<PostListSortKey>('postedAtDesc');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');
  const [draftFilters, setDraftFilters] = useState<PostSearchFilters>(defaultPostSearchFilters);
  const [appliedFilters, setAppliedFilters] = useState<PostSearchFilters>(defaultPostSearchFilters);
  const [reservationPage, setReservationPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ScheduledPostItem | null>(null);
  const [items, setItems] = useState<ScheduledPostItem[]>(() => postManagementApi.listScheduledPosts());

  const filtered = useMemo(
    () => {
      const search = appliedFilters.title.trim().toLowerCase();
      const prefecture = '東京都';

      const matched = items.filter((item) => {
        const targetDate = item.nextPostDate || item.dateLabel;
        const fromMatched = !searchDateFrom || targetDate >= searchDateFrom;
        const toMatched = !searchDateTo || targetDate <= searchDateTo;
        const dateMatched = fromMatched && toMatched;
        if (!dateMatched) return false;

        if (search && !item.title.toLowerCase().includes(search)) {
          return false;
        }

        if (appliedFilters.categories.length > 0 && !appliedFilters.categories.some((category) => item.category.includes(category))) {
          return false;
        }

        if (appliedFilters.prefectures.length > 0 && !appliedFilters.prefectures.includes(prefecture)) {
          return false;
        }

        if (appliedFilters.cities.length > 0 && !appliedFilters.cities.some((city) => item.ward.includes(city))) {
          return false;
        }

        if (appliedFilters.timeSlots.length > 0 && !appliedFilters.timeSlots.includes(detectTimeSlot(item.timeLabel))) {
          return false;
        }

        return true;
      });

      return sortPostsByKey(matched, sortBy);
    },
    [items, searchDateFrom, searchDateTo, appliedFilters, sortBy],
  );

  const accountPosts = useMemo<PostEventDbItem[]>(
    () =>
      sortPostsByKey(
        items
        .filter((item) => item.locationId === postManagementApi.getCurrentLocationId())
        .filter((item) => {
          const search = appliedFilters.title.trim().toLowerCase();
          const prefecture = '東京都';
          const targetDate = item.nextPostDate || item.dateLabel;
          const fromMatched = !searchDateFrom || targetDate >= searchDateFrom;
          const toMatched = !searchDateTo || targetDate <= searchDateTo;
          const dateMatched = fromMatched && toMatched;
          if (!dateMatched) return false;

          if (search && !item.title.toLowerCase().includes(search)) {
            return false;
          }

          if (appliedFilters.categories.length > 0 && !appliedFilters.categories.some((category) => item.category.includes(category))) {
            return false;
          }

          if (appliedFilters.prefectures.length > 0 && !appliedFilters.prefectures.includes(prefecture)) {
            return false;
          }

          if (appliedFilters.cities.length > 0 && !appliedFilters.cities.some((city) => item.ward.includes(city))) {
            return false;
          }

          if (appliedFilters.timeSlots.length > 0 && !appliedFilters.timeSlots.includes(detectTimeSlot(item.timeLabel))) {
            return false;
          }

          return true;
        })
        .map((item) => ({
          id: `scheduled-${item.id}`,
          title: item.title,
          ward: item.ward,
          venue: item.venue,
          description: item.description,
          category: item.category,
          dateLabel: item.dateLabel,
          timeLabel: item.timeLabel,
          imageUrl: item.imageUrl,
          imageUrls: [item.imageUrl],
          detailPath: `/posts/scheduled/${item.id}`,
          detailLabel: '詳細を見る',
          reservationContact: 'https://www.google.com/',
          tab: 'scheduled',
        })),
        sortBy,
      ),
    [items, searchDateFrom, searchDateTo, appliedFilters, sortBy],
  );

  const postsTotalPages = Math.max(Math.ceil(accountPosts.length / POSTS_PAGE_LIMIT), 1);
  const currentPostsPage = Math.min(postsPage, postsTotalPages);
  const accountPostsPageItems = useMemo(() => {
    const start = (currentPostsPage - 1) * POSTS_PAGE_LIMIT;
    return accountPosts.slice(start, start + POSTS_PAGE_LIMIT);
  }, [accountPosts, currentPostsPage]);

  const reservationTotalPages = Math.max(Math.ceil(filtered.length / POSTS_PAGE_LIMIT), 1);
  const currentReservationPage = Math.min(reservationPage, reservationTotalPages);
  const reservationPageItems = useMemo(() => {
    const start = (currentReservationPage - 1) * POSTS_PAGE_LIMIT;
    return filtered.slice(start, start + POSTS_PAGE_LIMIT);
  }, [filtered, currentReservationPage]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleFooterTab = (tab: FooterTab) => {
    setFooterTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('view', tab);
    setSearchParams(nextParams);
    if (tab === 'reservations') {
      setReservationPage(1);
    }
    if (tab === 'posts') {
      setPostsPage(1);
    }
  };

  const handleMainTab = (tab: MainTab) => {
    setMainTab(tab);
    if (tab === 'today' || tab === 'tomorrow') {
      navigate(`/posts?tab=${tab}`);
    }
  };

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const input = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px))',
        display: 'flex',
        flexDirection: 'column',
        pb: '68px',
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
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: { xs: 1, md: '0 1 auto' } }}>
              <ButtonBase
                onClick={() => setSearchOpen((open) => !open)}
                aria-label={searchOpen ? '検索を閉じる' : '検索を開く'}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '999px',
                  border: searchOpen
                    ? '1px solid rgba(235,97,131,0.7)'
                    : '1px solid rgba(194,216,243,0.55)',
                  backgroundColor: searchOpen ? 'rgba(235,97,131,0.16)' : 'rgba(235,245,255,0.12)',
                  color: searchOpen ? '#f07090' : '#ddeeff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: searchOpen ? 'rgba(235,97,131,0.24)' : 'rgba(235,245,255,0.2)',
                  },
                }}
              >
                {searchOpen ? <FiX /> : <FiSearch />}
              </ButtonBase>

              <Box
                sx={{
                  overflow: 'hidden',
                  width: { xs: searchOpen ? '100%' : 0, md: searchOpen ? 350 : 0 },
                  opacity: searchOpen ? 1 : 0,
                  transform: searchOpen ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'width 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 280ms ease',
                }}
              >
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
                    value={draftFilters.title}
                    onChange={(event) => {
                      setDraftFilters((prev) => ({ ...prev, title: event.target.value }));
                    }}
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
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                gap: { xs: 0.7, sm: 0.9 },
                ml: 'auto',
              }}
            >
              {MAIN_TABS.map((tab) => {
                const active = tab.key === mainTab;
                return (
                  <ButtonBase
                    key={tab.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleMainTab(tab.key)}
                    sx={{
                      minHeight: 38,
                      px: { xs: 1.45, sm: 2 },
                      borderRadius: '999px',
                      border: active
                        ? '1px solid rgba(235,97,131,0.9)'
                        : '1px solid rgba(176,201,232,0.65)',
                      background: active
                        ? 'linear-gradient(165deg, rgba(235,97,131,0.95), rgba(210,68,108,0.95))'
                        : 'linear-gradient(165deg, rgba(65,88,124,0.82), rgba(52,70,102,0.82))',
                      color: '#f7fbff',
                      fontSize: '0.9rem',
                      fontWeight: active ? 700 : 600,
                      letterSpacing: '0.01em',
                      boxShadow: active
                        ? '0 5px 14px rgba(35,14,34,0.32)'
                        : '0 2px 8px rgba(6,14,31,0.22)',
                      backdropFilter: 'blur(8px)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s',
                    }}
                  >
                    {tab.label}
                  </ButtonBase>
                );
              })}

            </Box>
          </Box>

          <Collapse in={searchOpen} timeout={300}>
            <Box
              sx={{
                px: { xs: 1.5, md: 2 },
                py: 1.25,
                borderBottom: '1px solid rgba(206,224,246,0.28)',
              }}
            >
              <Grid container spacing={1.2}>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 0.9,
                      flexWrap: 'wrap',
                      p: { xs: 0.9, md: 1 },
                      borderRadius: 2,
                      border: '1px solid rgba(172, 196, 228, 0.34)',
                      backgroundColor: 'rgba(12, 24, 42, 0.46)',
                    }}
                  >
                    <Typography sx={{ color: 'rgba(210,228,248,0.86)', fontSize: '0.8rem', fontWeight: 600, minWidth: 58 }}>
                      日付指定
                    </Typography>

                    <ButtonBase
                      onClick={() => openDatePicker(fromDateInputRef)}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.7,
                        px: 1,
                        py: 0.5,
                        borderRadius: '12px',
                        border: '1px solid rgba(188,214,244,0.5)',
                        backgroundColor: 'rgba(220,236,255,0.09)',
                        minHeight: 44,
                        flex: '0 0 auto',
                        width: 'fit-content',
                        textAlign: 'left',
                        '&:hover': { backgroundColor: 'rgba(220,236,255,0.14)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '8px',
                          border: '1px solid rgba(170,205,242,0.52)',
                          backgroundColor: 'rgba(188,220,255,0.14)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FiCalendar style={{ color: 'rgba(180,215,250,0.9)', fontSize: '0.78rem' }} />
                      </Box>
                      <Typography sx={{ color: 'rgba(198,221,248,0.82)', fontSize: '0.72rem', fontWeight: 700 }}>
                        開始
                      </Typography>
                      <Typography sx={{ color: '#f0f7ff', fontSize: '0.82rem', fontWeight: 600, minWidth: 108 }}>
                        {formatDateLabel(searchDateFrom, '指定日')}
                      </Typography>
                      <Box
                        ref={fromDateInputRef}
                        component="input"
                        type="date"
                        value={searchDateFrom}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchDateFrom(event.target.value)}
                        sx={{
                          position: 'absolute',
                          opacity: 0,
                          pointerEvents: 'none',
                          width: 1,
                          height: 1,
                        }}
                      />
                    </ButtonBase>

                    <Typography sx={{ color: 'rgba(190,215,255,0.68)', fontSize: '0.8rem' }}>~</Typography>

                    <ButtonBase
                      onClick={() => openDatePicker(toDateInputRef)}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.7,
                        px: 1,
                        py: 0.5,
                        borderRadius: '12px',
                        border: '1px solid rgba(188,214,244,0.5)',
                        backgroundColor: 'rgba(220,236,255,0.09)',
                        minHeight: 44,
                        flex: '0 0 auto',
                        width: 'fit-content',
                        textAlign: 'left',
                        '&:hover': { backgroundColor: 'rgba(220,236,255,0.14)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '8px',
                          border: '1px solid rgba(170,205,242,0.52)',
                          backgroundColor: 'rgba(188,220,255,0.14)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FiCalendar style={{ color: 'rgba(180,215,250,0.9)', fontSize: '0.78rem' }} />
                      </Box>
                      <Typography sx={{ color: 'rgba(198,221,248,0.82)', fontSize: '0.72rem', fontWeight: 700 }}>
                        終了
                      </Typography>
                      <Typography sx={{ color: '#f0f7ff', fontSize: '0.82rem', fontWeight: 600, minWidth: 108 }}>
                        {formatDateLabel(searchDateTo, '指定日')}
                      </Typography>
                      <Box
                        ref={toDateInputRef}
                        component="input"
                        type="date"
                        value={searchDateTo}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchDateTo(event.target.value)}
                        sx={{
                          position: 'absolute',
                          opacity: 0,
                          pointerEvents: 'none',
                          width: 1,
                          height: 1,
                        }}
                      />
                    </ButtonBase>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: { xs: 1, md: 1.15 },
                      borderRadius: 2,
                      border: '1px solid rgba(172, 196, 228, 0.34)',
                      backgroundColor: 'rgba(12, 24, 42, 0.46)',
                    }}
                  >
                    <Grid container spacing={1.1}>
                      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Select
                          fullWidth
                          multiple
                          displayEmpty
                          value={draftFilters.categories}
                          renderValue={(selected) => {
                            const values = toSelectedValues(selected);
                            return values.length > 0 ? values.join(' / ') : 'カテゴリー(全て)';
                          }}
                          onChange={(event) => {
                            const values = event.target.value;
                            setDraftFilters((prev) => ({ ...prev, categories: typeof values === 'string' ? values.split(',') : values }));
                          }}
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
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
                            '& .MuiSvgIcon-root': { color: '#d9e9ff' },
                          }}
                        >
                          {categoryOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Select
                          fullWidth
                          multiple
                          displayEmpty
                          value={draftFilters.prefectures}
                          renderValue={(selected) => {
                            const values = toSelectedValues(selected);
                            return values.length > 0 ? values.join(' / ') : '県(全て)';
                          }}
                          onChange={(event) => {
                            const values = event.target.value;
                            setDraftFilters((prev) => ({
                              ...prev,
                              prefectures: typeof values === 'string' ? values.split(',') : values,
                            }));
                          }}
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
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
                            '& .MuiSvgIcon-root': { color: '#d9e9ff' },
                          }}
                        >
                          {prefectureOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Select
                          fullWidth
                          multiple
                          displayEmpty
                          value={draftFilters.cities}
                          renderValue={(selected) => {
                            const values = toSelectedValues(selected);
                            return values.length > 0 ? values.join(' / ') : '市・区(全て)';
                          }}
                          onChange={(event) => {
                            const values = event.target.value;
                            setDraftFilters((prev) => ({ ...prev, cities: typeof values === 'string' ? values.split(',') : values }));
                          }}
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
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
                            '& .MuiSvgIcon-root': { color: '#d9e9ff' },
                          }}
                        >
                          {cityOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Select
                          fullWidth
                          multiple
                          displayEmpty
                          value={draftFilters.timeSlots}
                          renderValue={(selected) => {
                            const values = toSelectedValues(selected);
                            return values.length > 0 ? values.join(' / ') : '時間帯(全て)';
                          }}
                          onChange={(event) => {
                            const values = event.target.value;
                            setDraftFilters((prev) => ({ ...prev, timeSlots: typeof values === 'string' ? values.split(',') : values }));
                          }}
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
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
                            '& .MuiSvgIcon-root': { color: '#d9e9ff' },
                          }}
                        >
                          {timeSlotOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                    </Grid>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                    <PostSortSelect
                      value={sortBy}
                      onChange={(value) => {
                        setSortBy(value);
                        setReservationPage(1);
                        setPostsPage(1);
                      }}
                      minHeight={42}
                      minWidth={{ xs: '100%', sm: 240 }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.8, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setDraftFilters({ ...defaultPostSearchFilters });
                          setAppliedFilters({ ...defaultPostSearchFilters });
                          setSearchDateFrom('');
                          setSearchDateTo('');
                          setReservationPage(1);
                          setPostsPage(1);
                        }}
                        sx={{
                          color: '#e8f2ff',
                          borderColor: 'rgba(169, 196, 228, 0.7)',
                          minWidth: 96,
                        }}
                      >
                        クリア
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setAppliedFilters({ ...draftFilters });
                          setReservationPage(1);
                          setPostsPage(1);
                          setSearchOpen(false);
                        }}
                        sx={{ minWidth: 96 }}
                      >
                        検索
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ color: 'rgba(190,215,255,0.72)', fontSize: '0.8rem', fontWeight: 600 }}>
                    絞り込み結果: {footerTab === 'reservations' ? filtered.length : accountPosts.length} 件
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          <Box sx={{ p: { xs: 1.25, md: 1.75 }, minHeight: 200 }}>
            {footerTab === 'reservations' && filtered.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                  gap: 1.5,
                }}
              >
                <FiCalendar size={36} style={{ color: 'rgba(160,200,255,0.25)' }} />
                <Typography sx={{ color: 'rgba(190,215,255,0.4)', fontSize: '0.92rem' }}>
                  該当する予約投稿がありません
                </Typography>
                {(searchDateFrom || searchDateTo) && (
                  <ButtonBase
                    onClick={() => {
                      setSearchDateFrom('');
                      setSearchDateTo('');
                    }}
                    sx={{
                      px: 1.75,
                      py: 0.7,
                      borderRadius: '8px',
                      border: '1px solid rgba(235,97,131,0.4)',
                      color: '#f07090',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(235,97,131,0.1)' },
                    }}
                  >
                    絞り込みを解除する
                  </ButtonBase>
                )}
              </Box>
            ) : null}

            {footerTab === 'posts' && accountPosts.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                  gap: 1.5,
                }}
              >
                <FiList size={34} style={{ color: 'rgba(160,200,255,0.25)' }} />
                <Typography sx={{ color: 'rgba(190,215,255,0.4)', fontSize: '0.92rem' }}>
                  アカウントに紐づく投稿がありません
                </Typography>
                {(searchDateFrom || searchDateTo) && (
                  <ButtonBase
                    onClick={() => {
                      setSearchDateFrom('');
                      setSearchDateTo('');
                    }}
                    sx={{
                      px: 1.75,
                      py: 0.7,
                      borderRadius: '8px',
                      border: '1px solid rgba(235,97,131,0.4)',
                      color: '#f07090',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(235,97,131,0.1)' },
                    }}
                  >
                    絞り込みを解除する
                  </ButtonBase>
                )}
              </Box>
            ) : null}

            {footerTab === 'reservations' && filtered.length > 0 ? (
              <Grid container spacing={{ xs: 1.25, sm: 1.75, md: 2 }}>
                {reservationPageItems.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
                    <ScheduledCard
                      item={item}
                      canEdit
                      onEdit={(selected) => navigate(`/posts/scheduled/edit/${selected.id}`, { state: { from: 'reservations' } })}
                      onDelete={(selected) => setDeleteTarget(selected)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : null}

            {footerTab === 'reservations' && filtered.length > 0 ? (
              <Box
                component="footer"
                sx={{
                  mt: { xs: 1.5, md: 2 },
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <ButtonBase
                  onClick={() => setReservationPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentReservationPage <= 1}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: currentReservationPage <= 1 ? 0.48 : 1,
                  }}
                >
                  前へ
                </ButtonBase>
                <Typography sx={{ minWidth: 76, textAlign: 'center', color: '#dceaff', fontSize: '0.82rem', fontWeight: 600 }}>
                  {`${currentReservationPage} / ${reservationTotalPages}`}
                </Typography>
                <ButtonBase
                  onClick={() => setReservationPage((prev) => Math.min(reservationTotalPages, prev + 1))}
                  disabled={currentReservationPage >= reservationTotalPages}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: currentReservationPage >= reservationTotalPages ? 0.48 : 1,
                  }}
                >
                  次へ
                </ButtonBase>
              </Box>
            ) : null}

            {footerTab === 'posts' && accountPosts.length > 0 ? (
              <Box
                sx={{
                  width: { xs: '100%', xl: `${100 / ACCOUNT_POSTS_SCALE}%` },
                  maxWidth: { xs: 1500, xl: 1800 },
                  mx: 'auto',
                  zoom: { xl: ACCOUNT_POSTS_SCALE },
                }}
              >
                <Grid container spacing={{ xs: 1.25, sm: 1.75, md: 2 }} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 10 }}>
                  {accountPostsPageItems.map((event) => (
                    <Grid key={event.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 2 }}>
                      <PostEventCard
                        event={event}
                        onEdit={(selected) => {
                          const scheduledId = selected.id.startsWith('scheduled-') ? selected.id.slice('scheduled-'.length) : selected.id;
                          navigate(`/posts/scheduled/edit/${scheduledId}`, { state: { from: 'posts' } });
                        }}
                        onDelete={(selected) => {
                          const scheduledId = selected.id.startsWith('scheduled-') ? selected.id.slice('scheduled-'.length) : selected.id;
                          const target = items.find((item) => item.id === scheduledId) ?? null;
                          if (!target) return;
                          setDeleteTarget(target);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : null}

            {footerTab === 'posts' && accountPosts.length > 0 ? (
              <Box
                component="footer"
                sx={{
                  mt: { xs: 1.5, md: 2 },
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <ButtonBase
                  onClick={() => setPostsPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPostsPage <= 1}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: currentPostsPage <= 1 ? 0.48 : 1,
                  }}
                >
                  前へ
                </ButtonBase>
                <Typography sx={{ minWidth: 76, textAlign: 'center', color: '#dceaff', fontSize: '0.82rem', fontWeight: 600 }}>
                  {`${currentPostsPage} / ${postsTotalPages}`}
                </Typography>
                <ButtonBase
                  onClick={() => setPostsPage((prev) => Math.min(postsTotalPages, prev + 1))}
                  disabled={currentPostsPage >= postsTotalPages}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: currentPostsPage >= postsTotalPages ? 0.48 : 1,
                  }}
                >
                  次へ
                </ButtonBase>
              </Box>
            ) : null}
          </Box>

          {(footerTab === 'reservations' ? filtered.length > 0 : accountPosts.length > 0) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 1.25,
                borderTop: '1px solid rgba(200,220,255,0.1)',
              }}
            >
              <Typography sx={{ color: 'rgba(170,200,255,0.45)', fontSize: '0.76rem' }}>
                全 {footerTab === 'reservations' ? filtered.length : accountPosts.length} 件
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        component="nav"
        aria-label="メインナビゲーション"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'rgba(6,14,32,0.97)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(206,224,246,0.16)',
          display: 'flex',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.35)',
        }}
      >
        {[
          { key: 'posts' as FooterTab, label: '過去の投稿', icon: <FiList /> },
          { key: 'reservations' as FooterTab, label: '予約一覧', icon: <FiBookmark /> },
        ].map((tab) => {
          const active = footerTab === tab.key;
          return (
            <ButtonBase
              key={tab.key}
              onClick={() => handleFooterTab(tab.key)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.35,
                color: active ? '#fff' : 'rgba(150,180,220,0.5)',
                fontSize: '0.72rem',
                fontWeight: active ? 700 : 400,
                borderTop: active ? '2px solid rgba(235,97,131,0.88)' : '2px solid transparent',
                transition: 'color 0.18s, border-color 0.18s',
                '&:hover': { color: active ? '#fff' : 'rgba(190,215,255,0.7)' },
              }}
            >
              <Box sx={{ fontSize: '1.2rem' }}>{tab.icon}</Box>
              {tab.label}
            </ButtonBase>
          );
        })}
      </Box>

      <DeleteDialog
        open={deleteTarget !== null}
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default ScheduledPostsScreen;
