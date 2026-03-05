// =============================================
// LoginForm
// =============================================
// 原則：コンポーネントは「見た目の定義」のみ
// ロジック（validation, API call）はhookに任せる
// propsで動作を注入 → テストしやすい
// =============================================

import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import type { LoginRequest } from '../../../../types/auth';
import { fieldStyles } from '../../../../components/ui/FormField/FormField';
import { Button, LinkButton, LinkGroup } from '../../../../components/ui/Button/Button';

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: LoginRequest) => void;
  onPasswordReset: () => void;
  onNewAccount: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  error,
  onSubmit,
  onPasswordReset,
  onNewAccount,
}) => {
  const [realm, setRealm] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string | null }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [k: string]: string | null } = {};
    if (!realm) errs.realm = '入力してください';
    if (!username) errs.username = '入力してください';
    if (!password) errs.password = '入力してください';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ realm, username, password });
  };

  return (
    <form className={fieldStyles.form} onSubmit={handleSubmit} noValidate>
      {/* エラーバナー */}
      {error && (
        <div className={fieldStyles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {/* 拠点レルム */}
      <div className={fieldStyles.fieldGroup}>
        <label className={fieldStyles.label} htmlFor="realm">拠点レルム</label>
        <input
          id="realm"
          type="text"
          className={`${fieldStyles.input} ${fieldErrors.realm ? fieldStyles.inputInvalid : ''}`}
          placeholder="拠点レルムを入力"
          value={realm}
          onChange={(e) => {
            setRealm(e.target.value);
            if (fieldErrors.realm) setFieldErrors({ ...fieldErrors, realm: null });
          }}
          autoComplete="off"
          required
        />
        {fieldErrors.realm && (
          <span className={fieldStyles.fieldError} role="alert">{fieldErrors.realm}</span>
        )}
      </div>

      {/* ユーザー名 */}
      <div className={fieldStyles.fieldGroup}>
        <label className={fieldStyles.label} htmlFor="username">ユーザー名</label>
        <input
          id="username"
          type="text"
          className={`${fieldStyles.input} ${fieldErrors.username ? fieldStyles.inputInvalid : ''}`}
          placeholder="拠点アカウントID"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: null });
          }}
          autoComplete="username"
          required
        />
        {fieldErrors.username && (
          <span className={fieldStyles.fieldError} role="alert">{fieldErrors.username}</span>
        )}
      </div>

      {/* パスワード */}
      <div className={fieldStyles.fieldGroup}>
        <label className={fieldStyles.label} htmlFor="password">パスワード</label>
        <div className={fieldStyles.fieldWithToggle}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`${fieldStyles.input} ${fieldErrors.password ? fieldStyles.inputInvalid : ''}`}
            placeholder="パスワード"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
            }}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
            className={fieldStyles.toggleButton}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {fieldErrors.password && (
          <span className={fieldStyles.fieldError} role="alert">{fieldErrors.password}</span>
        )}
      </div>

      {/* ログインボタン */}
      <Button type="submit" loading={isLoading}>
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>

      {/* リンク群 */}
      <LinkGroup>
        <LinkButton onClick={onPasswordReset}>パスワード回復をする</LinkButton>
        <LinkButton onClick={onNewAccount}>パスワードログアウト</LinkButton>
      </LinkGroup>
    </form>
  );
};

export default LoginForm;
