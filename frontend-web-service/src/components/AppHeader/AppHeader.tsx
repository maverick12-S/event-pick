/**
 * AppHeader — ログイン後画面用ヘッダー
 * ─────────────────────────────────────────────
 * 左: ロゴ  中央: 日付/時刻  右: ユーザー名ドロップダウン
 * ドロップダウン: パスワード変更 / ログアウト
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiLock, FiLogOut, FiChevronDown } from 'react-icons/fi';
import Logo from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AppHeader.module.css';

const fmt = {
  date: (d: Date) =>
    d
      .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\//g, '.'),
  time: (d: Date) =>
    d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
};

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* 1分ごとに時刻更新 */
  useEffect(() => {
    const msToNext = (60 - new Date().getSeconds()) * 1000;
    let intervalId: number | null = null;
    const t = window.setTimeout(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => setNow(new Date()), 60_000);
    }, msToNext);
    return () => {
      clearTimeout(t);
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  /* ドロップダウン外クリックで閉じる */
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const handlePasswordChange = () => {
    setOpen(false);
    navigate('/password-change');
  };

  /* ユーザー表示名 */
  const displayName =
    (user as { name?: string; username?: string } | null)?.name ??
    (user as { name?: string; username?: string } | null)?.username ??
    'ユーザー';

  return (
    <header className={styles.header}>
      {/* 左: ロゴ */}
      <div className={styles.left}>
        <Logo className={styles.logo} />
      </div>

      {/* 中央: 日付・時刻 */}
      <div className={styles.center}>
        <span className={styles.dateItem}>
          <FiCalendar className={styles.icon} aria-hidden />
          {fmt.date(now)}
        </span>
        <span className={styles.dateItem}>
          <FiClock className={styles.icon} aria-hidden />
          {fmt.time(now)}
        </span>
      </div>

      {/* 右: ユーザードロップダウン */}
      <div className={styles.right} ref={dropRef}>
        <button
          className={styles.userButton}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className={styles.userAvatar} aria-hidden>
            <FiUser />
          </span>
          {displayName}
          <FiChevronDown
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            aria-hidden
          />
        </button>

        {open && (
          <div className={styles.dropdown} role="menu">
            <button
              className={styles.dropdownItem}
              role="menuitem"
              onClick={handlePasswordChange}
            >
              <FiLock aria-hidden /> パスワード変更
            </button>
            <button
              className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
              role="menuitem"
              onClick={handleLogout}
            >
              <FiLogOut aria-hidden /> ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
