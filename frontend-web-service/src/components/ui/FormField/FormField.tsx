/**
 * FormField
 * ─────────────────────────────────────────────
 * ラベル + input + エラーメッセージをセットで提供する
 * フォームフィールドコンポーネント。
 *
 * 使い方:
 *   <FormField label="ユーザー名" error={fieldErrors.username}>
 *     <input ... className={fieldStyles.input} />
 *   </FormField>
 */

import React from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label?: string;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children, className }) => {
  return (
    <div className={`${styles.fieldGroup}${className ? ` ${className}` : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <span className={styles.fieldError} role="alert">{error}</span>}
    </div>
  );
};

export default FormField;
export { styles as fieldStyles };
