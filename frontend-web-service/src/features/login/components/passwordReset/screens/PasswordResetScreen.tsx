/**
 * PasswordResetScreen — MUI リファクタ版
 * パスワードリセット画面。メールアドレス入力 → MFA へ遷移。
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Alert, Link, Stack,
} from '@mui/material';
import MuiAuthLayout from '../../../../../components/ui/MuiAuthLayout/MuiAuthLayout';
import { useFormValidation } from '../../../../../lib/useFormValidation';
import { passwordResetFormSchema } from '../../../../../lib/formSchemas';

const PasswordResetScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const { errors: fieldErrors, validate, clearError } = useFormValidation(passwordResetFormSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = validate({ email });
    if (!result.success) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      navigate('/mfa', { state: { from: 'password-reset', email: result.data.email } });
    } catch {
      setError('パスワードリセットの送信中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiAuthLayout
      title="パスワードリセット画面"
      subtitle="登録済みのメールアドレスを入力してください"
    >
      <Box sx={{ mt: { xs: 2.5, sm: 3.25 } }}>
        <Card elevation={0}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

              <TextField
                id="reset-email"
                label="メールアドレス"
                placeholder="example@company.com"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? '送信中…' : '認証コードを送信'}
              </Button>

              <Stack alignItems="flex-end">
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/login')}
                  underline="hover"
                  sx={{ fontSize: '0.85rem', color: 'text.secondary', cursor: 'pointer' }}
                >
                  ログイン画面へ戻る
                </Link>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </MuiAuthLayout>
  );
};

export default PasswordResetScreen;
