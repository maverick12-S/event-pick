/**
 * Background
 * ─────────────────────────────────────────────
 * ページ全体の背景ラッパー。
 * スクロール可能 + 背景はfixed attachmentで固定。
 */

import React from 'react';
import { useEffect, useState } from 'react';
import styles from './Background.module.css';
import bg from '../../assets/images/login-bg.png';

type Props = {
  children?: React.ReactNode;
  isAuthenticated?: boolean;
  transitionKey?: string;
  disableMotion?: boolean;
};

const Background: React.FC<Props> = ({
  children,
  isAuthenticated = false,
  transitionKey,
  disableMotion = false,
}) => {
  const [isZoomIn, setIsZoomIn] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    if (disableMotion) {
      setIsZoomIn(true);
      return;
    }

    setIsZoomIn(false);
    const rafId = window.requestAnimationFrame(() => setIsZoomIn(true));
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [transitionKey, disableMotion]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsOverlayVisible(false);
      return;
    }

    setIsOverlayVisible(false);
    const rafId = window.requestAnimationFrame(() => setIsOverlayVisible(true));
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isAuthenticated]);

  return (
    <div
      className={styles.pageWrapper}
      data-motion={disableMotion ? 'off' : 'on'}
    >
      <div
        key={transitionKey}
        className={`${styles.bgImageLayer} ${isZoomIn ? styles.bgImageLayerEnter : ''}`}
        style={{ backgroundImage: `url(${bg})` }}
      />
      {/* ログイン成功後にぬるりとdarkネイビーに変化するオーバーレイ */}
      <div 
        className={`${styles.overlay} ${isOverlayVisible ? styles.overlayVisible : ''}`}
      />
      {children}
    </div>
  );
};

export default Background;
