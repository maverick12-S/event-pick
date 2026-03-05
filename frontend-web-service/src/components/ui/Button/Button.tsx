/**
 * Button / LinkButton
 * ─────────────────────────────────────────────
 * 全画面共通のボタンコンポーネント群。
 *
 * 使い方:
 *   <Button loading={isLoading}>ログイン</Button>
 *   <Button size="sm">小さいボタン</Button>
 *   <LinkButton onClick={handleClick}>パスワードを忘れた場合</LinkButton>
 *   <LinkGroup>
 *     <LinkButton ...>...</LinkButton>
 *     <LinkButton ...>...</LinkButton>
 *   </LinkGroup>
 */

import React from 'react';
import styles from './Button.module.css';

/* ---- プライマリボタン ---- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'md' | 'sm';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  size = 'md',
  disabled,
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={[
        styles.button,
        size === 'sm' ? styles.buttonSm : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};

/* ---- リンクボタン ---- */
interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      type="button"
      className={[styles.linkButton, className ?? ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
};

/* ---- リンクグループ ---- */
interface LinkGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const LinkGroup: React.FC<LinkGroupProps> = ({ children, className }) => {
  return (
    <div className={[styles.linkGroup, className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};
