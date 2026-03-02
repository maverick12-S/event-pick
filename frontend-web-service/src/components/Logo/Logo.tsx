// =============================================
//  原則：ロゴはアプリ全体で共通 → components/に置く
// feature依存ゼロ。どこでも使い回せる
// =============================================
import React from 'react';
import logoImage from '../../assets/images/logo.png'; // 2枚目の画像
import styles from './Logo.module.css';

interface LogoProps {
    className?: string;
}

const Logo:React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`${styles.logoWrapper} ${className ?? ''}`}>
            <img src={logoImage} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>EventPick</span>
        </div>
    );
};

export default Logo;