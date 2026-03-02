import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <span className={styles.lock} aria-hidden>🔒</span>
      <span className={styles.company}>Solvevia.</span>
      <nav className={styles.footerLinks} aria-label="フッターナビ">
        <a href="/terms">利用規約</a>
        <a href="/security">セキュリティ情報</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
