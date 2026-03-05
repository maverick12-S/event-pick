/**
 * PasswordChangeScreen — MUI リファクタ版
 * 新しいパスワードの設定画面。
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Alert, Link, Stack, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiAuthLayout from '../../../../../components/ui/MuiAuthLayout/MuiAuthLayout';

const PasswordChangeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  const validate = () => {
    const errs: { password?: string; confirm?: string } = {};
    if (!password)           errs.password = '新しいパスワードを入力してください';
    else if (password.length < 8) errs.password = '8文字以上で入力してください';
    if (!confirm)            errs.confirm  = '確認用パスワードを入力してください';
    else if (password !== confirm) errs.confirm = 'パスワードが一致しません';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      navigate('/login', { state: { passwordChanged: true } });
    } catch {
      setError('パスワードの変更中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MuiAuthLayout
      title="パスワード変更"
      subtitle="新しいパスワードを設定してください"
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

            {/* 新しいパスワード */}
            <TextField
              id="new-password"
              label="新しいパスワード"
              placeholder="8文字以上"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
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
              onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: undefined })); }}
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

export default PasswordChangeScreen;
