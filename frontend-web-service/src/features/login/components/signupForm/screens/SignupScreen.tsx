import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../../LoginForm/screens/LoginScreen.module.css'; // タイトル／カード位置を再利用
import formStyles from '../../LoginForm/LoginForm.module.css'; // 入力・ボタンの共通スタイルを再利用
import './SignupScreen.css';
import '../../../../../../src/styles/pageTransitions.css';

const SignupScreen: React.FC = () => {
  const [corporateCode, setCorporateCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [address, setAddress] = useState('');
  const location = useLocation();
  const initialState = (location.state || {}) as { mfaPassed?: boolean; signupData?: { notifyEmail?: string } };
  const [notifyEmail, setNotifyEmail] = useState(initialState.signupData?.notifyEmail ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitted = Boolean(initialState.mfaPassed);
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const handleCancel = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate('/login'), 240);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!corporateCode || !companyName || !representative || !notifyEmail) {
      setError('必須項目を入力してください');
      return;
    }
    // navigate to MFA screen and pass signup data; on MFA success it will return here with mfaPassed
    setLoading(true);
    const signupData = { corporateCode, companyName, representative, address, notifyEmail };
    navigate('/mfa', { state: { from: 'signup', signupData } });
  };

  return (
    <>
      {!submitted && (
        <div className={styles.titleSection}>
          <h1>初回会員登録</h1>
          <p className={styles.subtitle}>企業情報を入力してください</p>
        </div>
      )}

      <div className={`${styles.card} signup-card page-enter ${exiting ? 'page-exit' : ''}`}>
        {!submitted ? (
          <form className={formStyles.form} onSubmit={handleSubmit} encType="multipart/form-data">
            {error && <div className={formStyles.errorBanner} role="alert">{error}</div>}
            <div className="signup-grid" style={{ width: '100%' }}>
            <div className="signup-full">
              <label className={formStyles.label}>法人コード</label>
              <input
                className={formStyles.input}
                value={corporateCode}
                onChange={(e) => setCorporateCode(e.target.value)}
                placeholder="法人コード"
                required
              />
            </div>

            {/* 左列 */}
            <div>
              <label className={formStyles.label}>会社名</label>
              <input
                className={formStyles.input}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="会社名"
                required
              />

              <label className={formStyles.label}>代表者名</label>
              <input
                className={formStyles.input}
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder="代表者名"
                required
              />
            </div>

            {/* 右列 */}
            <div>
              <label className={formStyles.label}>会社住所</label>
              <input
                className={formStyles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="会社住所"
              />

              <label className={formStyles.label}>審査結果通知用メールアドレス</label>
              <input
                className={formStyles.input}
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="審査結果通知用メールアドレス"
                type="email"
                required
              />
            </div>

            {/* 登記簿アップロード（幅いっぱい） */}
            <div className="signup-file-wrapper">
              <label className={formStyles.label}>登記簿（画像またはPDF）</label>
              <input className="signup-file" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              {file && <div className="signup-filename" style={{ fontSize: 12 }}>{file.name}</div>}
            </div>

            {/* アクション（幅いっぱい） */}
            <div className="signup-actions">
              <button className={formStyles.submitButton + ' signup-submit'} type="submit" disabled={loading}>{loading ? '送信中…' : '登録する'}</button>
              <button className={formStyles.linkButton + ' signup-cancel'} type="button" onClick={handleCancel} disabled={exiting}>ログイン画面へ戻る</button>
            </div>
          </div>
        </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '28px 8px' }}>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>審査を受け付けました</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 14 }}>登録情報を受け付けました。<br/>2〜4営業日以内に、登録されたメールアドレスへ審査結果をお送りします。<br/><br/>送信先:（{notifyEmail || 'ご登録のメールアドレス'}）</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className={formStyles.submitButton} onClick={() => navigate('/login')}>ログイン画面へ</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignupScreen;