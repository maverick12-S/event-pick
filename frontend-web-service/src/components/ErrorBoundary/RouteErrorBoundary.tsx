/**
 * RouteErrorBoundary
 * ─────────────────────────────────────────────
 * React Router の errorElement として使用するエラー境界。
 * useRouteError() でルーティングエラーを取得し、ErrorPage を表示。
 */

import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import type { ErrorKind } from './ErrorPage';
import { classifyError, extractErrorMessage } from './classifyError';

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let kind: ErrorKind = 'unknown';
  let message = '';

  if (isRouteErrorResponse(error)) {
    // React Router のレスポンスエラー
    switch (error.status) {
      case 401:
        kind = 'auth';
        break;
      case 403:
        kind = 'forbidden';
        break;
      case 404:
        kind = 'not-found';
        break;
      default:
        kind = error.status >= 500 ? 'server' : 'unknown';
    }
    message = error.statusText || String(error.data);
  } else {
    kind = classifyError(error);
    message = extractErrorMessage(error);
  }

  console.error('[RouteErrorBoundary] Route error:', error);

  return <ErrorPage kind={kind} message={message} />;
};

export default RouteErrorBoundary;
