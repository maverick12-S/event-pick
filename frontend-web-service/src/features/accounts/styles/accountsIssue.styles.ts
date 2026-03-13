export const issueFieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 50,
    borderRadius: '12px',
    color: '#eaf5ff',
    background: 'linear-gradient(180deg, rgba(232, 245, 255, 0.12), rgba(180, 206, 236, 0.1))',
    '& fieldset': {
      borderColor: 'rgba(168, 206, 250, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(133, 194, 255, 0.52)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#48d5ff',
      boxShadow: '0 0 0 3px rgba(72, 213, 255, 0.15)',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.96rem',
    py: 1,
  },
} as const;

export const issueLabelSx = {
  color: 'rgba(215, 236, 255, 0.9)',
  fontSize: '0.86rem',
  fontWeight: 700,
  mb: 0.55,
} as const;
