/**
 * EventPick MUI Theme
 * ─────────────────────────────────────────────
 * 認証系画面（ダークネイビー）と
 * アプリ系画面（ライト＋オレンジ）を両立するテーマ設定。
 *
 * 認証画面 → authTheme (dark, glassmorphism)
 * アプリ画面 → appTheme  (light, EventPick orange #FF6B3D)
 */

import { createTheme } from '@mui/material/styles';

// ──────────────────────────────────────────────
//  共通設定
// ──────────────────────────────────────────────
const commonTypography = {
  fontFamily:
    "'Noto Sans JP', 'Inter', system-ui, -apple-system, 'Hiragino Sans', " +
    "'Yu Gothic UI', 'Meiryo', Helvetica, Arial, sans-serif",
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  button: { textTransform: 'none' as const, fontWeight: 600 },
};

const commonShape = { borderRadius: 12 };

// ──────────────────────────────────────────────
//  認証系画面テーマ（ダークネイビー）
// ──────────────────────────────────────────────
export const authTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a66ff',
      dark: '#0052cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00d2e6',
    },
    background: {
      default: '#071020',
      paper: 'rgba(255,255,255,0.10)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.72)',
      disabled: 'rgba(255,255,255,0.38)',
    },
    error: { main: '#ff6b6b' },
    divider: 'rgba(255,255,255,0.18)',
  },
  typography: commonTypography,
  shape: commonShape,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
          borderRadius: 14,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 10,
          color: '#ffffff',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.45)' },
          '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
        },
        input: {
          '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: 'rgba(255,255,255,0.6)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #0a66ff 0%, #0052cc 100%)',
          boxShadow: '0 4px 20px rgba(10,86,255,0.35)',
          borderRadius: 10,
          padding: '13px 0',
          fontSize: '1rem',
          '&:hover': {
            background: 'linear-gradient(135deg, #1a76ff 0%, #1062dc 100%)',
            boxShadow: '0 6px 24px rgba(10,86,255,0.5)',
          },
          '&:disabled': { opacity: 0.55 },
        },
      },
    },
    MuiGrid: {},
  },
});

// ──────────────────────────────────────────────
//  アプリ系画面テーマ（ライト・オレンジ）
// ──────────────────────────────────────────────
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B3D',
      dark: '#e05530',
      light: '#ff8f6d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2D2D2D',
    },
    background: {
      default: '#F7F7F7',
      paper: '#ffffff',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#666666',
    },
    divider: '#EBEBEB',
  },
  typography: commonTypography,
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          border: 'none',
          overflow: 'hidden',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #EBEBEB',
          height: 64,
          background: '#ffffff',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#999999',
          '&.Mui-selected': { color: '#FF6B3D' },
          minWidth: 0,
        },
        label: {
          fontSize: '0.7rem',
          '&.Mui-selected': { fontSize: '0.7rem' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
  },
});
