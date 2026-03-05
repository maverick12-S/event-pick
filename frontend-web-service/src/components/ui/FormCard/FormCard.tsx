/**
 * FormCard
 * ─────────────────────────────────────────────
 * フロストガラス風のフォームカードコンポーネント。
 * 全ログイン系画面で共通使用。
 *
 * 使い方:
 *   <FormCard>
 *     <form>...</form>
 *   </FormCard>
 *
 *   <FormCard wide>  ← Signup等のワイドカード
 *     <form>...</form>
 *   </FormCard>
 */

import React from 'react';
import styles from './FormCard.module.css';

interface FormCardProps {
  /** ワイドカード (Signup 等) */
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ wide = false, className, children }) => {
  return (
    <div
      className={[
        styles.card,
        wide ? styles.wide : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default FormCard;
