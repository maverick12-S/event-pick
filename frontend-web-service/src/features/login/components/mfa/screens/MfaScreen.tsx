import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../LoginForm/screens/LoginScreen.module.css';
import formStyles from '../../LoginForm/LoginForm.module.css';
import '../../../../../../src/styles/pageTransitions.css';
import './MfaScreen.css';

const MfaScreen: React.FC = () => {
  const location = useLocation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code) {
      setFieldError('認証コードを入力してください');
      return setError('認証コードを入力してください');
    }
    setLoading(true);
    try {
      // TODO: 実際の認証 API を呼ぶ
      await new Promise((r) => setTimeout(r, 600));
      // 成功時の遷移先は遷移元によって変える
        const src = (location.state || {}) as { from?: string; email?: string; signupData?: unknown };
        const from = src.from;
        if (from === 'signup') {
          navigate('/signup', { state: { mfaPassed: true, signupData: src.signupData } });
        } else if (from === 'password-reset') {
          navigate('/password-change', { state: { mfaPassed: true, email: src.email } });
        } else {
          navigate('/login', { state: { mfaPassed: true } });
        }
    } catch (err: unknown) {
      console.error(err);
      setError('認証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.titleSection}>
        <h1>多要素認証</h1>
        <p className={styles.subtitle}>認証コードを入力してください</p>
      </div>

      <div className={`${styles.card} page-enter`}>

        {/* 説明カードは下に移動 */}

        <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={formStyles.errorBanner}>{error}</div>}
          <div className={formStyles.fieldGroup}>
            <input
              type="text"
              className={`${formStyles.input} ${fieldError ? formStyles.inputInvalid : ''}`}
              placeholder="認証コード"
              value={code}
              onChange={(e) => { setCode(e.target.value); if (fieldError) setFieldError(null); }}
              required
            />
          </div>

          <button className={formStyles.submitButton} type="submit" disabled={loading}>{loading ? '認証中…' : '認証'}</button>
          <div className={formStyles.links}>
            <button type="button" className={formStyles.linkButton} onClick={() => navigate('/login')}>ログイン画面へ戻る</button>
          </div>
        </form>
      </div>

      {/* 説明カードをカードの外側、下に表示（幅を入力欄と揃える） */}
      <div>
        <div className="mfa-info-card">
          入力されたメールアドレスへ認証コードが送信されています。<br />受信した認証コードを入力してください。
        </div>
      </div>
    </>
  );
};

export default MfaScreen;
