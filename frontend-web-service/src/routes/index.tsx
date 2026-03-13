import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import OperatorRoute from './OperatorRoute';
import BaseLayout from '../layouts/BaseLayout';
import AdminLayout from '../features/admin/components/AdminLayout/AdminLayout';
import RouteErrorBoundary from '../components/ErrorBoundary/RouteErrorBoundary';
import { lazyLoad } from './lazyLoad';

// Code Splitting: 画面ごとにJSを分割読み込み
// `lazyLoad` ヘルパを使って各画面を遅延読み込みします。

export const router = createBrowserRouter([
  // ─── 認証系画面（ダークテーマ BaseLayout） ───────────────
  {
    element: <BaseLayout />,
    errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
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
            path: '/accounts',
            element: lazyLoad(() => import('../features/accounts/screens/AccountsListScreen')),
          },
          {
            path: '/accounts/issue',
            element: lazyLoad(() => import('../features/accounts/screens/AccountsIssueScreen')),
          },
          {
            path: '/accounts/edit/:id',
            element: lazyLoad(() => import('../features/accounts/screens/AccountsEditScreen')),
          },
          {
            path: '/plan',
            element: lazyLoad(() => import('../features/plan/screens/PlanScreen')),
          },
          {
            path: '/settings/account',
            element: lazyLoad(() => import('../features/settings/screens/SettingsAccountScreen')),
          },
          {
            path: '/settings/notifications',
            element: lazyLoad(() => import('../features/settings/screens/SettingsNotificationsScreen')),
          },
          {
            path: '/settings/billing',
            element: lazyLoad(() => import('../features/settings/screens/SettingsBillingScreen')),
          },
          {
            path: '/settings/billing/edit',
            element: lazyLoad(() => import('../features/settings/screens/SettingsBillingEditScreen')),
          },
          {
            path: '/settings/billing/subscription',
            element: lazyLoad(() => import('../features/settings/screens/BillingSubscriptionScreen')),
          },
          {
            path: '/settings/billing/stripe-info',
            element: lazyLoad(() => import('../features/settings/screens/BillingStripeInfoScreen')),
          },
          {
            path: '/settings/billing/terms',
            element: lazyLoad(() => import('../features/settings/screens/BillingTermsScreen')),
          },
          {
            path: '/settings/billing/privacy',
            element: lazyLoad(() => import('../features/settings/screens/BillingPrivacyScreen')),
          },
          {
            path: '/settings/history',
            element: lazyLoad(() => import('../features/settings/screens/SettingsHistoryScreen')),
          },
          {
            path: '/settings/contact',
            element: lazyLoad(() => import('../features/settings/screens/SettingsContactScreen')),
          },
          {
            path: '/report',
            element: lazyLoad(() => import('../features/reports/screens/ReportScreen.tsx')),
          },
          {
            path: '/report/:reportId',
            element: lazyLoad(() => import('../features/reports/screens/ReportDetailScreen.tsx')),
          },
          {
            path: '/posts',
            element: lazyLoad(() => import('../features/posts/screens/PostsListScreen')),
          },
          {
            path: '/posts/create',
            element: lazyLoad(() => import('../features/posts/screens/PostCreateScreen')),
          },
          {
            path: '/posts/preview',
            element: lazyLoad(() => import('../features/posts/screens/PostDetailScreenB')),
          },
          {
            path: '/posts/drafts',
            element: lazyLoad(() => import('../features/posts/screens/PostDraftsScreen')),
          },
          {
            path: '/posts/scheduled',
            element: lazyLoad(() => import('../features/posts/screens/ScheduledPostsScreen.tsx')),
          },
          {
            path: '/posts/scheduled/edit/:id',
            element: lazyLoad(() => import('../features/posts/screens/ScheduledPostEditScreen')),
          },
          {
            path: '/posts/:tab/:id',
            element: lazyLoad(() => import('../features/posts/screens/PostDetailScreenB')),
          },
        ],
      },

      // ルートアクセス → ログインへ
      { path: '/',  element: <Navigate to="/login" replace /> },
    ],
  },

  // ─── 運営管理画面（AdminLayout + OperatorRoute） ─────────
  // NOTE: BaseLayout の外に配置し、独自レイアウトを使用する
  {
    element: <OperatorRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AdminLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: '/admin',
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: '/admin/dashboard',
            element: lazyLoad(() => import('../features/admin/screens/AdminDashboardScreen')),
          },
          {
            path: '/admin/consumers',
            element: lazyLoad(() => import('../features/admin/screens/AdminConsumersScreen')),
          },
          {
            path: '/admin/accounts',
            element: lazyLoad(() => import('../features/admin/screens/AdminLocationAccountsScreen')),
          },
          {
            path: '/admin/reviews',
            element: lazyLoad(() => import('../features/admin/screens/AdminReviewsScreen')),
          },
          {
            path: '/admin/categories',
            element: lazyLoad(() => import('../features/admin/screens/AdminCategoriesScreen')),
          },
          {
            path: '/admin/coupons',
            element: lazyLoad(() => import('../features/admin/screens/AdminCouponsScreen')),
          },
          {
            path: '/admin/inquiries',
            element: lazyLoad(() => import('../features/admin/screens/AdminInquiriesScreen')),
          },
          {
            path: '/admin/activity-log',
            element: lazyLoad(() => import('../features/admin/screens/AdminActivityLogScreen')),
          },
          {
            path: '/admin/settings',
            element: lazyLoad(() => import('../features/admin/screens/AdminSettingsScreen')),
          },
        ],
      },
    ],
  },

  // 不明パス → ログイン
  { path: '*', element: <Navigate to="/login" replace /> },
]);
