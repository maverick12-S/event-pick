import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';

const PostListPagination: React.FC<{
  page: number;
  totalPages: number;
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, totalPages, currentPage, onPrev, onNext }) => (
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
      onClick={onPrev}
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
      onClick={onNext}
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
);

export default PostListPagination;
