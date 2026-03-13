/**
 * AdminLayout
 * ─────────────────────────────────────────────
 * 運営管理画面の共通レイアウト。
 * サイドバー + トップバー + メインコンテンツ。
 *
 * 使い方:
 *   <Route element={<AdminLayout />}>
 *     <Route path="dashboard" element={<AdminDashboardScreen />} />
 *   </Route>
 */

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import NotificationPopover from '../NotificationPopover/NotificationPopover';
import styles from './AdminLayout.module.css';

/** パス → ページタイトル マッピング */
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'ダッシュボード',
  '/admin/consumers': '消費者一覧',
  '/admin/accounts': '拠点アカウント一覧',
  '/admin/reviews': '審査ステータス',
  '/admin/categories': 'カテゴリ管理',
  '/admin/coupons': 'クーポン管理',
  '/admin/inquiries': 'お問い合わせ',
  '/admin/activity-log': '実行履歴',
  '/admin/settings': 'システム設定',
};

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? '運営管理';

  return (
    <div className={styles.wrapper}>
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* メインエリア */}
      <div className={styles.main}>
        {/* トップバー */}
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="メニューを開く"
          >
            <FiMenu />
          </button>

          <h1 className={styles.pageTitle}>{pageTitle}</h1>

          <div className={styles.topbarRight}>
            <NotificationPopover />
          </div>
        </header>

        {/* ページコンテンツ */}
        <main
          className={styles.content}
          key={location.pathname}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
