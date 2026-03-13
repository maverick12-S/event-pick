import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import { FiArrowLeft, FiClock, FiExternalLink, FiMapPin } from 'react-icons/fi';
import postManagementMockApi from '../../../api/mock/postManagementMockApi';
import { CarouselIndicator } from '../components';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  食事: { bg: 'rgba(220, 53, 69, 0.14)', color: '#ffd9df', border: 'rgba(255, 175, 188, 0.46)' },
  体験: { bg: 'rgba(40, 167, 69, 0.14)', color: '#d9ffe2', border: 'rgba(169, 240, 184, 0.46)' },
  買い物: { bg: 'rgba(255, 160, 0, 0.14)', color: '#ffeac7', border: 'rgba(255, 219, 153, 0.46)' },
  イベント: { bg: 'rgba(13, 110, 253, 0.16)', color: '#daeaff', border: 'rgba(171, 205, 255, 0.48)' },
  ライブ: { bg: 'rgba(111, 66, 193, 0.16)', color: '#ebdcff', border: 'rgba(209, 183, 255, 0.48)' },
  観光: { bg: 'rgba(0, 172, 193, 0.16)', color: '#d1fbff', border: 'rgba(163, 241, 250, 0.48)' },
  祭り: { bg: 'rgba(239, 108, 0, 0.16)', color: '#ffe4d1', border: 'rgba(255, 201, 169, 0.5)' },
  温泉: { bg: 'rgba(236, 64, 122, 0.16)', color: '#ffdeea', border: 'rgba(255, 181, 208, 0.48)' },
  車: { bg: 'rgba(55, 71, 79, 0.2)', color: '#deeaee', border: 'rgba(182, 198, 206, 0.48)' },
  フォーマル: { bg: 'rgba(21, 101, 192, 0.16)', color: '#dcecff', border: 'rgba(171, 205, 255, 0.48)' },
  カジュアル: { bg: 'rgba(0, 150, 136, 0.16)', color: '#d4fff9', border: 'rgba(164, 238, 230, 0.48)' },
  ネットワーキング: { bg: 'rgba(211, 47, 47, 0.16)', color: '#ffd9d9', border: 'rgba(255, 176, 176, 0.48)' },
};

const DEFAULT_COLOR = { bg: 'rgba(96, 125, 139, 0.18)', color: '#e3edf2', border: 'rgba(187, 206, 216, 0.48)' };

const buildDetail = (category: string, idx: number) => ({
  tags: [category, idx % 2 === 0 ? 'フォーマル' : 'カジュアル', 'ネットワーキング'],
  address: `東京都渋谷区神南 1-${(idx % 9) + 1}-${(idx % 5) + 1}`,
  capacity: 30 + (idx % 4) * 10,
  remaining: 2 + (idx % 12),
  menuHighlights: [
    `${category}テイストのシグネチャーメニュー`,
    '厳選素材によるマルチコースディナー',
    'ペアリングドリンクセット',
    'デザートプレート（シェフスペシャル）',
  ],
  detailText:
    '業界の最前線で活躍する登壇者と参加者が交流できる、実践的なインサイト共有イベントです。会場内にはフォトスポットやコミュニティエリアも用意されています。',
});

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box
    sx={{
      borderRadius: 2.75,
      border: '1px solid rgba(218, 234, 253, 0.54)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,253,255,0.94))',
      boxShadow: '0 10px 24px rgba(2, 10, 26, 0.22)',
      p: { xs: 1.4, md: 1.7 },
    }}
  >
    <Typography sx={{ fontSize: '1.02rem', fontWeight: 800, color: '#122745', mb: 1.1 }}>{title}</Typography>
    {children}
  </Box>
);

