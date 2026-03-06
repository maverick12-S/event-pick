import React, { useMemo, useState } from 'react';
import { Box, ButtonBase, CircularProgress, Grid, Typography } from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import usePostsMock from '../hooks/usePostsMock';
import type { PostsTabKey } from '../../../api/db/posts.screen';
import PostEventCard from '../reDesigne/PostEventCard';

const PAGE_LIMIT = 60;
const SCALE_FACTOR = 1.25;

const tabs: Array<{ key: PostsTabKey; label: string }> = [
  { key: 'today', label: '今日' },
  { key: 'tomorrow', label: '明日' },
  { key: 'scheduled', label: '投稿予約・確認' },
];

const PostsListScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PostsTabKey>('today');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      tab: activeTab,
      page,
      limit: PAGE_LIMIT,
      search: '',
    }),
    [activeTab, page],
  );

  const { data, isFetching } = usePostsMock(params);
  const totalPages = data?.totalPages ?? 1;

  return (
    <Box sx={{ width: '100%', px: { xs: 1.25, sm: 2, md: 2.5 }, pb: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          width: `${100 / SCALE_FACTOR}%`,
          mx: 'auto',
          zoom: SCALE_FACTOR,
          transformOrigin: 'top center',
        }}
      >
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
            transform: 'translateZ(0)',
            willChange: 'transform',
            isolation: 'isolate',
            p: { xs: 1.25, md: 1.75 },
          }}
        >
          <Box
            sx={{
              mx: { xs: -1.25, md: -1.75 },
              px: '20px',
              pb: { xs: 1.5, md: 1.75 },
              boxShadow: 'inset 0 -1px 0 rgba(206, 224, 246, 0.5)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                minHeight: { xs: 52, md: 62 },
              }}
            >
              <ButtonBase
                aria-label="検索"
                sx={{
                  width: 'auto',
                  height: 'auto',
                  minWidth: 0,
                  p: 0,
                  color: 'rgba(243, 249, 255, 0.98)',
                  fontSize: '2.1rem',
                }}
              >
                <FiSearch />
              </ButtonBase>

              <Typography
                component="h1"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#f1f7ff',
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textShadow: '0 5px 14px rgba(6, 14, 35, 0.5)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                投稿一覧
              </Typography>

              <Box sx={{ width: 1, height: 1, justifySelf: 'end' }} />
            </Box>

            <Box
              role="tablist"
              aria-label="投稿絞り込みタブ"
              sx={{
                mt: 1,
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'start',
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
                      setActiveTab(tab.key);
                      setPage(1);
                    }}
                    sx={{
                      minHeight: 46,
                      px: 2.5,
                      borderRadius: 999,
                      border: active ? '1px solid rgba(255, 182, 198, 0.95)' : '1px solid rgba(176, 201, 232, 0.72)',
                      background: active
                        ? 'linear-gradient(165deg, rgba(235, 97, 131, 0.96), rgba(221, 78, 116, 0.96))'
                        : 'linear-gradient(165deg, rgba(70, 93, 129, 0.86), rgba(55, 74, 106, 0.86))',
                      color: '#f7fbff',
                      fontSize: '1rem',
                      fontWeight: active ? 700 : 600,
                      letterSpacing: '0.01em',
                      boxShadow: active
                        ? '0 6px 14px rgba(35, 14, 34, 0.34), inset 0 1px 0 rgba(255, 226, 233, 0.34)'
                        : '0 3px 8px rgba(6, 14, 31, 0.25), inset 0 1px 0 rgba(228, 241, 255, 0.28)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      transition: 'box-shadow 160ms ease, filter 160ms ease',
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
          </Box>

          <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
            <Box sx={{ mt: '30px', position: 'relative' }}>
              <Grid container spacing={{ xs: 2, sm: 2.25, md: 2.5 }}>
                {data?.items.map((event) => (
                  <Grid key={event.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <PostEventCard event={event} />
                  </Grid>
                ))}
              </Grid>

              {isFetching ? (
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
                  {data ? `${data.page} / ${data.totalPages}` : '0 / 0'}
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
