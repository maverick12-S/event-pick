/**
 * PasswordResetScreen
 * ─────────────────────────────────────────────
 * パスワードリセット画面。
 * 登録メールアドレスを入力して MFA 画面へ遷移。
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPageLayout, FormCard } from '../../../../../components/ui';
import { fieldStyles } from '../../../../../components/ui/FormField/FormField';
import { Button, LinkButton, LinkGroup } from '../../../../../components/ui/Button/Button';

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
      navigate('/mfa', { state: { from: 'password-reset', email } });
    } catch (err: unknown) {
      console.error(err);
      setError('送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="パスワードをリセット"
      subtitle="登録メールアドレスを入力してください"
    >
      <FormCard>
        <form className={fieldStyles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={fieldStyles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <div className={fieldStyles.fieldGroup}>
            <label className={fieldStyles.label} htmlFor="reset-email">メールアドレス</label>
            <input
              id="reset-email"
              type="email"
              className={fieldStyles.input}
              placeholder="登録済みメールアドレス"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              autoComplete="email"
              required
            />
          </div>

          <Button type="submit" loading={loading}>
            {loading ? '送信中…' : '送信'}
          </Button>

          <LinkGroup>
            <LinkButton onClick={() => navigate('/login')}>ログイン画面へ戻る</LinkButton>
          </LinkGroup>
        </form>
      </FormCard>
    </AuthPageLayout>
  );
};

export default PasswordResetScreen;
