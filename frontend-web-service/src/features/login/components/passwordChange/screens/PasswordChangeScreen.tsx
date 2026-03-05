/**
 * PasswordChangeScreen
 * ─────────────────────────────────────────────
 * パスワード変更画面。
 * 新しいパスワードを設定してログイン画面へ遷移。
 */

import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { AuthPageLayout, FormCard } from '../../../../../components/ui';
import { fieldStyles } from '../../../../../components/ui/FormField/FormField';
import { Button, LinkButton, LinkGroup } from '../../../../../components/ui/Button/Button';

const PasswordChangeScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string | null; confirm?: string | null }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs: { password?: string; confirm?: string } = {};
    if (!password) errs.password = '入力してください';
    if (!confirm) errs.confirm = '入力してください';
    if (password && confirm && password !== confirm) errs.confirm = 'パスワードが一致しません';
    if (password && password.length < 8) errs.password = 'パスワードは8文字以上にしてください';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.values(errs)[0];
      if (first) setError(first);
      return;
    }
    setLoading(true);
    try {
      // TODO: 実際の API を呼ぶ
      await new Promise((r) => setTimeout(r, 700));
      navigate('/login', { state: { passwordChanged: true } });
    } catch (err: unknown) {
      console.error(err);
      setError('変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="パスワード変更"
      subtitle="新しいパスワードを設定してください"
    >
      <FormCard>
        <form className={fieldStyles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={fieldStyles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {/* 新しいパスワード */}
          <div className={fieldStyles.fieldGroup}>
            <label className={fieldStyles.label} htmlFor="new-password">新しいパスワード</label>
            <div className={fieldStyles.fieldWithToggle}>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                className={`${fieldStyles.input} ${fieldErrors.password ? fieldStyles.inputInvalid : ''}`}
                placeholder="新しいパスワード（8文字以上）"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                  if (error) setError(null);
                }}
                autoComplete="new-password"
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

          {/* 確認用パスワード */}
          <div className={fieldStyles.fieldGroup}>
            <label className={fieldStyles.label} htmlFor="confirm-password">新しいパスワード（確認用）</label>
            <div className={fieldStyles.fieldWithToggle}>
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                className={`${fieldStyles.input} ${fieldErrors.confirm ? fieldStyles.inputInvalid : ''}`}
                placeholder="パスワードを再入力"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (fieldErrors.confirm) setFieldErrors({ ...fieldErrors, confirm: null });
                  if (error) setError(null);
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                aria-label={showConfirm ? '確認パスワードを非表示' : '確認パスワードを表示'}
                className={fieldStyles.toggleButton}
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {fieldErrors.confirm && (
              <span className={fieldStyles.fieldError} role="alert">{fieldErrors.confirm}</span>
            )}
          </div>

          {/* ヒントテキスト */}
          <p style={{
            margin: 0,
            fontSize: 'var(--font-size-xs)',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
          }}>
            パスワードは8文字以上、英数記号を含むことを推奨します
          </p>

          <Button type="submit" loading={loading}>
            {loading ? '変更中…' : '変更する'}
          </Button>

          <LinkGroup>
            <LinkButton onClick={() => navigate('/login')}>キャンセル</LinkButton>
          </LinkGroup>
        </form>
      </FormCard>
    </AuthPageLayout>
  );
};

export default PasswordChangeScreen;
