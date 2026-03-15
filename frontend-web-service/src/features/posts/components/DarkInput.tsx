import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { GLASS_BG, GLASS_BORDER, NEON_SHADOW } from '../utils/postCreateHelpers';

const DarkInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  type?: string;
  minHeight?: number;
  fontSize?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder, multiline = false, rows = 1, icon, type = 'text', minHeight = 44, fontSize = '0.9rem', maxLength }) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const handleContainerClick = () => {
    if (multiline || type !== 'time') return;

    const el = inputRef.current;
    if (!el) return;

    el.focus();
    if ('showPicker' in el && typeof (el as HTMLInputElement).showPicker === 'function') {
      (el as HTMLInputElement).showPicker();
    }
  };

  return (
    <Box
      onClick={handleContainerClick}
      sx={{
        display: 'flex',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 0.75,
        px: 1.5,
        py: multiline ? 1.25 : 0,
        minHeight: multiline ? 'auto' : minHeight,
        borderRadius: '12px',
        border: GLASS_BORDER,
        backgroundColor: GLASS_BG,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: NEON_SHADOW,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: !multiline && type === 'time' ? 'pointer' : 'text',
        '&:hover': {
          borderColor: 'rgba(98, 156, 230, 0.92)',
          boxShadow: '0 0 12px rgba(111,179,255,0.7)',
        },
        '&:focus-within': {
          borderColor: 'rgba(25, 56, 108, 0.98)',
          boxShadow: '0 0 14px rgba(80,160,255,0.66)',
        },
      }}
    >
      {icon && (
        <Box sx={{ color: 'rgba(216, 234, 255, 0.9)', flexShrink: 0, mt: multiline ? 0.35 : 0, fontSize: '0.95rem' }}>
          {icon}
        </Box>
      )}
      <Box
        ref={inputRef}
        component={multiline ? 'textarea' : 'input'}
        type={multiline ? undefined : type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(typeof maxLength === 'number' ? e.target.value.slice(0, maxLength) : e.target.value)
        }
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        maxLength={maxLength}
        sx={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: '#ffffff',
          fontSize,
          fontFamily: 'inherit',
          resize: multiline ? 'vertical' : 'none',
          lineHeight: 1.65,
          py: multiline ? 0 : 0,
          minHeight: multiline ? `${rows * 1.65 * 14}px` : 'auto',
          '&::placeholder': { color: 'rgba(221, 236, 255, 0.75)' },
          colorScheme: 'light',
          cursor: !multiline && type === 'time' ? 'pointer' : 'text',
        }}
      />
    </Box>
  );
};

export default DarkInput;