const PostEventDetailScreen: React.FC = () => {
  const { tab, id } = useParams<{ tab: string; id: string }>();
  const navigate = useNavigate();

  const event = useMemo(() => {
    const found = postManagementMockApi.findPostEventByRoute(tab, id);
    const fallback = postManagementMockApi.findPostEventByRoute('today', '1');
    return found ?? fallback;
  }, [tab, id]);

  if (!event) return null;

  const imageUrls = useMemo(() => (event.imageUrls?.length ? event.imageUrls.slice(0, 8) : [event.imageUrl]), [event]);
  const numericId = Number(event.id.split('-').pop() ?? '1');
  const detail = useMemo(() => buildDetail(event.category, Number.isNaN(numericId) ? 0 : numericId), [event.category, numericId]);

  const [activeImage, setActiveImage] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartXRef.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 24) return;
    setActiveImage((prev) =>
      deltaX < 0 ? Math.min(imageUrls.length - 1, prev + 1) : Math.max(0, prev - 1),
    );
  };

  const progressPct = ((detail.capacity - detail.remaining) / detail.capacity) * 100;

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
            <FiArrowLeft aria-hidden /> 投稿一覧
          </ButtonBase>
          <Typography sx={{ color: 'rgba(223, 238, 255, 0.92)', fontSize: '0.76rem', fontWeight: 600 }}>
            {event.dateLabel}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 1.4, md: 1.7 }}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                border: '1px solid rgba(226, 242, 255, 0.36)',
                boxShadow: '0 14px 28px rgba(3, 10, 24, 0.34)',
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Box
                component="img"
                src={imageUrls[activeImage]}
                alt={event.title}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5, 15, 31, 0.12) 32%, rgba(5, 15, 31, 0.64) 100%)',
                }}
              />

              <ButtonBase
                onClick={() => setActiveImage((prev) => Math.max(0, prev - 1))}
                disabled={activeImage === 0}
                aria-label="前の画像を表示"
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '50%',
                  height: '100%',
                  display: 'grid',
                  justifyItems: 'start',
                  alignItems: 'center',
                  pl: 1.1,
                  color: '#f4faff',
                  opacity: activeImage === 0 ? 0.35 : 1,
                }}
              >
                <Box component="span" aria-hidden sx={{ fontSize: 18, fontWeight: 500, transform: 'scaleX(-0.84) scaleY(1.74)' }}>
                  {'>'}
                </Box>
              </ButtonBase>

              <ButtonBase
                onClick={() => setActiveImage((prev) => Math.min(imageUrls.length - 1, prev + 1))}
                disabled={activeImage >= imageUrls.length - 1}
                aria-label="次の画像を表示"
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '50%',
                  height: '100%',
                  display: 'grid',
                  justifyItems: 'end',
                  alignItems: 'center',
                  pr: 1.1,
                  color: '#f4faff',
                  opacity: activeImage >= imageUrls.length - 1 ? 0.35 : 1,
                }}
              >
                <Box component="span" aria-hidden sx={{ fontSize: 18, fontWeight: 500, transform: 'scaleX(0.84) scaleY(1.74)' }}>
                  {'>'}
                </Box>
              </ButtonBase>

              <CarouselIndicator total={imageUrls.length} currentIndex={activeImage} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ minHeight: 220}}>
            <SectionCard title="Event Name">
              <Typography component="h1" sx={{ fontSize: { xs: '1.42rem', md: '2.5rem' }, color: '#10243f', fontWeight: 800, lineHeight: 1.24 }}>
                {event.title}
              </Typography>
            </SectionCard>
          </Grid>

          <Grid>
            <Grid container spacing={1} sx={{ mt: 1.1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ minHeight: 38, borderRadius: 999, px: 1.25, border: '1px solid rgba(184, 207, 233, 0.82)', backgroundColor: '#f3f9ff', color: '#2d496e', display: 'inline-flex', width: '100%', alignItems: 'center', gap: 0.66, fontSize: '0.84rem', fontWeight: 700 }}>
                    <FiClock size={14} aria-hidden /> {event.timeLabel}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ minHeight: 38, borderRadius: 999, px: 1.25, border: '1px solid rgba(184, 207, 233, 0.82)', backgroundColor: '#f3f9ff', color: '#2d496e', display: 'inline-flex', width: '100%', alignItems: 'center', gap: 0.66, fontSize: '0.84rem', fontWeight: 700 }}>
                    <FiMapPin size={14} aria-hidden /> {detail.address}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mt: 1.2 }}>
                {detail.tags.map((tag) => {
                  const color = CATEGORY_COLORS[tag] ?? DEFAULT_COLOR;
                  return (
                    <Box key={tag} sx={{ px: 1.1, py: 0.32, borderRadius: 999, border: `1px solid ${color.border}`, backgroundColor: color.bg, color: color.color, fontWeight: 700, fontSize: '0.75rem' }}>
                      {tag}
                    </Box>
                  );
                })}
              </Box>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <SectionCard title="Overview">
              <Typography sx={{ color: '#374a5e', fontSize: '0.86rem', lineHeight: 1.8 }}>{event.description}</Typography>
            </SectionCard>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <SectionCard title="Area Map">
              <Box sx={{ height: 168, borderRadius: 2, border: '1px solid rgba(171, 200, 229, 0.54)', background: 'linear-gradient(150deg, #dce8f4 0%, #c8d9ec 55%, #b4cce4 100%)', position: 'relative', overflow: 'hidden' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={`h-${i}`} sx={{ position: 'absolute', top: `${i * 20}%`, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.58)' }} />
                ))}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={`v-${i}`} sx={{ position: 'absolute', left: `${i * (100 / 6)}%`, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.58)' }} />
                ))}
                <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}>
                  <FiMapPin size={30} color="#e53935" />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', px: 1.1, py: 0.32, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.92)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#1a3a5c', fontWeight: 700 }}>{event.venue}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 0.95, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#4a5e72', fontSize: '0.78rem', fontWeight: 600, minWidth: 0, flex: 1 }} noWrap>
                  {detail.address}
                </Typography>
                <ButtonBase
                  component="a"
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#1a73e8', fontSize: '0.77rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.35, flexShrink: 0 }}
                >
                  Open in Maps <FiExternalLink size={11} aria-hidden />
                </ButtonBase>
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SectionCard title="Reservation URL">
              <Typography sx={{ color: '#4a5e72', fontSize: '0.82rem', mb: 0.9, wordBreak: 'break-all' }}>
                {`https://eventpick.example.com/reserve/${event.id}`}
              </Typography>
              <ButtonBase
                component="a"
                href={`https://eventpick.example.com/reserve/${event.id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: '100%',
                  py: 1.15,
                  borderRadius: 1.75,
                  background: 'linear-gradient(135deg, #1461c8 0%, #2f91ea 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  boxShadow: '0 6px 14px rgba(19, 96, 195, 0.32)',
                }}
              >
                予約ページを開く
              </ButtonBase>
              <Typography sx={{ mt: 0.95, color: '#546e7a', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                {detail.remaining} spots remaining out of {detail.capacity}
              </Typography>
              <Box sx={{ mt: 0.7, height: 7, borderRadius: 999, backgroundColor: 'rgba(195, 218, 240, 0.6)', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${progressPct}%`, borderRadius: 999, background: 'linear-gradient(90deg, #1565c0, #42a5f5)' }} />
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SectionCard title="Event Details">
              <Typography sx={{ color: '#1f3554', fontSize: '0.86rem', fontWeight: 800, mb: 0.6 }}>Menu Highlights</Typography>
              {detail.menuHighlights.map((item) => (
                <Typography key={item} sx={{ color: '#3b4f64', fontSize: '0.82rem', lineHeight: 1.72 }}>
                  • {item}
                </Typography>
              ))}

              <Box sx={{ borderBottom: '1px solid rgba(195, 218, 240, 0.52)', my: 1.35 }} />

              <Typography sx={{ color: '#1f3554', fontSize: '0.86rem', fontWeight: 800, mb: 0.6 }}>Description</Typography>
              <Typography sx={{ color: '#3b4f64', fontSize: '0.82rem', lineHeight: 1.75 }}>
                {detail.detailText}
              </Typography>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PostEventDetailScreen;
