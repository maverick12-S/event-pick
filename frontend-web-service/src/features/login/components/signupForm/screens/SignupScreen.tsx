/**
 * SignupScreen
 * ─────────────────────────────────────────────
 * 初回会員登録画面。
 * 企業情報の入力 → MFA 認証 → 審査受け付け完了。
 * ワイドカード (max-width: 780px) を使用。
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthPageLayout, FormCard } from '../../../../../components/ui';
import { fieldStyles } from '../../../../../components/ui/FormField/FormField';
import { Button, LinkButton, LinkGroup } from '../../../../../components/ui/Button/Button';
import styles from './SignupScreen.module.css';

const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = (location.state || {}) as {
    mfaPassed?: boolean;
    signupData?: { notifyEmail?: string };
  };

  const [corporateCode, setCorporateCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [address, setAddress] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(initialState.signupData?.notifyEmail ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitted = Boolean(initialState.mfaPassed);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!corporateCode || !companyName || !representative || !notifyEmail) {
      setError('必須項目を入力してください');
      return;
    }
    setLoading(true);
    const signupData = { corporateCode, companyName, representative, address, notifyEmail };
    navigate('/mfa', { state: { from: 'signup', signupData } });
  };

  /* ---- 審査受け付け完了画面 ---- */
  if (submitted) {
    return (
      <AuthPageLayout title="初回会員登録完了" wide>
        <FormCard wide className={styles.signupCardBoost}>
          <div className={styles.completedWrapper}>
            <h2 className={styles.completedTitle}>審査を受け付けました</h2>
            <p className={styles.completedBody}>
              登録情報を受け付けました。
              <br />
              2〜4営業日以内に、登録されたメールアドレスへ審査結果をお送りします。
              <br />
              <br />
              送信先:&nbsp;
              <span className={styles.completedEmail}>
                {notifyEmail || 'ご登録のメールアドレス'}
              </span>
            </p>
            <Button onClick={() => navigate('/login')} style={{ maxWidth: 240, margin: '0 auto' }}>
              ログイン画面へ
            </Button>
          </div>
        </FormCard>
      </AuthPageLayout>
    );
  }

  /* ---- 入力フォーム ---- */
  return (
    <AuthPageLayout
      title="初回会員登録"
      subtitle="企業情報を入力してください"
      wide
    >
      <FormCard wide className={styles.signupCardBoost}>
        <form className={fieldStyles.form} onSubmit={handleSubmit} encType="multipart/form-data">
          {error && (
            <div className={fieldStyles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {/* ---- 2カラムグリッド ---- */}
          <div className={styles.grid}>
            {/* 法人コード (全幅) */}
            <div className={styles.fullWidth}>
              <label className={fieldStyles.label} htmlFor="corporate-code">
                法人コード <span className={styles.required}>*</span>
              </label>
              <input
                id="corporate-code"
                className={fieldStyles.input}
                value={corporateCode}
                onChange={(e) => setCorporateCode(e.target.value)}
                placeholder="法人コード"
                required
              />
            </div>

            {/* 会社名 */}
            <div>
              <label className={fieldStyles.label} htmlFor="company-name">
                会社名 <span className={styles.required}>*</span>
              </label>
              <input
                id="company-name"
                className={fieldStyles.input}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="会社名"
                required
              />
            </div>

            {/* 会社住所 */}
            <div>
              <label className={fieldStyles.label} htmlFor="address">会社住所</label>
              <input
                id="address"
                className={fieldStyles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="会社住所"
              />
            </div>

            {/* 代表者名 */}
            <div>
              <label className={fieldStyles.label} htmlFor="representative">
                代表者名 <span className={styles.required}>*</span>
              </label>
              <input
                id="representative"
                className={fieldStyles.input}
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder="代表者名"
                required
              />
            </div>

            {/* 審査結果通知用メールアドレス */}
            <div>
              <label className={fieldStyles.label} htmlFor="notify-email">
                審査結果通知用メールアドレス <span className={styles.required}>*</span>
              </label>
              <input
                id="notify-email"
                type="email"
                className={fieldStyles.input}
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="メールアドレス"
                required
              />
            </div>

            {/* 登記簿アップロード (全幅) */}
            <div className={styles.fullWidth}>
              <label className={fieldStyles.label} htmlFor="registry-file">
                登記簿（画像またはPDF）
              </label>
              <input
                id="registry-file"
                type="file"
                accept="image/*,application/pdf"
                className={fieldStyles.fileInput}
                onChange={handleFileChange}
              />
              {file && (
                <p className={fieldStyles.fileName}>{file.name}</p>
              )}
            </div>

            {/* アクション (全幅) */}
            <div className={styles.actions}>
              <Button type="submit" loading={loading}>
                {loading ? '送信中…' : '登録する'}
              </Button>
              <LinkGroup>
                <LinkButton onClick={() => navigate('/login')}>ログイン画面へ戻る</LinkButton>
              </LinkGroup>
            </div>
          </div>
        </form>
      </FormCard>
    </AuthPageLayout>
  );
};

export default SignupScreen;
