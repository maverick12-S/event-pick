// =============================================
//  原則：ロゴはアプリ全体で共通 → components/に置く
// feature依存ゼロ。どこでも使い回せる
// =============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/logo.png'; // 2枚目の画像
import styles from './Logo.module.css';

interface LogoProps {
    className?: string;
}

const Logo:React.FC<LogoProps> = ({ className }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };

    return (
        <div className={`${styles.logoWrapper} ${className ?? ''}`} onClick={handleClick}>
            <img src={logoImage} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>Event Pick</span>
        </div>
    );
};

export default Logo;