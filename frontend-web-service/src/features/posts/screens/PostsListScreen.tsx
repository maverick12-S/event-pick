import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, ButtonBase, CircularProgress, Collapse, Grid, InputBase, MenuItem, Select, Typography } from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import usePostsMock from '../hooks/usePostsMock';
import {
  type PostEventDbItem,
  categoryOptions,
  cityOptions,
  prefectureOptions,
  timeSlotOptions,
  type PostsTabKey,
} from '../../../api/db/posts.screen';
import { CURRENT_LOCATION_ID, scheduledPostsDb } from '../../../api/db/scheduledPosts.db.ts';
import { PostEventCard } from '../components';

const PAGE_LIMIT = 60;
const tabs: Array<{ key: PostsTabKey; label: string }> = [
  { key: 'today', label: '今日' },
  { key: 'tomorrow', label: '明日' },
  { key: 'scheduled', label: '投稿予約・確認' },
];

type SearchFilters = {
  title: string;
  categories: string[];
  prefectures: string[];
  cities: string[];
  timeSlots: string[];
};

const defaultFilters: SearchFilters = {
  title: '',
  categories: [],
  prefectures: [],
  cities: [],
  timeSlots: [],
};

const toSelectedValues = (selected: unknown): string[] => {
  if (Array.isArray(selected)) {
    return selected.map((value) => String(value));
  }

  if (typeof selected === 'string' && selected.length > 0) {
    return selected.split(',').map((value) => value.trim()).filter(Boolean);
  }

  return [];
};

const detectTimeSlot = (timeLabel: string): string => {
  const startHour = Number.parseInt(timeLabel.slice(0, 2), 10);
  if (Number.isNaN(startHour)) return '';
  if (startHour < 12) return '朝';
  if (startHour < 16) return '昼';
  if (startHour < 19) return '夕方';
  return '夜';
};

const PostsListScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAccountScope = searchParams.get('scope') === 'account';
  const initialTab = searchParams.get('tab');
  const resolvedInitialTab: PostsTabKey =
    initialTab === 'tomorrow' ? 'tomorrow' : initialTab === 'scheduled' ? 'scheduled' : initialTab === 'today' ? 'today' : isAccountScope ? 'scheduled' : 'today';
  const [activeTab, setActiveTab] = useState<PostsTabKey>(resolvedInitialTab);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(defaultFilters);

  const params = useMemo(
    () => ({
      tab: activeTab,
      page,
      limit: PAGE_LIMIT,
      search: appliedFilters.title.trim(),
      categories: appliedFilters.categories,
      prefectures: appliedFilters.prefectures,
      cities: appliedFilters.cities,
      timeSlots: appliedFilters.timeSlots,
    }),
    [activeTab, page, appliedFilters],
  );

  const { data, isFetching } = usePostsMock(params);

  const accountLinkedItems = useMemo<PostEventDbItem[]>(() => {
    const query = appliedFilters.title.trim().toLowerCase();

    const mapped = scheduledPostsDb
      .filter((item) => item.locationId === CURRENT_LOCATION_ID)
      .map<PostEventDbItem>((item) => ({
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
      }))
      .filter((item) => {
        if (query && !item.title.toLowerCase().includes(query)) {
          return false;
        }

        if (appliedFilters.categories.length > 0 && !appliedFilters.categories.some((category) => item.category.includes(category))) {
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

    return mapped;
  }, [appliedFilters]);

  const accountTotalPages = Math.max(Math.ceil(accountLinkedItems.length / PAGE_LIMIT), 1);
  const accountPage = Math.min(page, accountTotalPages);
  const accountPageItems = useMemo(() => {
    const start = (accountPage - 1) * PAGE_LIMIT;
    return accountLinkedItems.slice(start, start + PAGE_LIMIT);
  }, [accountLinkedItems, accountPage]);

  useEffect(() => {
    const queryTab = searchParams.get('tab');
    if (queryTab === 'today' || queryTab === 'tomorrow' || queryTab === 'scheduled') {
      setActiveTab(queryTab);
      setPage(1);
      return;
    }

    if (isAccountScope) {
      setActiveTab('scheduled');
      setPage(1);
    }
  }, [searchParams, isAccountScope]);

  const displayItems = isAccountScope ? accountPageItems : (data?.items ?? []);
  const totalPages = isAccountScope ? accountTotalPages : (data?.totalPages ?? 1);
  const currentPage = isAccountScope ? accountPage : (data?.page ?? page);

  return (
    <Box sx={{ width: '100%', px: { xs: 1.25, sm: 2, md: 2.5 }, pb: { xs: 3, md: 4 } }}>
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <Box sx={{ width: '100%', maxWidth: 1900, mx: 'auto' }}>
        <Box
          sx={{
            mt: { xs: 1, md: 1.5 },
            borderRadius: { xs: 2.5, md: 3 },
            border: '1px solid rgba(236, 244, 255, 0.34)',
            background:
              'radial-gradient(circle at 50% 52%, rgba(8, 24, 48, 0) 0%, rgba(9, 26, 52, 0.42) 52%, rgba(255, 255, 255, 0.24) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.1))',
            boxShadow: 'inset 0 1px 0 rgba(248, 252, 255, 0.36), 0 12px 28px rgba(2, 8, 22, 0.36)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            p: { xs: 1.25, md: 1.75 },
          }}
        >
          <Box
            sx={{
              mx: { xs: -1.25, md: -1.75 },
              px: '20px',
              pb: { xs: 1.5, md: 1.75 },
              borderBottom: '1px solid rgba(206, 224, 246, 0.5)',
            }}
          >
            <Grid container spacing={{ xs: 1.1, md: 1.5 }} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 1, md: 2, lg: 5 }, order: { xs: 1, md: 1 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid rgba(194, 216, 243, 0.58)',
                    backgroundColor: 'rgba(235, 245, 255, 0.14)',
                    boxShadow: searchOpen
                      ? 'inset 0 1px 0 rgba(246, 251, 255, 0.34), 0 10px 24px rgba(8, 20, 40, 0.28)'
                      : 'inset 0 1px 0 rgba(246, 251, 255, 0.34)',
                    px: 1.25,
                    py: 0.4,
                    gap: 0.8,
                    width: { xs: '100%', md: searchOpen ? 340 : 300 },
                    cursor: 'text',
                    transform: searchOpen ? 'translateY(-2px)' : 'translateY(0)',
                    transition:
                      'width 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  onClick={() => setSearchOpen(true)}
                >
                  <Box
                    aria-hidden="true"
                    sx={{ color: 'rgba(241, 249, 255, 0.98)', fontSize: '1.2rem', display: 'grid', placeItems: 'center' }}
                  >
                    <FiSearch />
                  </Box>
                  <InputBase
                    value={draftFilters.title}
                    onChange={(event) => {
                      setDraftFilters((prev) => ({ ...prev, title: event.target.value }));
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="イベントタイトルで検索"
                    inputProps={{ 'aria-label': 'イベントタイトルで検索' }}
                    sx={{
                      flex: 1,
                      color: '#f2f8ff',
                      fontSize: '0.95rem',
                      '& input::placeholder': {
                        color: 'rgba(221, 235, 250, 0.8)',
                        opacity: 1,
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid
                size={{ xs: 12 }}
                sx={{
                  mt: { xs: 0.35, md: 0.6, lg: 0.35 },
                  order: { xs: 2, md: 3 },
                  display: 'flex',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    textAlign: 'center',
                    color: '#f1f7ff',
                    fontSize: { xs: '1.8rem', md: '2.15rem', lg: '2.5rem' },
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textShadow: '0 5px 14px rgba(6, 14, 35, 0.5)',
                    whiteSpace: { xs: 'normal', md: 'nowrap' },
                    lineHeight: 1.15,
                    transform: { xs: 'none', md: 'none', lg: 'translateY(-20px)', xl: 'translateY(-58px)' },
                  }}
                >
                  {isAccountScope ? '投稿一覧（アカウント紐づき）' : '投稿一覧'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 0.7, md: 2, lg: 5 }, order: { xs: 3, md: 2 } }}>
                <Box
                  role="tablist"
                  aria-label="投稿絞り込みタブ"
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', sm: 'center', md: 'flex-end' },
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 0.9,
                  }}
                >
                  {tabs.map((tab) => {
                    const active = tab.key === activeTab;

                    return (
                      <ButtonBase
                        key={tab.key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          if (tab.key === 'scheduled') {
                            navigate('/posts/scheduled');
                            return;
                          }

                          if (isAccountScope) {
                            navigate('/posts');
                            return;
                          }

                          navigate(`/posts?tab=${tab.key}`);
                        }}
                        sx={{
                          minHeight: 44,
                          px: 2.2,
                          borderRadius: 999,
                          border: active ? '1px solid rgba(255, 182, 198, 0.95)' : '1px solid rgba(176, 201, 232, 0.72)',
                          background: active
                            ? 'linear-gradient(165deg, rgba(235, 97, 131, 0.96), rgba(221, 78, 116, 0.96))'
                            : 'linear-gradient(165deg, rgba(70, 93, 129, 0.86), rgba(55, 74, 106, 0.86))',
                          color: '#f7fbff',
                          fontSize: '0.96rem',
                          fontWeight: active ? 700 : 600,
                          letterSpacing: '0.01em',
                          boxShadow: active
                            ? '0 6px 14px rgba(35, 14, 34, 0.34), inset 0 1px 0 rgba(255, 226, 233, 0.34)'
                            : '0 3px 8px rgba(6, 14, 31, 0.25), inset 0 1px 0 rgba(228, 241, 255, 0.28)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          transition: 'box-shadow 160ms ease, filter 160ms ease',
                          whiteSpace: 'nowrap',
                          '@media (hover: hover) and (pointer: fine)': {
                            '&:hover': {
                              boxShadow: active
                                ? '0 8px 18px rgba(35, 14, 34, 0.38), inset 0 1px 0 rgba(255, 226, 233, 0.34)'
                                : '0 5px 12px rgba(6, 14, 31, 0.3), inset 0 1px 0 rgba(228, 241, 255, 0.28)',
                              filter: 'brightness(1.03)',
                            },
                          },
                        }}
                      >
                        {tab.label}
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>

            <Collapse
              in={searchOpen}
              timeout={420}
              easing="cubic-bezier(0.22, 1, 0.36, 1)"
              sx={{ mt: searchOpen ? { xs: 1, md: 0.9, lg: 1.2 } : 0 }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  border: '1px solid rgba(186, 210, 239, 0.45)',
                  backgroundColor: 'rgba(18, 32, 54, 0.9)',
                  boxShadow: 'inset 0 1px 0 rgba(243, 249, 255, 0.24)',
                  p: { xs: 1.1, md: 1.25 },
                  opacity: searchOpen ? 1 : 0,
                  transform: searchOpen ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 260ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <Grid container spacing={1.1} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
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
                  <Grid size={{ xs: 12, md: 3 }}>
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
                  <Grid size={{ xs: 12, md: 3 }}>
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

                  <Grid size={{ xs: 12, md: 3 }}>
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

                  <Grid size={{ xs: 12, md: 12 }}>
                    <Box sx={{ display: 'flex', gap: 0.8, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setDraftFilters({ ...defaultFilters });
                        }}
                        sx={{
                          color: '#e8f2ff',
                          borderColor: 'rgba(169, 196, 228, 0.7)',
                        }}
                      >
                        クリア
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setAppliedFilters({ ...draftFilters });
                          setPage(1);
                          setSearchOpen(false);
                        }}
                      >
                        検索
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
            <Box sx={{ mt: '30px', position: 'relative' }}>
              <Grid container spacing={{ xs: 2, sm: 2.25, md: 2.5 }}>
                {displayItems.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <PostEventCard event={event} />
                  </Grid>
                ))}
              </Grid>

              {!isAccountScope && isFetching ? (
                <Box
                  role="status"
                  aria-live="polite"
                  aria-label="読み込み中"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    boxShadow: '0 4px 12px rgba(18, 34, 58, 0.16)',
                    zIndex: 2,
                  }}
                >
                  <CircularProgress size={26} thickness={4.8} />
                </Box>
              ) : null}

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
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: page <= 1 ? 0.48 : 1,
                  }}
                >
                  前へ
                </ButtonBase>
                <Typography sx={{ minWidth: 76, textAlign: 'center', color: '#dceaff', fontSize: '0.82rem', fontWeight: 600 }}>
                  {`${currentPage} / ${totalPages}`}
                </Typography>
                <ButtonBase
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  sx={{
                    minHeight: 34,
                    px: 1.5,
                    borderRadius: 1.25,
                    border: '1px solid rgba(171, 198, 236, 0.56)',
                    backgroundColor: 'rgba(244, 250, 255, 0.12)',
                    color: '#edf5ff',
                    fontSize: '0.78rem',
                    opacity: page >= totalPages ? 0.48 : 1,
                  }}
                >
                  次へ
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostsListScreen;
