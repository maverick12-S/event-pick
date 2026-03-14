/**
 * PasswordChangeScreen — MUI リファクタ版
 * 新しいパスワードの設定画面。
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Alert, Link, Stack, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiAuthLayout from '../../../../../components/ui/MuiAuthLayout/MuiAuthLayout';
import { useFormValidation } from '../../../../../lib/useFormValidation';
import { passwordChangeFormSchema } from '../../../../../lib/formSchemas';

const PasswordChangeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { returnTo?: string } | null;
  const returnTo = state?.returnTo;
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const { errors: fieldErrors, validate, clearError } = useFormValidation(passwordChangeFormSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = validate({ password, confirm });
    if (!result.success) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      if (returnTo) {
        navigate(returnTo, { state: { passwordChanged: true } });
      } else {
        navigate('/login', { state: { passwordChanged: true } });
      }
    } catch {
      setError('パスワードの変更中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiAuthLayout
      title="パスワード変更画面"
      subtitle="新しいパスワードを設定してください"
    >
      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 4.5, sm: 5.5 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3.25 }}
          >
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {/* 新しいパスワード */}
            <TextField
              id="new-password"
              label="新しいパスワード"
              placeholder="8文字以上"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPass ? 'パスワードを非表示' : 'パスワードを表示'}
                      onClick={() => setShowPass((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* パスワード確認 */}
            <TextField
              id="confirm-password"
              label="パスワード（確認）"
              placeholder="同じパスワードを再入力"
              type={showConf ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); clearError('confirm'); }}
              error={Boolean(fieldErrors.confirm)}
              helperText={fieldErrors.confirm}
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConf ? 'パスワードを非表示' : 'パスワードを表示'}
                      onClick={() => setShowConf((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConf ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? '変更中…' : 'パスワードを変更'}
            </Button>

            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => navigate(returnTo ?? '/login')}
              size="large"
            >
              戻る
            </Button>

            <Stack alignItems="flex-end">
              <Link
                component="button"
                type="button"
                onClick={() => navigate(returnTo ?? '/login')}
                underline="hover"
                sx={{ fontSize: '0.85rem', color: 'text.secondary', cursor: 'pointer' }}
              >
                {returnTo ? '編集画面へ戻る' : 'ログイン画面へ戻る'}
              </Link>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </MuiAuthLayout>
  );
};

export default PasswordChangeScreen;
