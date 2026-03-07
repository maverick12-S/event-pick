import React from 'react';
import { Box } from '@mui/material';

interface CarouselIndicatorProps {
  total: number;
  currentIndex: number;
}

const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({ total, currentIndex }) => {
  if (total <= 1) {
    return null;
  }

  const start = Math.max(0, currentIndex - 1);
  const end = Math.min(total - 1, currentIndex + 1);
  const visibleIndexes = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        left: '50%',
        bottom: 8,
        transform: 'translateX(-50%)',
        minHeight: 18,
        px: 0.75,
        borderRadius: 999,
        backgroundColor: 'rgba(5, 15, 32, 0.42)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.625,
      }}
    >
      {visibleIndexes.map((index) => (
        <Box
          key={`dot-${index}`}
          sx={{
            width: 5,
            height: 5,
            borderRadius: 999,
            backgroundColor: index === currentIndex ? 'rgba(250, 252, 255, 0.98)' : 'rgba(232, 242, 255, 0.42)',
            boxShadow: index === currentIndex ? '0 0 4px rgba(27, 44, 80, 0.35)' : 'none',
          }}
        />
      ))}
    </Box>
  );
};

export default CarouselIndicator;
