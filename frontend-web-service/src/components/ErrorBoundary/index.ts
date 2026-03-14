/**
 * ErrorBoundary モジュール — バレルエクスポート
 */
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ErrorPage } from './ErrorPage';
export type { ErrorKind, ErrorPageProps } from './ErrorPage';
export { default as RouteErrorBoundary } from './RouteErrorBoundary';
export { classifyError, extractErrorMessage } from './classifyError';
export { useAsyncErrorBoundary } from './useAsyncErrorBoundary';
export {
  reportError,
  buildReport,
  stripPii,
  setErrorReportHandler,
  resetDedupCache,
} from './errorReporter';
export type { ErrorReport, ErrorReportHandler } from './errorReporter';
