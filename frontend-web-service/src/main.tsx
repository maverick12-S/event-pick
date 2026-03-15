import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './app';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { reportError } from './components/ErrorBoundary/errorReporter';
import { classifyError } from './components/ErrorBoundary/classifyError';
import './styles/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { authTheme } from './styles/theme/muiTheme';

// Zod グローバル日本語エラーマップ (z.setErrorMap を副作用で登録)
import './lib/zodErrorMap';

/* ─── グローバルエラーハンドラ ─── */

// 未処理の同期エラー
window.addEventListener('error', (event) => {
  const error = event.error ?? new Error(event.message);
  const kind = classifyError(error);
  reportError(kind, error, 'global');
});

// 未処理の Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));
  const kind = classifyError(error);
  reportError(kind, error, 'rejection');
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

