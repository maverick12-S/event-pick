/**
 * AuthPageLayout
 * ─────────────────────────────────────────────
 * ログイン系画面のページ構造を提供するコンポーネント。
 * Header・Footer は BaseLayout が担当するので、
 * ここではコンテンツ領域（タイトル + スロット）だけを管理する。
 *
 * 使い方:
 *   <AuthPageLayout title="企業ログイン" subtitle="拠点アカウントでログインしてください">
 *     <MyFormCard />
 *   </AuthPageLayout>
 */

import React from 'react';
import styles from './AuthPageLayout.module.css';

interface AuthPageLayoutProps {
  /** ページタイトル (h1) */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** タイトル幅を広くする (Signup 等ワイドカード用) */
  wide?: boolean;
  children: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  wide = false,
  children,
}) => {
  return (
    <div className={styles.contentArea}>
      {/* タイトルセクション */}
      <div className={`${styles.titleSection} ${wide ? styles.wide : ''}`}>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* フォームカード等を受け取るスロット */}
      {children}

      {/* スクロール時の下余白 */}
      <div className={styles.bottomPad} aria-hidden="true" />
    </div>
  );
};

export default AuthPageLayout;
