/**
 * AdminSidebar
 * ─────────────────────────────────────────────
 * 運営管理画面のサイドバーナビゲーション。
 * - react-icons/fi を使用（既存コードと同一依存）
 * - react-router-dom の NavLink でアクティブ状態管理
 *
 * 使い方:
 *   <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiTag,
  FiClock,
  FiSettings,
  FiLogOut,
  FiUser,
  FiLayers,
  FiGift,
  FiCheckSquare,
} from 'react-icons/fi';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './AdminSidebar.module.css';

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: { section: string; items: NavItemDef[] }[] = [
  {
    section: 'メイン',
    items: [
      { label: 'ダッシュボード', path: '/admin/dashboard', icon: <FiGrid /> },
    ],
  },
  {
    section: 'アカウント管理',
    items: [
      { label: '消費者一覧', path: '/admin/consumers', icon: <FiUser /> },
      { label: '拠点アカウント一覧', path: '/admin/accounts', icon: <FiLayers /> },
    ],
  },
  {
    section: '審査',
    items: [
      { label: '審査ステータス', path: '/admin/reviews', icon: <FiCheckSquare /> },
    ],
  },
  {
    section: 'コンテンツ',
    items: [
      { label: 'カテゴリ管理', path: '/admin/categories', icon: <FiTag /> },
      { label: 'クーポン管理', path: '/admin/coupons', icon: <FiGift /> },
    ],
  },
  {
    section: 'サポート',
    items: [
      { label: 'お問い合わせ', path: '/admin/inquiries', icon: <FiMessageSquare /> },
    ],
  },
  {
    section: 'ログ・設定',
    items: [
      { label: '実行履歴', path: '/admin/activity-log', icon: <FiClock /> },
      { label: 'システム設定', path: '/admin/settings', icon: <FiSettings /> },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.displayName?.trim() || user?.username?.trim() || 'Operator';

  return (
    <>
      {/* モバイル時オーバーレイ */}
      {isOpen && onClose && (
        <div
          className={styles.mobileOverlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* ロゴ */}
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <FiCheckSquare />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>EventPick</span>
            <span className={styles.logoSubtitle}>Admin Console</span>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className={styles.nav} aria-label="管理メニュー">
          {NAV_ITEMS.map(({ section, items }) => (
            <React.Fragment key={section}>
              <span className={styles.navSection}>{section}</span>
              {items.map(({ label, path, icon, badge }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                  }
                  onClick={onClose}
                >
                  <span className={styles.navItemIcon}>{icon}</span>
                  <span className={styles.navItemLabel}>{label}</span>
                  {badge != null && (
                    <span className={styles.navItemBadge}>{badge}</span>
                  )}
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* ボトムユーザーエリア */}
        <div className={styles.bottomArea}>
          <div className={styles.userBlock}>
            <div className={styles.userAvatar}>
              <FiUser />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{displayName}</div>
              <div className={styles.userRole}>OPERATOR</div>
            </div>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
