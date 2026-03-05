/**
 * HomeScreen — ホーム画面
 * ─────────────────────────────────────────────
 * ログイン後のランディング画面。
 * 4つの機能ボタン（投稿一覧確認 / 投稿 / レポート / 拠点アカウント管理）を表示。
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiClipboard,
  FiEdit3,
  FiBarChart2,
  FiUsers,
} from 'react-icons/fi';
import styles from './HomeScreen.module.css';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'posts',
    label: '投稿一覧確認',
    icon: <FiClipboard />,
    path: '/posts',
  },
  {
    id: 'post',
    label: '投稿',
    icon: <FiEdit3 />,
    path: '/post/new',
  },
  {
    id: 'report',
    label: 'レポート',
    icon: <FiBarChart2 />,
    path: '/report',
  },
  {
    id: 'accounts',
    label: '拠点アカウント管理',
    icon: <FiUsers />,
    path: '/accounts',
  },
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* タイトル */}
      <div className={styles.titleSection}>
        <h1>ホーム</h1>
        <p className={styles.subtitle}>4つの機能からお選びください</p>
      </div>

      {/* 4ボタングリッド */}
      <div className={styles.grid} role="navigation" aria-label="メインメニュー">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            className={styles.menuButton}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <span className={styles.iconWrapper} aria-hidden>
              {item.icon}
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
