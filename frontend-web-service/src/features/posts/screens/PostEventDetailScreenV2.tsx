import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, ButtonBase, Typography } from '@mui/material';
import { FiArrowLeft, FiClock, FiExternalLink, FiMapPin } from 'react-icons/fi';
import postManagementMockApi from '../../../api/mock/postManagementMockApi';
import { CarouselIndicator } from '../components';

// ------------------------------------------------------------
// Category badge color map
// ------------------------------------------------------------
const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  食事: { bg: 'rgba(220, 53, 69, 0.12)', color: '#b71c1c', border: 'rgba(220, 53, 69, 0.38)' },
  体験: { bg: 'rgba(40, 167, 69, 0.12)', color: '#1b5e20', border: 'rgba(40, 167, 69, 0.38)' },
  買い物: { bg: 'rgba(255, 160, 0, 0.12)', color: '#e65100', border: 'rgba(255, 160, 0, 0.38)' },
  イベント: { bg: 'rgba(13, 110, 253, 0.12)', color: '#0d47a1', border: 'rgba(13, 110, 253, 0.38)' },
  ライブ: { bg: 'rgba(111, 66, 193, 0.12)', color: '#4a148c', border: 'rgba(111, 66, 193, 0.38)' },
  観光: { bg: 'rgba(0, 172, 193, 0.12)', color: '#006064', border: 'rgba(0, 172, 193, 0.38)' },
  祭り: { bg: 'rgba(239, 108, 0, 0.12)', color: '#bf360c', border: 'rgba(239, 108, 0, 0.38)' },
  温泉: { bg: 'rgba(236, 64, 122, 0.12)', color: '#880e4f', border: 'rgba(236, 64, 122, 0.38)' },
  車: { bg: 'rgba(55, 71, 79, 0.12)', color: '#263238', border: 'rgba(55, 71, 79, 0.38)' },
  フォーマル: { bg: 'rgba(21, 101, 192, 0.12)', color: '#0d47a1', border: 'rgba(21, 101, 192, 0.38)' },
  カジュアル: { bg: 'rgba(0, 150, 136, 0.12)', color: '#004d40', border: 'rgba(0, 150, 136, 0.38)' },
  ネットワーキング: { bg: 'rgba(211, 47, 47, 0.12)', color: '#b71c1c', border: 'rgba(211, 47, 47, 0.38)' },
};
const DEFAULT_COLOR = { bg: 'rgba(96, 125, 139, 0.12)', color: '#37474f', border: 'rgba(96, 125, 139, 0.38)' };

// ------------------------------------------------------------
// Mock detail data generator (keeps existing DB item untouched)
// ------------------------------------------------------------
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
  dressCode:
    idx % 2 === 0
      ? 'ビジネスカジュアル以上。スマートカジュアル推奨。'
      : 'カジュアル可。動きやすい服装でご参加ください。',
  speakers: [
    { name: '田中 明子', role: `${category}分野 著名プロデューサー` },
    { name: 'Akira Suzuki', role: 'イベントディレクター・キュレーター' },
  ],
});

// ------------------------------------------------------------
// Panel navigation pill dots
// ------------------------------------------------------------
const PanelDots: React.FC<{
  total: number;
  current: number;
  onSelect: (i: number) => void;
}> = ({ total, current, onSelect }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, py: 1.75 }}>
    {Array.from({ length: total }, (_, i) => (
      <ButtonBase
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`パネル ${i + 1}`}
        sx={{
          height: 8,
          width: i === current ? 28 : 8,
          borderRadius: 999,
          backgroundColor:
            i === current ? 'rgba(130, 185, 255, 0.92)' : 'rgba(130, 185, 255, 0.28)',
          transition: 'width 280ms cubic-bezier(0.22,1,0.36,1), background-color 280ms ease',
          minWidth: 8,
        }}
      />
    ))}
  </Box>
);

// ------------------------------------------------------------
// White glass card
// ------------------------------------------------------------
const Card: React.FC<{ children: React.ReactNode; sx?: object }> = ({ children, sx }) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.94)',
      backgroundColor: 'rgba(255, 255, 255, 0.97)',
      boxShadow: '0 4px 20px rgba(2, 8, 22, 0.16)',
      overflow: 'hidden',
      ...sx,
    }}
  >
    {children}
  </Box>
);

