import React from 'react';
import { MenuItem, Select } from '@mui/material';
import { FiChevronDown } from 'react-icons/fi';
import { CATEGORIES, GLASS_BG, GLASS_BORDER, NEON_SHADOW } from '../utils/postCreateHelpers';

const CategorySelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <Select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    displayEmpty
    IconComponent={FiChevronDown}
    sx={{
      width: '100%',
      height: 44,
      borderRadius: '10px',
      backgroundColor: GLASS_BG,
      border: GLASS_BORDER,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: NEON_SHADOW,
      color: value ? '#f8fbff' : 'rgba(229, 239, 255, 0.72)',
      fontSize: '0.9rem',
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '& .MuiSelect-icon': { color: 'rgba(240, 247, 255, 0.82)', right: 10 },
      '&:hover': {
        borderColor: 'rgba(98, 156, 230, 0.92)',
        boxShadow: '0 0 12px rgba(111,179,255,0.7)',
      },
      '&.Mui-focused': {
        borderColor: 'rgba(25, 56, 108, 0.98)',
        boxShadow: '0 0 14px rgba(80,160,255,0.66)',
      },
      '& .MuiSelect-select': { py: 0 },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: '#10213e',
          border: '1px solid rgba(155, 183, 225, 0.42)',
          borderRadius: '8px',
          mt: 0.5,
        },
      },
    }}
  >
    <MenuItem value="" disabled sx={{ color: 'rgba(140,170,220,0.5)', fontSize: '0.88rem' }}>
      カテゴリーを選択
    </MenuItem>
    {CATEGORIES.map((cat) => (
      <MenuItem
        key={cat}
        value={cat}
        sx={{
          color: '#e2eeff',
          fontSize: '0.88rem',
          '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(43, 83, 143, 0.32)',
            color: '#d2e7ff',
            '&:hover': { backgroundColor: 'rgba(43, 83, 143, 0.38)' },
          },
        }}
      >
        {cat}
      </MenuItem>
    ))}
  </Select>
);

export default CategorySelect;
