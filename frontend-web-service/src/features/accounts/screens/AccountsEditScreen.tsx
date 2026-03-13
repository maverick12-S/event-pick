import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  FiArrowLeft,
  FiCreditCard,
  FiLock,
  FiMail,
  FiMapPin,
  FiTag,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import { ISSUE_SCREEN_SCALE, PLAN_OPTIONS } from '../constants/accountsIssue.constants';
import {
  useAccountDetailMock,
  useCancelAccountDeletionMock,
  useDeleteAccountMock,
  useUpdateAccountMock,
} from '../hooks/useAccountEditMock';
import { issueFieldSx, issueLabelSx } from '../styles/accountsIssue.styles';
import type { AccountEditFormState } from '../types/accountEdit';
import PlanGuideModal from '../components/PlanGuideModal';

const AccountsEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId = '' } = useParams();
  const detailQuery = useAccountDetailMock(routeId);
  const updateMutation = useUpdateAccountMock();
  const deleteMutation = useDeleteAccountMock();
  const cancelDeletionMutation = useCancelAccountDeletionMock();

  const [form, setForm] = useState<AccountEditFormState | null>(null);
  const [planGuideOpen, setPlanGuideOpen] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const canScheduleDelete = detailQuery.data?.status === '停止中';
  const isScheduledDeletion = detailQuery.data?.status === '削除予定';

  useEffect(() => {
    if (!detailQuery.data) return;
    setForm({
      baseName: detailQuery.data.baseName,
      address: detailQuery.data.address,
      email: detailQuery.data.email,
      password: detailQuery.data.password,
      plan: detailQuery.data.plan,
      couponCode: detailQuery.data.couponCode,
      paymentInfo: detailQuery.data.paymentInfo,
      status: detailQuery.data.status,
    });
  }, [detailQuery.data]);

  const setField = <K extends keyof AccountEditFormState>(key: K, value: AccountEditFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = (): string | null => {
    if (!form) return '入力情報を読み込めていません';
    if (!form.baseName.trim()) return '拠点アカウント名を入力してください';
    if (!form.address.trim()) return '住所を入力してください';
    if (!form.email.trim()) return 'メールアドレスを入力してください';
    return null;
  };

  const handleSave = () => {
    const error = validate();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }
    setConfirmSaveOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!form || !routeId) return;
    setConfirmSaveOpen(false);

    try {
      await updateMutation.mutateAsync({
        id: routeId,
        payload: {
          baseName: form.baseName.trim(),
          address: form.address.trim(),
          email: form.email.trim(),
          password: form.password,
          plan: form.plan,
          couponCode: form.couponCode.trim(),
          paymentInfo: form.paymentInfo,
          status: form.status,
        },
      });
      setSnackbar({ open: true, message: '拠点アカウント情報を更新しました', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '拠点アカウント情報の更新に失敗しました', severity: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!routeId) return;
    setConfirmDeleteOpen(false);

    try {
      await deleteMutation.mutateAsync(routeId);
      setSnackbar({ open: true, message: '60日後に拠点アカウント情報を削除します', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '拠点アカウント削除に失敗しました', severity: 'error' });
    }
  };

  const handleCancelDeletion = async () => {
    if (!routeId) return;

    try {
      await cancelDeletionMutation.mutateAsync(routeId);
      setSnackbar({ open: true, message: '削除予定を取り消しました', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '削除予定の取り消しに失敗しました', severity: 'error' });
    }
  };

  const handleGoPasswordChange = () => {
    navigate('/password-change', {
      state: {
        returnTo: `/accounts/edit/${routeId}`,
      },
    });
  };

  const handleOpenStripe = () => {
    window.open('https://dashboard.stripe.com/', '_blank', 'noopener,noreferrer');
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
            拠点アカウント編集
          </Typography>
          <Typography sx={{ color: 'rgba(189, 222, 252, 0.78)', fontSize: '0.86rem' }}>
            拠点アカウント情報・契約状態を更新できます
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
          {detailQuery.isLoading && (
            <Box sx={{ p: 3, display: 'grid', placeItems: 'center' }}>
              <CircularProgress size={28} sx={{ color: '#bde5ff' }} />
            </Box>
          )}

          {detailQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              対象の拠点アカウントが見つかりません
            </Alert>
          )}

          {!detailQuery.isLoading && !detailQuery.isError && form && detailQuery.data && (
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={issueLabelSx}>拠点アカウントID</Typography>
              <TextField
                value={detailQuery.data.accountId}
                disabled
                fullWidth
                sx={issueFieldSx}
                InputProps={{ startAdornment: <FiTag style={{ marginRight: 8, color: '#83d9ff' }} /> }}
              />

              <Box sx={{ display: 'grid', gap: 1.2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 1.35 }}>
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
                  <Typography sx={issueLabelSx}>住所</Typography>
                  <TextField
                    value={form.address}
                    onChange={(event) => setField('address', event.target.value)}
                    fullWidth
                    sx={issueFieldSx}
                    InputProps={{ startAdornment: <FiMapPin style={{ marginRight: 8, color: '#83d9ff' }} /> }}
                  />
                </Box>
              </Box>

              <Typography sx={{ ...issueLabelSx, mt: 1.25 }}>メールアドレス</Typography>
              <TextField
                value={form.email}
                onChange={(event) => setField('email', event.target.value)}
                fullWidth
                type="email"
                sx={issueFieldSx}
                InputProps={{ startAdornment: <FiMail style={{ marginRight: 8, color: '#83d9ff' }} /> }}
              />
              <Typography sx={{ color: 'rgba(177, 219, 249, 0.84)', fontSize: '0.78rem', mt: 0.55 }}>
                ここで設定されたメールアドレスは、拠点アカウント単位の通知送信先として親アカウント設定から切り替わります。
              </Typography>

              <Typography sx={{ ...issueLabelSx, mt: 1.35 }}>パスワード（閲覧のみ）</Typography>
              <TextField
                value={form.password}
                fullWidth
                disabled
                type="text"
                sx={issueFieldSx}
                InputProps={{ startAdornment: <FiLock style={{ marginRight: 8, color: '#83d9ff' }} /> }}
              />
              <Box sx={{ mt: 0.7 }}>
                <ButtonBase
                  onClick={handleGoPasswordChange}
                  sx={{
                    minHeight: 35,
                    px: 1.2,
                    borderRadius: '999px',
                    border: '1px solid rgba(121, 200, 251, 0.56)',
                    color: '#dff2ff',
                    background: 'linear-gradient(145deg, rgba(42, 137, 211, 0.34), rgba(24, 85, 152, 0.32))',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  パスワード変更
                </ButtonBase>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.35, mb: 0.6 }}>
                <Typography sx={{ ...issueLabelSx, mb: 0 }}>プラン選択</Typography>
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

              <Typography sx={issueLabelSx}>クーポンコード</Typography>
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextField
                  value={form.couponCode}
                  onChange={(event) => setField('couponCode', event.target.value)}
                  fullWidth
                  placeholder="例: EP-2026-SPRING"
                  sx={issueFieldSx}
                />
              </Box>

              <Typography sx={{ ...issueLabelSx, mt: 1.35 }}>支払先情報（閲覧のみ）</Typography>
              <TextField
                value={form.paymentInfo}
                fullWidth
                multiline
                minRows={2}
                disabled
                sx={issueFieldSx}
                InputProps={{ startAdornment: <FiCreditCard style={{ marginRight: 8, color: '#83d9ff' }} /> }}
              />
              <Box sx={{ mt: 0.7 }}>
                <ButtonBase
                  onClick={handleOpenStripe}
                  sx={{
                    minHeight: 35,
                    px: 1.2,
                    borderRadius: '999px',
                    border: '1px solid rgba(121, 200, 251, 0.56)',
                    color: '#dff2ff',
                    background: 'linear-gradient(145deg, rgba(42, 137, 211, 0.34), rgba(24, 85, 152, 0.32))',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  支払先を変更（Stripe）
                </ButtonBase>
              </Box>

              <Typography sx={{ ...issueLabelSx, mt: 1.35 }}>アカウント状態</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.72 }}>
                <ButtonBase
                  onClick={() => setField('status', '利用中')}
                  sx={{
                    minHeight: 38,
                    minWidth: 110,
                    px: 1.25,
                    borderRadius: 999,
                    border: form.status === '利用中' ? '1px solid rgba(106, 247, 183, 0.9)' : '1px solid rgba(171, 203, 235, 0.35)',
                    background:
                      form.status === '利用中'
                        ? 'linear-gradient(145deg, rgba(65, 201, 135, 0.34), rgba(31, 151, 95, 0.34))'
                        : 'linear-gradient(145deg, rgba(219, 238, 255, 0.15), rgba(171, 203, 235, 0.08))',
                    color: '#eaf6ff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                  }}
                >
                  有効
                </ButtonBase>

                <ButtonBase
                  onClick={() => setField('status', '停止中')}
                  sx={{
                    minHeight: 38,
                    minWidth: 110,
                    px: 1.25,
                    borderRadius: 999,
                    border: form.status === '停止中' ? '1px solid rgba(255, 157, 136, 0.92)' : '1px solid rgba(171, 203, 235, 0.35)',
                    background:
                      form.status === '停止中'
                        ? 'linear-gradient(145deg, rgba(246, 135, 108, 0.34), rgba(202, 83, 57, 0.32))'
                        : 'linear-gradient(145deg, rgba(219, 238, 255, 0.15), rgba(171, 203, 235, 0.08))',
                    color: '#eaf6ff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                  }}
                >
                  無効
                </ButtonBase>
              </Box>
              {form.status === '停止中' && (
                <Typography sx={{ mt: 0.7, color: 'rgba(255, 205, 186, 0.95)', fontSize: '0.82rem', fontWeight: 700 }}>
                  無効化すると次サイクルから課金停止になります。ログインが不可能になります。
                </Typography>
              )}

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
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
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
                  {updateMutation.isPending ? '更新中...' : '保存'}
                </ButtonBase>
              </Box>

              <Box sx={{ mt: 1.6, borderTop: '1px solid rgba(191, 214, 244, 0.24)', pt: 1.3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.72, flexWrap: 'wrap' }}>
                  <ButtonBase
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={deleteMutation.isPending || cancelDeletionMutation.isPending || !canScheduleDelete}
                    sx={{
                      minHeight: 42,
                      px: 1.35,
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 120, 120, 0.72)',
                      background: 'linear-gradient(145deg, rgba(255, 126, 126, 0.24), rgba(214, 58, 58, 0.24))',
                      color: '#ffdede',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:disabled': { opacity: 0.55 },
                    }}
                  >
                    <FiTrash2 size={15} />
                    アカウント削除
                  </ButtonBase>

                  {isScheduledDeletion && (
                    <ButtonBase
                      onClick={handleCancelDeletion}
                      disabled={cancelDeletionMutation.isPending || deleteMutation.isPending}
                      sx={{
                        minHeight: 42,
                        px: 1.35,
                        borderRadius: '10px',
                        border: '1px solid rgba(121, 200, 251, 0.58)',
                        background: 'linear-gradient(145deg, rgba(64, 159, 226, 0.24), rgba(24, 95, 171, 0.24))',
                        color: '#dbf0ff',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&:disabled': { opacity: 0.55 },
                      }}
                    >
                      {cancelDeletionMutation.isPending ? '取消中...' : '削除取消'}
                    </ButtonBase>
                  )}
                </Box>
                {!canScheduleDelete && (
                  <Typography sx={{ mt: 0.65, color: 'rgba(255, 214, 187, 0.92)', fontSize: '0.78rem', fontWeight: 700 }}>
                    {detailQuery.data?.status === '削除予定'
                      ? 'このアカウントは削除予定です。取消する場合は「削除取消」を押してください。'
                      : 'アカウント状態を無効にして保存後、削除ボタンが有効になります。'}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

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
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
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
            変更内容を保存しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.2, pb: 1.8, pt: 0.8, gap: 0.9 }}>
          <ButtonBase
            onClick={() => setConfirmSaveOpen(false)}
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
            onClick={handleConfirmSave}
            disabled={updateMutation.isPending}
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
            {updateMutation.isPending ? '保存中...' : '保存する'}
          </ButtonBase>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid rgba(228, 138, 138, 0.62)',
            background: 'linear-gradient(180deg, #fff8f8, #ffeaea)',
            boxShadow: '0 14px 34px rgba(45, 8, 8, 0.28)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#6d1f1f', fontWeight: 800, pb: 1 }}>削除確認</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#7b2c2c', fontSize: '0.96rem', fontWeight: 600 }}>
            60日後に拠点アカウント情報を削除予定にします。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.2, pb: 1.8, pt: 0.8, gap: 0.9 }}>
          <ButtonBase
            onClick={() => setConfirmDeleteOpen(false)}
            sx={{
              minHeight: 36,
              px: 1.6,
              borderRadius: '8px',
              border: '1px solid rgba(158, 126, 126, 0.75)',
              backgroundColor: '#ffffff',
              color: '#754545',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            キャンセル
          </ButtonBase>
          <ButtonBase
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            sx={{
              minHeight: 36,
              px: 1.6,
              borderRadius: '8px',
              border: '1px solid rgba(191, 43, 43, 0.9)',
              background: 'linear-gradient(145deg, #ef5b5b, #c43535)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 800,
              '&:disabled': { opacity: 0.55 },
            }}
          >
            {deleteMutation.isPending ? '設定中...' : '削除予約する'}
          </ButtonBase>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsEditScreen;
