import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import styles from '../../LoginForm/screens/LoginScreen.module.css';
import formStyles from '../../LoginForm/LoginForm.module.css';
import '../../../../../../src/styles/pageTransitions.css';

const PasswordChangeScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{password?: string | null; confirm?: string | null}>({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs: {password?: string; confirm?: string} = {};
    if (!password) errs.password = '入力してください';
    if (!confirm) errs.confirm = '入力してください';
    if (password && confirm && password !== confirm) errs.confirm = 'パスワードが一致しません';
    if (password && password.length < 8) errs.password = 'パスワードは8文字以上にしてください';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.values(errs)[0] as string | undefined;
      if (first) setError(first);
      return;
    }

    setLoading(true);
    try {
      // TODO: 実際の API を呼ぶ
      await new Promise((r) => setTimeout(r, 700));
      // 成功時はログイン画面へ（必要ならマイページ等へ変更可）
      navigate('/login', { state: { passwordChanged: true } });
    } catch (err: unknown) {
      console.error(err);
      setError('変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.titleSection}>
        <h1>パスワード変更</h1>
        <p className={styles.subtitle}>新しいパスワードを設定してください</p>
      </div>

      <div className={`${styles.card} page-enter`}>

        <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={formStyles.errorBanner}>{error}</div>}
          <div className={formStyles.fieldGroup}>
            <div className={formStyles.fieldWithToggle}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${formStyles.input} ${fieldErrors.password ? formStyles.inputInvalid : ''}`}
                placeholder="新しいパスワード"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors({...fieldErrors, password: null}); if (error) setError(null); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                className={formStyles.toggleButton}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <div className={formStyles.fieldWithToggle}>
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                className={`${formStyles.input} ${fieldErrors.confirm ? formStyles.inputInvalid : ''}`}
                placeholder="新しいパスワード（確認用）"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); if (fieldErrors.confirm) setFieldErrors({...fieldErrors, confirm: null}); if (error) setError(null); }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                aria-label={showConfirm ? '確認パスワードを非表示' : '確認パスワードを表示'}
                className={formStyles.toggleButton}
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <button className={formStyles.submitButton} type="submit" disabled={loading}>{loading ? '変更中…' : '変更する'}</button>

          <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            パスワードは8文字以上、英数記号を含むことを推奨します。
          </div>

          <div className={formStyles.links}>
            <button type="button" className={formStyles.linkButton} onClick={() => navigate('/login')}>キャンセル</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PasswordChangeScreen;
