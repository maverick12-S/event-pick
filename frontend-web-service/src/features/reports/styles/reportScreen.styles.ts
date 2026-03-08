export const controlCardSx = {
  minHeight: 54,
  px: 1.05,
  borderRadius: 2,
  border: '1px solid rgba(201, 218, 239, 0.55)',
  background: 'linear-gradient(180deg, rgba(120, 138, 166, 0.34), rgba(84, 104, 132, 0.4))',
  boxShadow: 'inset 0 1px 0 rgba(248, 252, 255, 0.25), 0 4px 12px rgba(4, 10, 24, 0.22)',
} as const;

export const accountIdRowCardSx = {
  minHeight: 54,
  px: 1.05,
  borderRadius: 2,
  border: '1px solid rgba(210, 226, 246, 0.42)',
  background: 'linear-gradient(180deg, rgba(18, 36, 62, 0.5), rgba(10, 24, 45, 0.64))',
  boxShadow: 'inset 0 1px 0 rgba(238, 247, 255, 0.18), 0 12px 26px rgba(2, 8, 22, 0.36)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
} as const;

export const controlInputSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    minHeight: 52,
    color: '#eef6ff',
    background: 'transparent',
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputBase-input': { py: 0.8, fontSize: '1.02rem' },
  '& .MuiInputBase-input::placeholder': { color: 'rgba(230, 240, 251, 0.8)', opacity: 1 },
} as const;

export const datePickerTriggerSx = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 0.9,
  px: 1.2,
  py: 0.8,
  borderRadius: '999px',
  border: '1px solid rgba(182, 208, 240, 0.5)',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  minHeight: 52,
  flex: '1 1 0',
  justifyContent: 'flex-start',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.07)' },
} as const;

export const datePickerIconWrapSx = {
  width: 28,
  height: 28,
  borderRadius: '8px',
  border: '1px solid rgba(170,205,242,0.52)',
  backgroundColor: 'rgba(188,220,255,0.14)',
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
} as const;

export const datePickerLabelSx = {
  color: 'rgba(198,221,248,0.84)',
  fontSize: '0.86rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
} as const;

export const datePickerValueSx = {
  color: '#f0f7ff',
  fontSize: '1.02rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
} as const;

export const hiddenDateInputSx = {
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  width: 1,
  height: 1,
} as const;

const headCellSx = {
  color: 'rgba(239, 247, 255, 0.96)',
  fontWeight: 700,
  fontSize: '1.22rem',
  borderColor: 'rgba(196, 215, 239, 0.2)',
  whiteSpace: 'nowrap',
  py: 1.95,
  letterSpacing: '0.01em',
  textShadow: '0 2px 6px rgba(3, 10, 24, 0.35)',
};

export const bodyCellSx = {
  color: 'rgba(230, 241, 252, 0.94)',
  fontSize: '1.06rem',
  py: 3.35,
  whiteSpace: 'nowrap',
};

export const titleHeadCellSx = {
  ...headCellSx,
  width: '25%',
};

export const titleBodyCellSx = {
  ...bodyCellSx,
  width: '25%',
  fontWeight: 700,
  color: '#f4f9ff',
};

export const summaryHeadCellSx = {
  ...headCellSx,
  width: '30%',
};

export const summaryBodyCellSx = {
  ...bodyCellSx,
  width: '30%',
  whiteSpace: 'normal',
  lineHeight: 1.5,
};

export const dateHeadCellSx = {
  ...headCellSx,
  width: '12%',
};

export const dateBodyCellSx = {
  ...bodyCellSx,
  width: '12%',
};

export const metricHeadCellSx = {
  ...headCellSx,
  width: '9%',
};

export const metricBodyCellSx = {
  ...bodyCellSx,
  width: '9%',
};

export const detailHeadCellSx = {
  ...headCellSx,
  width: '6%',
  textAlign: 'center',
};

export const detailBodyCellSx = {
  ...bodyCellSx,
  width: '6%',
  textAlign: 'center',
};
