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

const PasswordResetScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setFieldError('メールアドレスを入力してください');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFieldError('有効なメールアドレスを入力してください');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      navigate('/mfa', { state: { from: 'password-reset', email: email.trim() } });
    } catch {
      setError('パスワードリセットの送信中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiAuthLayout
      title="パスワードリセット"
      subtitle="登録済みのメールアドレスを入力してください"
    >
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
              onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
              error={Boolean(fieldError)}
              helperText={fieldError}
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
    </MuiAuthLayout>
  );
};

export default PasswordResetScreen;
