import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import BaseLayout from '../layouts/BaseLayout';
import { lazyLoad } from './lazyLoad';

// Code Splitting: 画面ごとにJSを分割読み込み
// `lazyLoad` ヘルパを使って各画面を遅延読み込みします。

export const router = createBrowserRouter([
  // ─── 認証系画面（ダークテーマ BaseLayout） ───────────────
  {
    element: <BaseLayout />,
    children: [
      // 公開ルート
      {
        path: '/login',
        element: lazyLoad(() => import('../features/login/components/LoginForm/screens/LoginScreen')),
      },
      {
        path: '/signup',
        element: lazyLoad(() => import('../features/login/components/signupForm/screens/SignupScreen')),
      },
      {
        path: '/password-reset',
        element: lazyLoad(() => import('../features/login/components/passwordReset/screens/PasswordResetScreen')),
      },
      {
        path: '/mfa',
        element: lazyLoad(() => import('../features/login/components/mfa/screens/MfaScreen')),
      },
      {
        path: '/password-change',
        element: lazyLoad(() => import('../features/login/components/passwordChange/screens/PasswordChangeScreen')),
      },

      // 認証必須ルート（ProtectedRouteが門番）
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: lazyLoad(() => import('../features/dashboard/screens/DashboardScreen')),
          },
          {
            path: '/home',
            element: lazyLoad(() => import('../features/home/screens/HomeScreen')),
          },
          {
            path: '/plan',
            element: lazyLoad(() => import('../features/plan/screens/PlanScreen')),
          },
        ],
      },

      // ルートアクセス → ログインへ
      { path: '/',  element: <Navigate to="/login" replace /> },
    ],
  },

  // 不明パス → ログイン
  { path: '*', element: <Navigate to="/login" replace /> },
]);
