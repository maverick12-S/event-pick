import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../LoginForm/screens/LoginScreen.module.css';
import formStyles from '../../LoginForm/LoginForm.module.css';
import '../../../../../../src/styles/pageTransitions.css';

const PasswordResetScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) return setError('メールアドレスを入力してください');
    setLoading(true);
    try {
      // TODO: 実際の API を呼ぶ
      await new Promise((r) => setTimeout(r, 600));
      // 成功時は多要素認証画面へ遷移（実運用ではトークン等を渡す場合があります）
      navigate('/mfa', { state: { from: 'password-reset', email } });
    } catch (err: unknown) {
      console.error(err);
      setError('送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.titleSection}>
        <h1>パスワードをリセット</h1>
        <p className={styles.subtitle}>登録メールアドレスを入力してください</p>
      </div>

      <div className={`${styles.card} page-enter`}>
        <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={formStyles.errorBanner}>{error}</div>}
          <div className={formStyles.fieldGroup}>
            <input
              type="email"
              className={formStyles.input}
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className={formStyles.submitButton} type="submit" disabled={loading}>{loading ? '送信中…' : '送信'}</button>
          <div className={formStyles.links}>
            <button type="button" className={formStyles.linkButton} onClick={() => navigate('/login')}>ログイン画面へ戻る</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PasswordResetScreen;
