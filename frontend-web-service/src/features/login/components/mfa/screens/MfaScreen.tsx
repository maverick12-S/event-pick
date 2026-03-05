/**
 * MfaScreen — MUI リファクタ版
 * 多要素認証画面。MUI Card / TextField / Button を使用。
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Alert, Typography, Link, Stack,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MuiAuthLayout from '../../../../../components/ui/MuiAuthLayout/MuiAuthLayout';

const MfaScreen: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setFieldError('認証コードを入力してください');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const src = (location.state || {}) as { from?: string; email?: string; signupData?: unknown };
      if (src.from === 'signup') {
        navigate('/signup', { state: { mfaPassed: true, signupData: src.signupData } });
      } else if (src.from === 'password-reset') {
        navigate('/password-change', { state: { mfaPassed: true, email: src.email } });
      } else {
        navigate('/login', { state: { mfaPassed: true } });
      }
    } catch {
      setError('認証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiAuthLayout title="多要素認証" subtitle="認証コードを入力してください">
      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 4.5, sm: 5.5 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3.25 }}
          >
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <TextField
              id="mfa-code"
              label="認証コード"
              placeholder="6桁の認証コード"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setFieldError('');
                setError(null);
              }}
              inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: 6 }}
              error={Boolean(fieldError)}
              helperText={fieldError}
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
              {loading ? '認証中…' : '認証'}
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

      {/* 説明インフォカード */}
      <Card
        elevation={0}
        sx={{
          background: 'rgba(10,20,50,0.55)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          mt: 1,
        }}
      >
        <CardContent sx={{ py: '12px !important', px: 2 }}>
          <Stack direction="row" gap={1} alignItems="flex-start">
            <InfoOutlinedIcon sx={{ fontSize: '1rem', mt: 0.3, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              入力されたメールアドレスへ認証コードが送信されています。
              受信した認証コードを入力してください。
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </MuiAuthLayout>
  );
};

export default MfaScreen;
