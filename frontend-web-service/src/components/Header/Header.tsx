/**
 * Header
 * ─────────────────────────────────────────────
 * スティッキーヘッダー。公開画面では右寄せの日時表示、認証後画面では
 * 中央の日時表示と右端のユーザーメニューを切り替える。
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { LuTicket } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCompanyTicket } from '../../features/home/hooks/useCompanyTicket';
import Logo from '../Logo';
import styles from './Header.module.css';

interface HeaderProps {
  isAuthenticatedView?: boolean;
}

const formatDate = (d: Date) =>
  d
    .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '.');

const formatTime = (d: Date) =>
  d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

const Header: React.FC<HeaderProps> = ({ isAuthenticatedView = false }) => {
  const [now, setNow] = useState(() => new Date());
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const ticketQuery = useCompanyTicket(isAuthenticatedView);

  const displayName = useMemo(() => {
    const preferredName = user?.displayName?.trim();
    const username = user?.username?.trim();
    return preferredName || username || '田中太郎';
  }, [user?.displayName, user?.username]);

  /* 1分ごとに時刻更新 */
  useEffect(() => {
    const tick = () => setNow(new Date());
    // 次の分の頭まで待ってから1分インターバル開始
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000;
    let intervalId: number | null = null;
    const firstTimeout = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 60_000);
    }, msToNextMinute);
    return () => {
      clearTimeout(firstTimeout);
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const isMenuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuNavigate = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login', { replace: true });
  };

  const dateTimePanel = (
    <div className={styles.datePanel}>
      <span className={styles.date}>
        <FiCalendar className={styles.icon} aria-hidden />
        {formatDate(now)}
      </span>
      <span className={styles.time}>
        <FiClock className={styles.icon} aria-hidden />
        {formatTime(now)}
      </span>
    </div>
  );

  return (
    <header className={`${styles.header} ${isAuthenticatedView ? styles.headerAuthenticated : styles.headerPublic}`}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
      </div>
      {!isAuthenticatedView ? (
        <div className={styles.right}>
          <div className={styles.rightDatePanel}>{dateTimePanel}</div>
        </div>
      ) : (
        <>
          {ticketQuery.data && (
            <div className={styles.ticketBlock}>
              <div className={styles.ticketRow}>
                <LuTicket className={`${styles.ticketIcon} ${styles.ticketIconDaily}`} aria-hidden />
                <span className={styles.ticketLabel}>Day</span>
                <span className={styles.ticketNums}>
                  <span className={styles.ticketValue}>{ticketQuery.data.daily_remaining}</span>
                </span>
              </div>
              <div className={styles.ticketDivider} />
              <div className={styles.ticketRow}>
                <LuTicket className={`${styles.ticketIcon} ${styles.ticketIconMonthly}`} aria-hidden />
                <span className={styles.ticketLabel}>Month</span>
                <span className={styles.ticketNums}>
                  <span className={styles.ticketValue}>{ticketQuery.data.monthly_remaining}</span>
                </span>
              </div>
            </div>
          )}
          <div className={styles.authDatePanel}>{dateTimePanel}</div>
          <div className={styles.authUserBlock}>
            <span className={styles.separator} aria-hidden />
            <div className={styles.userInfoBlock}>
              <button
                type="button"
                className={styles.userButton}
                onClick={handleMenuOpen}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-controls={isMenuOpen ? 'header-user-menu' : undefined}
              >
                <span className={styles.avatar} aria-hidden>
                  <FiUser />
                </span>
                <span className={styles.userName}>{displayName}</span>
                <FiChevronDown className={`${styles.dropdownIcon} ${isMenuOpen ? styles.dropdownIconOpen : ''}`} aria-hidden />
              </button>
              <Menu
                id="header-user-menu"
                anchorEl={menuAnchor}
                open={isMenuOpen}
                onClose={handleMenuClose}
                disableScrollLock
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    className: styles.menuPaper,
                  },
                }}
              >
                <MenuItem onClick={() => handleMenuNavigate('/settings/account')} className={styles.menuItem}>
                  <ListItemIcon className={styles.menuIcon}><FiSettings /></ListItemIcon>
                  <ListItemText primary="アカウント情報の変更" />
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigate('/settings/notifications')} className={styles.menuItem}>
                  <ListItemIcon className={styles.menuIcon}><FiBell /></ListItemIcon>
                  <ListItemText primary="通知設定" />
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigate('/settings/billing')} className={styles.menuItem}>
                  <ListItemIcon className={styles.menuIcon}><FiCreditCard /></ListItemIcon>
                  <ListItemText primary="請求管理" />
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigate('/settings/history')} className={styles.menuItem}>
                  <ListItemIcon className={styles.menuIcon}><FiFileText /></ListItemIcon>
                  <ListItemText primary="実行履歴" />
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigate('/settings/contact')} className={styles.menuItem}>
                  <ListItemIcon className={styles.menuIcon}><FiHelpCircle /></ListItemIcon>
                  <ListItemText primary="お問い合わせ" />
                </MenuItem>
                <MenuItem onClick={handleLogout} className={`${styles.menuItem} ${styles.menuItemDanger}`}>
                  <ListItemIcon className={styles.menuIcon}><FiLogOut /></ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </MenuItem>
              </Menu>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
