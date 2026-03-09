import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMapPin, FiTag, FiUser } from 'react-icons/fi';
import accountsMockApi from '../../../api/mock/accountsMockApi';
import type { IssueAccountFormState } from '../types/issueAccount';
import useIssueAccountMock from '../hooks/useIssueAccountMock';
import {
  INITIAL_ISSUE_FORM,
  ISSUE_SCREEN_SCALE,
  PLAN_OPTIONS,
} from '../constants/accountsIssue.constants';
import { issueFieldSx, issueLabelSx } from '../styles/accountsIssue.styles';
import PlanGuideModal from '../components/PlanGuideModal';

const AccountsIssueScreen: React.FC = () => {
  const navigate = useNavigate();
  const issueMutation = useIssueAccountMock();
  const [accountId] = useState(() => accountsMockApi.generateAccountId());
  const [form, setForm] = useState<IssueAccountFormState>(INITIAL_ISSUE_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [planGuideOpen, setPlanGuideOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const setField = <K extends keyof IssueAccountFormState>(key: K, value: IssueAccountFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.baseName.trim()) return '拠点アカウント名を入力してください';
    if (!form.displayName.trim()) return '拠点アカウント表示名を入力してください';
    if (!form.address.trim()) return '住所を入力してください';
    if (!form.initialPassword.trim()) return '初期パスワードを入力してください';
    if (form.initialPassword.trim().length < 8) return '初期パスワードは8文字以上で入力してください';
    return null;
  };

  const handleCreate = async () => {
    const error = validate();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    setConfirmOpen(false);

    try {
      await issueMutation.mutateAsync({
        baseName: form.baseName.trim(),
        displayName: form.displayName.trim(),
        address: form.address.trim(),
        initialPassword: form.initialPassword,
        plan: form.plan,
      });

      setSnackbar({ open: true, message: '拠点アカウントを作成しました', severity: 'success' });
      setTimeout(() => navigate('/accounts'), 700);
    } catch {
      setSnackbar({ open: true, message: '拠点アカウント作成に失敗しました', severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px))',
        px: { xs: 2.2, md: 3.4 },
        pt: { xs: 2.3, md: 3.4 },
        pb: { xs: 4.2, md: 6 },
        background:
          'radial-gradient(circle at 0% 100%, rgba(20, 173, 255, 0.24), rgba(4, 18, 38, 0) 36%), radial-gradient(circle at 100% 0%, rgba(47, 223, 255, 0.22), rgba(4, 18, 38, 0) 32%), linear-gradient(180deg, #092345 0%, #081b37 48%, #08172f 100%)',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', lg: `${100 / ISSUE_SCREEN_SCALE}%` },
          maxWidth: 940,
          mx: 'auto',
          zoom: { xs: 1, lg: ISSUE_SCREEN_SCALE },
          transformOrigin: 'top center',
        }}
      >
        <ButtonBase
          onClick={() => navigate('/accounts')}
          sx={{
            borderRadius: 999,
            px: 1.35,
            py: 0.62,
            border: '1px solid rgba(186, 214, 250, 0.5)',
            backgroundColor: 'rgba(11, 34, 67, 0.58)',
            color: '#d8ebff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.62,
            fontSize: '0.79rem',
            fontWeight: 700,
            mb: 1.55,
          }}
        >
          <FiArrowLeft /> 一覧へ戻る
        </ButtonBase>

        <Box sx={{ textAlign: 'center', mb: 2.1 }}>
          <Typography
            sx={{
              color: '#eaf6ff',
              fontSize: { xs: '1.8rem', md: '2.35rem' },
              fontWeight: 900,
              letterSpacing: '0.02em',
              mb: 0.5,
            }}
          >
            拠点アカウント払出
          </Typography>
          <Typography sx={{ color: 'rgba(189, 222, 252, 0.78)', fontSize: '0.86rem' }}>
            拠点アカウントを新規発行し、利用開始設定を行います
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: '18px',
            border: '1px solid rgba(102, 205, 255, 0.5)',
            background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.9), rgba(11, 32, 60, 0.92))',
            boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.16), 0 18px 42px rgba(3, 14, 31, 0.58), 0 0 26px rgba(58, 194, 255, 0.2)',
            p: { xs: 1.65, md: 2.35 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0) 62%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={issueLabelSx}>
            拠点アカウントID（自動生成）
          </Typography>
          <TextField
            value={accountId}
            disabled
            fullWidth
            sx={issueFieldSx}
            InputProps={{ startAdornment: <FiTag style={{ marginRight: 8, color: '#83d9ff' }} /> }}
          />
          <Typography sx={{ color: 'rgba(177, 219, 249, 0.84)', fontSize: '0.78rem', mt: 0.55, mb: 1.35 }}>
            拠点アカウントIDは自動生成されます
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Box>
              <Typography sx={issueLabelSx}>拠点アカウント名</Typography>
              <TextField
                value={form.baseName}
                onChange={(event) => setField('baseName', event.target.value)}
                fullWidth
                sx={issueFieldSx}
                InputProps={{ startAdornment: <FiUser style={{ marginRight: 8, color: '#83d9ff' }} /> }}
              />
            </Box>

            <Box>
              <Typography sx={issueLabelSx}>拠点アカウント表示名</Typography>
              <TextField
                value={form.displayName}
                onChange={(event) => setField('displayName', event.target.value)}
                fullWidth
                sx={issueFieldSx}
              />
            </Box>
          </Box>

          <Typography sx={{ ...issueLabelSx, mt: 1.35 }}>
            住所
          </Typography>
          <TextField
            value={form.address}
            onChange={(event) => setField('address', event.target.value)}
            fullWidth
            sx={issueFieldSx}
            InputProps={{ startAdornment: <FiMapPin style={{ marginRight: 8, color: '#83d9ff' }} /> }}
          />

          <Typography sx={{ ...issueLabelSx, mt: 1.35 }}>
            初期パスワード
          </Typography>
          <TextField
            value={form.initialPassword}
            onChange={(event) => setField('initialPassword', event.target.value)}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            sx={issueFieldSx}
            InputProps={{
              startAdornment: <FiLock style={{ marginRight: 8, color: '#83d9ff' }} />,
              endAdornment: (
                <ButtonBase
                  onClick={() => setShowPassword((prev) => !prev)}
                  sx={{ width: 28, height: 28, borderRadius: 999, color: 'rgba(192, 225, 250, 0.8)' }}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </ButtonBase>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.35, mb: 0.6 }}>
            <Typography sx={{ ...issueLabelSx, mb: 0 }}>
              プラン
            </Typography>
            <ButtonBase
              onClick={() => setPlanGuideOpen(true)}
              sx={{
                minHeight: 34,
                px: 1.15,
                borderRadius: '999px',
                border: '1px solid rgba(121, 200, 251, 0.56)',
                color: '#dff2ff',
                background: 'linear-gradient(145deg, rgba(42, 137, 211, 0.34), rgba(24, 85, 152, 0.32))',
                fontSize: '0.8rem',
                fontWeight: 800,
              }}
            >
              プラン説明
            </ButtonBase>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.72, flexWrap: 'wrap', mb: 1.25 }}>
            {PLAN_OPTIONS.map((plan) => {
              const selected = form.plan === plan;
              return (
                <ButtonBase
                  key={plan}
                  onClick={() => setField('plan', plan)}
                  sx={{
                    minHeight: 38,
                    px: 1.35,
                    borderRadius: 999,
                    border: selected ? '1px solid rgba(70, 221, 255, 0.96)' : '1px solid rgba(171, 203, 235, 0.35)',
                    background: selected
                      ? 'linear-gradient(145deg, rgba(23, 188, 255, 0.38), rgba(24, 126, 255, 0.32))'
                      : 'linear-gradient(145deg, rgba(219, 238, 255, 0.15), rgba(171, 203, 235, 0.08))',
                    color: '#eaf6ff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    boxShadow: selected ? '0 0 14px rgba(62, 203, 255, 0.24)' : 'none',
                  }}
                >
                  {plan}
                </ButtonBase>
              );
            })}
          </Box>

          <Typography sx={issueLabelSx}>
            クーポンコード
          </Typography>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <TextField
              value={form.couponCode}
              onChange={(event) => setField('couponCode', event.target.value)}
              fullWidth
              placeholder="例: EP-2026-SPRING"
              sx={issueFieldSx}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.05, mt: 1.9 }}>
            <ButtonBase
              onClick={() => navigate('/accounts')}
              sx={{
                minHeight: 46,
                borderRadius: '12px',
                border: '1px solid rgba(173, 201, 235, 0.38)',
                background: 'linear-gradient(145deg, rgba(214, 230, 248, 0.2), rgba(151, 176, 206, 0.2))',
                color: '#e5f3ff',
                fontWeight: 700,
                fontSize: '0.96rem',
              }}
            >
              キャンセル
            </ButtonBase>

            <ButtonBase
              onClick={handleCreate}
              disabled={issueMutation.isPending}
              sx={{
                minHeight: 46,
                borderRadius: '12px',
                border: '1px solid rgba(85, 229, 255, 0.88)',
                background: 'linear-gradient(145deg, rgba(27, 195, 255, 0.34), rgba(16, 123, 255, 0.34))',
                color: '#ecf9ff',
                fontWeight: 800,
                fontSize: '0.96rem',
                boxShadow: '0 0 18px rgba(57, 210, 255, 0.35)',
                '&:disabled': {
                  opacity: 0.55,
                },
              }}
            >
              {issueMutation.isPending ? '作成中...' : 'アカウント作成'}
            </ButtonBase>
          </Box>
          </Box>

          <PlanGuideModal open={planGuideOpen} onClose={() => setPlanGuideOpen(false)} />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2600}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid rgba(120, 168, 223, 0.46)',
            background: 'linear-gradient(180deg, #ffffff, #f3f8ff)',
            boxShadow: '0 14px 34px rgba(6, 22, 45, 0.32)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#13345f', fontWeight: 800, pb: 1 }}>確認</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#244a7a', fontSize: '0.98rem', fontWeight: 600 }}>
            アカウントを作成しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.2, pb: 1.8, pt: 0.8, gap: 0.9 }}>
          <ButtonBase
            onClick={() => setConfirmOpen(false)}
            sx={{
              minHeight: 36,
              px: 1.6,
              borderRadius: '8px',
              border: '1px solid rgba(121, 148, 181, 0.7)',
              backgroundColor: '#ffffff',
              color: '#2c4f7e',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            キャンセル
          </ButtonBase>
          <ButtonBase
            onClick={handleConfirmCreate}
            disabled={issueMutation.isPending}
            sx={{
              minHeight: 36,
              px: 1.6,
              borderRadius: '8px',
              border: '1px solid rgba(35, 113, 214, 0.92)',
              background: 'linear-gradient(145deg, #3f9bff, #226fd8)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 800,
              '&:disabled': { opacity: 0.55 },
            }}
          >
            {issueMutation.isPending ? '作成中...' : '作成する'}
          </ButtonBase>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsIssueScreen;
