/**
 * Background
 * ─────────────────────────────────────────────
 * ページ全体の背景ラッパー。
 * スクロール可能 + 背景はfixed attachmentで固定。
 */

import React from 'react';
import styles from './Background.module.css';
import bg from '../../assets/images/login-bg.png';

type Props = {
  children?: React.ReactNode;
  isAuthenticated?: boolean;
};

const Background: React.FC<Props> = ({ children, isAuthenticated = false }) => {
  return (
    <div
      className={styles.pageWrapper}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* ログイン成功後にぬるりとdarkネイビーに変化するオーバーレイ */}
      <div 
        className={styles.overlay} 
        style={{ 
          opacity: isAuthenticated ? 1 : 0,
          backgroundPosition: isAuthenticated ? '100% 100%' : '0% 0%'
        }}
      />
      {children}
    </div>
  );
};

export default Background;
