/**
 * AuthLayout
 * CSS Modules ベースの認証画面共通レイアウト。
 * MUI を一切使わず design-tokens.css の変数のみで構成。
 */
import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  wide?: boolean;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, wide = false, children }) => (
  <section className={`${styles.section} ${wide ? styles.wide : ''}`}>
    <div className={styles.titleBlock}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    <div className={styles.cardWrap}>
      {children}
    </div>
    <div className={styles.bottomPad} aria-hidden />
  </section>
);

export default AuthLayout;
