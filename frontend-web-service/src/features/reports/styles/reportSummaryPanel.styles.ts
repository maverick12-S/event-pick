export const summaryPanelSx = {
  mt: 2.2,
  borderRadius: { xs: 2.2, md: 1.8 },
  border: '1px solid rgba(210, 226, 246, 0.42)',
  background:
    'radial-gradient(120% 120% at 0% -25%, rgba(165, 206, 255, 0.16), rgba(165, 206, 255, 0) 42%), linear-gradient(180deg, rgba(15, 33, 58, 0.55), rgba(9, 21, 40, 0.72))',
  boxShadow: 'inset 0 1px 0 rgba(238, 247, 255, 0.2), 0 16px 32px rgba(2, 8, 22, 0.42)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  p: { xs: 1.6, md: 2.2 },
} as const;

export const summaryTitleSx = {
  color: '#f3f8ff',
  fontWeight: 800,
  fontSize: { xs: '1.06rem', md: '1.18rem' },
  letterSpacing: '0.02em',
  mb: 1.2,
} as const;

export const summaryGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
    lg: 'repeat(6, minmax(0, 1fr))',
  },
  gap: 1,
} as const;

export const summaryMetricCardSx = {
  minHeight: 92,
  borderRadius: 1.4,
  border: '1px solid rgba(188, 212, 240, 0.34)',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
  px: 1.1,
  py: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
} as const;

export const summaryMetricLabelSx = {
  color: 'rgba(212, 229, 248, 0.9)',
  fontSize: '0.8rem',
  fontWeight: 700,
  lineHeight: 1.35,
} as const;

export const summaryMetricValueSx = {
  color: '#f5f9ff',
  fontSize: { xs: '1.16rem', md: '1.26rem' },
  fontWeight: 800,
} as const;