// ------------------------------------------------------------
// Section heading
// ------------------------------------------------------------
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#1a3a5c', mb: 0.75, letterSpacing: '0.02em' }}
  >
    {children}
  </Typography>
);

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------
const PostEventDetailScreenV2: React.FC = () => {
  const { tab, id } = useParams<{ tab: string; id: string }>();
  const navigate = useNavigate();

  const event = useMemo(() => {
    const found = postManagementMockApi.findPostEventByRoute(tab, id);
    const fallback = postManagementMockApi.findPostEventByRoute('today', '1');
    return found ?? fallback;
  }, [tab, id]);

  if (!event) return null;

  const imageUrls = useMemo(
    () => (event.imageUrls?.length ? event.imageUrls.slice(0, 8) : [event.imageUrl]),
    [event],
  );

  const numericId = Number(event.id.split('-').pop() ?? '1');
  const detail = useMemo(
    () => buildDetail(event.category, Number.isNaN(numericId) ? 0 : numericId),
    [event.category, numericId],
  );

  const [imgIdx, setImgIdx] = useState(0);
  const imgTouchStartX = useRef<number | null>(null);

  const onImgTouchStart: React.TouchEventHandler = (e) => {
    imgTouchStartX.current = e.changedTouches[0].clientX;
  };
  const onImgTouchEnd: React.TouchEventHandler = (e) => {
    if (imgTouchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - imgTouchStartX.current;
    imgTouchStartX.current = null;
    if (Math.abs(dx) < 24) return;
    setImgIdx((p) =>
      dx < 0 ? Math.min(imageUrls.length - 1, p + 1) : Math.max(0, p - 1),
    );
  };

  const [panel, setPanel] = useState(0);
  const panelTouchStartX = useRef<number | null>(null);

  const onPanelTouchStart: React.TouchEventHandler = (e) => {
    panelTouchStartX.current = e.changedTouches[0].clientX;
  };
  const onPanelTouchEnd: React.TouchEventHandler = (e) => {
    if (panelTouchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - panelTouchStartX.current;
    panelTouchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    setPanel((p) => (dx < 0 ? Math.min(1, p + 1) : Math.max(0, p - 1)));
  };

  const filledPct = ((detail.capacity - detail.remaining) / detail.capacity) * 100;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100dvh',
        px: { xs: 1.25, sm: 2, md: 2.5 },
        pb: { xs: 4, md: 5 },
      }}
    >
      <Box sx={{ pt: { xs: 1.25, md: 1.75 }, pb: 1, display: 'flex', alignItems: 'center' }}>
        <ButtonBase
          onClick={() => navigate(-1)}
          aria-label="投稿一覧に戻る"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            border: '1px solid rgba(176, 210, 255, 0.38)',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'rgba(210, 235, 255, 0.92)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          <FiArrowLeft aria-hidden />
          投稿一覧
        </ButtonBase>
      </Box>

      <Box sx={{ overflow: 'hidden' }}>
        <Box
          onTouchStart={onPanelTouchStart}
          onTouchEnd={onPanelTouchEnd}
          sx={{
            display: 'flex',
            transform: `translateX(-${panel * 100}%)`,
            transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Box sx={{ minWidth: '100%' }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 0,
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                backgroundColor: 'rgba(4, 12, 28, 0.7)',
              }}
              onTouchStart={onImgTouchStart}
              onTouchEnd={onImgTouchEnd}
            >
              <Box
                component="img"
                src={imageUrls[imgIdx]}
                alt={event.title}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {imgIdx > 0 && (
                <ButtonBase
                  onClick={() => setImgIdx((p) => p - 1)}
                  aria-label="前の画像"
                  sx={{
                    position: 'absolute', left: 0, top: 0,
                    width: '50%', height: '100%',
                    display: 'grid', justifyItems: 'start', alignItems: 'center', pl: 1.5,
                    color: 'rgba(244, 250, 255, 0.92)',
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ fontSize: 18, fontWeight: 500, transform: 'scaleX(-0.84) scaleY(1.74)', opacity: 0.86 }}
                  >
                    {'>'}
                  </Box>
                </ButtonBase>
              )}

              {imgIdx < imageUrls.length - 1 && (
                <ButtonBase
                  onClick={() => setImgIdx((p) => p + 1)}
                  aria-label="次の画像"
                  sx={{
                    position: 'absolute', right: 0, top: 0,
                    width: '50%', height: '100%',
                    display: 'grid', justifyItems: 'end', alignItems: 'center', pr: 1.5,
                    color: 'rgba(244, 250, 255, 0.92)',
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ fontSize: 18, fontWeight: 500, transform: 'scaleX(0.84) scaleY(1.74)', opacity: 0.86 }}
                  >
                    {'>'}
                  </Box>
                </ButtonBase>
              )}

              <CarouselIndicator total={imageUrls.length} currentIndex={imgIdx} />
            </Box>

            <Card sx={{ mt: 1.5 }}>
              <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.55rem' },
                    fontWeight: 800,
                    color: '#0d1f3c',
                    lineHeight: 1.3,
                    letterSpacing: '0.01em',
                    mb: 1.75,
                  }}
                >
                  {event.title}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.75 }}>
                  {[
                    { icon: <FiClock size={13} aria-hidden />, label: event.timeLabel },
                    { icon: <FiMapPin size={13} aria-hidden />, label: event.venue },
                  ].map(({ icon, label }) => (
                    <Box
                      key={label}
                      sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 0.6,
                        px: 1.75, py: 0.6,
                        borderRadius: 999,
                        border: '1px solid rgba(170, 200, 232, 0.7)',
                        backgroundColor: 'rgba(238, 246, 255, 0.9)',
                        color: '#2b4870',
                        fontSize: '0.87rem',
                        fontWeight: 600,
                      }}
                    >
                      {icon}
                      {label}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2.25 }}>
                  {detail.tags.map((tag) => {
                    const c = CATEGORY_COLORS[tag] ?? DEFAULT_COLOR;
                    return (
                      <Box
                        key={tag}
                        sx={{
                          px: 1.25, py: 0.35,
                          borderRadius: 999,
                          border: `1px solid ${c.border}`,
                          backgroundColor: c.bg,
                          color: c.color,
                          fontSize: '0.77rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {tag}
                      </Box>
                    );
                  })}
                </Box>

                <Box sx={{ borderBottom: '1px solid rgba(195, 218, 240, 0.5)', mb: 2 }} />

                <Box sx={{ mb: 2.5 }}>
                  <SectionHeading>概要</SectionHeading>
                  <Typography
                    sx={{ fontSize: '0.875rem', color: '#374a5e', lineHeight: 1.8, fontWeight: 400 }}
                  >
                    {event.description}
                  </Typography>
                </Box>

                <ButtonBase
                  onClick={() => setPanel(1)}
                  sx={{
                    width: '100%', py: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(130, 185, 255, 0.48)',
                    backgroundColor: 'rgba(232, 243, 255, 0.7)',
                    color: '#2558a0',
                    fontSize: '0.82rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
                  }}
                >
                  マップ・予約・詳細を見る {'>'}
                </ButtonBase>
              </Box>
            </Card>
          </Box>

          <Box sx={{ minWidth: '100%' }}>
            <Card sx={{ mb: 1.5 }}>
              <Box sx={{ px: 2, pt: 1.75, pb: 0 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0d1f3c', mb: 1.25 }}>
                  Area Map
                </Typography>
              </Box>

              <Box
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: 148,
                  position: 'relative',
                  border: '1px solid rgba(172, 200, 228, 0.48)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(150deg, #dce8f4 0%, #c8d9ec 55%, #b4cce4 100%)',
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={`h${i}`} sx={{ position: 'absolute', top: `${i * 20}%`, left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.55)' }} />
                  ))}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Box key={`v${i}`} sx={{ position: 'absolute', left: `${i * (100 / 6)}%`, top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.55)' }} />
                  ))}
                  <Box sx={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 5, backgroundColor: 'rgba(255,255,255,0.72)' }} />
                  <Box sx={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 5, backgroundColor: 'rgba(255,255,255,0.72)' }} />
                  <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}>
                    <FiMapPin size={30} color="#e53935" />
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                    px: 1.25, py: 0.35,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a3a5c' }}>
                    {event.venue}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  px: 2, pt: 1, pb: 1.75,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography sx={{ fontSize: '0.77rem', color: '#4a5e72', fontWeight: 500, flex: 1, minWidth: 0 }} noWrap>
                  {detail.address}
                </Typography>
                <ButtonBase
                  component="a"
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.4,
                    flexShrink: 0,
                    color: '#1a73e8',
                    fontSize: '0.77rem', fontWeight: 700,
                  }}
                >
                  Open in Maps <FiExternalLink size={11} aria-hidden />
                </ButtonBase>
              </Box>
            </Card>

            <Card sx={{ mb: 1.5 }}>
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0d1f3c', mb: 1.25 }}>
                  Reservation
                </Typography>

                <ButtonBase
                  sx={{
                    width: '100%', py: 1.25, borderRadius: 2,
                    background: 'linear-gradient(135deg, #1255b8 0%, #1976d2 100%)',
                    color: '#ffffff',
                    fontSize: '1rem', fontWeight: 800, letterSpacing: '0.06em',
                    boxShadow: '0 4px 16px rgba(18, 85, 184, 0.38)',
                    display: 'block',
                    '@media (hover: hover) and (pointer: fine)': {
                      '&:hover': { filter: 'brightness(1.06)' },
                    },
                  }}
                >
                  Reserve
                </ButtonBase>

                <Typography
                  sx={{ mt: 1, textAlign: 'center', fontSize: '0.8rem', color: '#546e7a', fontWeight: 500 }}
                >
                  {detail.remaining} spots remaining out of {detail.capacity}
                </Typography>

                <Box
                  sx={{
                    mt: 0.75, height: 6, borderRadius: 999,
                    backgroundColor: 'rgba(195, 218, 240, 0.55)', overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${filledPct}%`,
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </Box>
              </Box>
            </Card>

            <Card sx={{ mb: 1.5 }}>
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0d1f3c', mb: 1.75 }}>
                  Event Details
                </Typography>

                <SectionHeading>Menu Highlights</SectionHeading>
                <Box sx={{ mb: 1.75, pl: 0.25 }}>
                  {detail.menuHighlights.map((item) => (
                    <Typography key={item} sx={{ fontSize: '0.82rem', color: '#374a5e', lineHeight: 1.75 }}>
                      • {item}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ borderBottom: '1px solid rgba(195, 218, 240, 0.5)', mb: 1.75 }} />

                <SectionHeading>Dress Code</SectionHeading>
                <Typography sx={{ fontSize: '0.82rem', color: '#374a5e', lineHeight: 1.7, mb: 1.75 }}>
                  {detail.dressCode}
                </Typography>

                <Box sx={{ borderBottom: '1px solid rgba(195, 218, 240, 0.5)', mb: 1.75 }} />

                <SectionHeading>Special Guest Speakers</SectionHeading>
                <Box sx={{ pl: 0.25 }}>
                  {detail.speakers.map((sp) => (
                    <Typography key={sp.name} sx={{ fontSize: '0.82rem', color: '#374a5e', lineHeight: 1.75 }}>
                      • {sp.name} - {sp.role}
                    </Typography>
                  ))}
                </Box>

                <ButtonBase
                  onClick={() => setPanel(0)}
                  sx={{
                    mt: 2.5, width: '100%', py: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(130, 185, 255, 0.48)',
                    backgroundColor: 'rgba(232, 243, 255, 0.7)',
                    color: '#2558a0',
                    fontSize: '0.82rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
                  }}
                >
                  {'<'} イベント概要に戻る
                </ButtonBase>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      <PanelDots total={2} current={panel} onSelect={setPanel} />
    </Box>
  );
};

export default PostEventDetailScreenV2;
