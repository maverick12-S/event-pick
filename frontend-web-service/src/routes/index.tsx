import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SuspenseLoading from '../components/SuspenseWeather/SuspenseLoading';
import BaseLayout from '../layouts/BaseLayout';

// Code Splitting: 画面ごとにJSを分割読み込み
// LoginScreen は現在 `features/login/components/LoginForm/screens/` に存在するため、
// 実際のパスに合わせて読み込む。
const LoginScreen = lazy(() => import('../features/login/components/LoginForm/screens/LoginScreen'));
// 今後追加: const DashboardScreen = lazy(() => import('../features/dashboard/screens/DashboardScreen'));

// `SuspenseLoading` をルートレベルのフォールバックに利用します

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      // 公開ルート
      {
        path: '/login',
        element: <Suspense fallback={<SuspenseLoading />}><LoginScreen /></Suspense>,
      },

      // 認証必須ルート（ProtectedRouteが門番）
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<SuspenseLoading />}>
                <div style={{ color: '#fff', padding: 40 }}>Dashboard（実装予定）</div>
              </Suspense>
            ),
          },
        ],
      },

      // ルートアクセス → ログインへ
      { path: '/',  element: <Navigate to="/login" replace /> },
      { path: '*',  element: <Navigate to="/login" replace /> },
    ],
  },
]);