import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './styles/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

const root = document.getElementById('root');
if (!root) throw new Error('#root が見つかりません');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);

