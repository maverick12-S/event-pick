import React from 'react';
import { Box, Typography } from '@mui/material';

const FieldLabel: React.FC<{ num: number; label: string }> = ({ num, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65, mb: 0.5 }}>
    <Typography
      sx={{
        color: 'rgba(194,220,255,0.78)',
        fontSize: '0.86rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      {num}. {label}
    </Typography>
  </Box>
);

export default FieldLabel;
