import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './app';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './styles/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { authTheme } from './styles/theme/muiTheme';

/* ─── グローバルエラーハンドラ ─── */

// 未処理の同期エラー
window.addEventListener('error', (event) => {
  console.error('[Global] Unhandled error:', event.error ?? event.message);
});

// 未処理の Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global] Unhandled promise rejection:', event.reason);
});

const root = document.getElementById('root');
if (!root) throw new Error('#root が見つかりません');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={authTheme}>
        <CssBaseline enableColorScheme />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

