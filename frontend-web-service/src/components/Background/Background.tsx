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
};

const Background: React.FC<Props> = ({ children }) => {
  return (
    <div
      className={styles.pageWrapper}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {children}
    </div>
  );
};

export default Background;
