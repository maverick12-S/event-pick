import React from 'react';
import styles from '../../features/login/components/LoginForm/screens/LoginScreen.module.css';
import bg from '../../assets/images/login-bg.png';

type Props = {
  children?: React.ReactNode;
};

const Background: React.FC<Props> = ({ children }) => {
  // CSS の .pageWrapper は残しつつ、バンドラ経由で解決される画像 URL を
  // inline style で上書きして確実に表示させます。
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
