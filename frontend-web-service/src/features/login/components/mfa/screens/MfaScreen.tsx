/**
 * MfaScreen
 * ─────────────────────────────────────────────
 * 多要素認証画面。
 * 共通UIコンポーネント (AuthPageLayout / FormCard / fieldStyles / Button) を使用。
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthPageLayout, FormCard } from '../../../../../components/ui';
import { fieldStyles } from '../../../../../components/ui/FormField/FormField';
import { Button, LinkButton, LinkGroup } from '../../../../../components/ui/Button/Button';

/* ---- インフォカード用スタイル ---- */
const infoCardStyle: React.CSSProperties = {
  background: 'rgba(10, 20, 50, 0.55)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.9rem',
  lineHeight: '1.6',
  width: '100%',
  maxWidth: '400px',
  boxSizing: 'border-box' as const,
};

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
    <AuthPageLayout title="多要素認証" subtitle="認証コードを入力してください">
      <FormCard>
        <form className={fieldStyles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={fieldStyles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <div className={fieldStyles.fieldGroup}>
            <label className={fieldStyles.label} htmlFor="mfa-code">認証コード</label>
            <input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`${fieldStyles.input} ${fieldError ? fieldStyles.inputInvalid : ''}`}
              placeholder="6桁の認証コード"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (fieldError) setFieldError(null);
                if (error) setError(null);
              }}
              required
            />
            {fieldError && (
              <span className={fieldStyles.fieldError} role="alert">{fieldError}</span>
            )}
          </div>

          <Button type="submit" loading={loading}>
            {loading ? '認証中…' : '認証'}
          </Button>

          <LinkGroup>
            <LinkButton onClick={() => navigate('/login')}>ログイン画面へ戻る</LinkButton>
          </LinkGroup>
        </form>
      </FormCard>

      {/* 説明インフォカード */}
      <div style={infoCardStyle}>
        入力されたメールアドレスへ認証コードが送信されています。
        <br />
        受信した認証コードを入力してください。
      </div>
    </AuthPageLayout>
  );
};

export default MfaScreen;
