/**
 * Header
 * ─────────────────────────────────────────────
 * スティッキーヘッダー。スクロールに追従しながらもページフロー内に留まる。
 * 日付はマウント時に取得し、時刻は1分ごとに更新。
 */

import React, { useState, useEffect } from 'react';
import Logo from '../Logo';
import styles from './Header.module.css';
import { FiCalendar, FiClock } from 'react-icons/fi';

const formatDate = (d: Date) =>
  d
    .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '.');

const formatTime = (d: Date) =>
  d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

const Header: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

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

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
      </div>
      <div className={styles.right}>
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
      </div>
    </header>
  );
};

export default Header;
