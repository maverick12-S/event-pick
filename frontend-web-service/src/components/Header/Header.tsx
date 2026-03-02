import React from 'react';
import Logo from '../Logo';
import styles from './Header.module.css';
import { FiCalendar, FiClock } from 'react-icons/fi';

const Header: React.FC = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\//g, '.');
  const timeStr = now.toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
      </div>
      <div className={styles.right}>
        <div className={styles.datePanel}>
          <span className={styles.date}><FiCalendar className={styles.icon} /> {dateStr}</span>
          <span className={styles.time}><FiClock className={styles.icon} /> {timeStr}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
