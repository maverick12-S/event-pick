// =============================================
// LoginForm — MUI リファクタ版
// =============================================
// MUI TextField / Button / Card を使用。
// ロジックは props で注入（テスト容易性維持）。
// =============================================

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { LoginRequest } from '../../../../types/auth';

interface LoginFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: LoginRequest) => void;
  onPasswordReset: () => void;
  onNewAccount: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  error,
  onSubmit,
  onPasswordReset,
  onNewAccount,
}) => {
  const [realm, setRealm] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [k: string]: string } = {};
    if (!realm.trim())    errs.realm    = '拠点レルムを入力してください';
    if (!username.trim()) errs.username = 'ユーザー名を入力してください';
    if (!password)        errs.password = 'パスワードを入力してください';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ realm: realm.trim(), username: username.trim(), password });
  };

  const clearError = (field: string) =>
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  return (
    <Card elevation={0}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          {/* エラーバナー */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* 拠点レルム */}
          <TextField
            id="realm"
            label="拠点レルム"
            placeholder="拠点レルムを入力"
            value={realm}
            onChange={(e) => { setRealm(e.target.value); clearError('realm'); }}
            error={Boolean(fieldErrors.realm)}
            helperText={fieldErrors.realm}
            autoComplete="off"
            required
            fullWidth
            variant="outlined"
          />

          {/* ユーザー名 */}
          <TextField
            id="username"
            label="ユーザー名"
            placeholder="拠点アカウントID"
            value={username}
            onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
            error={Boolean(fieldErrors.username)}
            helperText={fieldErrors.username}
            autoComplete="username"
            required
            fullWidth
            variant="outlined"
          />

          {/* パスワード */}
          <TextField
            id="password"
            label="パスワード"
            placeholder="パスワード"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* ログインボタン */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            size="large"
            sx={{ mt: 0.5 }}
          >
            {isLoading ? 'ログイン中…' : 'ログイン'}
          </Button>

          {/* リンク群 */}
          <Stack alignItems="flex-end" gap={0.5}>
            <Link
              component="button"
              type="button"
              onClick={onPasswordReset}
              underline="hover"
              sx={{ fontSize: '0.85rem', color: 'text.secondary', cursor: 'pointer' }}
            >
              パスワード回復をする
            </Link>
            <Link
              component="button"
              type="button"
              onClick={onNewAccount}
              underline="hover"
              sx={{ fontSize: '0.85rem', color: 'text.secondary', cursor: 'pointer' }}
            >
              パスワードログアウト
            </Link>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
