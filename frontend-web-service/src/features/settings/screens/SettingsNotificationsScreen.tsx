import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material';
import {
  FiArrowLeft,
  FiMail,
  FiSend,
} from 'react-icons/fi';

type NotificationChannel = 'email' | 'push';

type NotificationItem = {
  id: string;
  label: string;
};

type NotificationState = Record<string, Record<NotificationChannel, boolean>>;

const NOTIFICATION_ITEMS: NotificationItem[] = [
  { id: 'post-complete', label: '投稿完了' },
  { id: 'report-ready', label: 'レポート生成完了' },
  { id: 'account-updated', label: 'アカウント更新' },
  { id: 'system-notice', label: 'システム通知' },
  { id: 'error-alert', label: 'エラー通知' },
];

const INITIAL_SETTINGS: NotificationState = {
  'post-complete': { email: true, push: true },
  'report-ready': { email: true, push: true },
  'account-updated': { email: true, push: false },
  'system-notice': { email: true, push: true },
  'error-alert': { email: true, push: true },
};

const NOTIFICATION_SCREEN_SCALE = 1.12;

const switchSx = {
  width: 58,
  height: 34,
  p: 0,
  display: 'flex',
  '& .MuiSwitch-switchBase': {
    p: '4px',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#ffffff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        background: 'linear-gradient(180deg, rgba(104, 203, 255, 0.95), rgba(37, 139, 255, 0.92))',
        borderColor: 'rgba(110, 220, 255, 0.95)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 26,
    height: 26,
    boxShadow: '0 2px 8px rgba(8, 22, 46, 0.34)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    opacity: 1,
    background: 'linear-gradient(180deg, rgba(137, 157, 186, 0.64), rgba(90, 108, 136, 0.66))',
    border: '1px solid rgba(193, 218, 247, 0.3)',
    boxSizing: 'border-box',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
};

const cellSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
};

const SettingsNotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [savedSettings, setSavedSettings] = useState<NotificationState>(INITIAL_SETTINGS);
  const [draftSettings, setDraftSettings] = useState<NotificationState>(INITIAL_SETTINGS);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const isDirty = useMemo(
    () => JSON.stringify(draftSettings) !== JSON.stringify(savedSettings),
    [draftSettings, savedSettings],
  );

  const setChannel = (itemId: string, channel: NotificationChannel) => {
    setDraftSettings((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [channel]: !prev[itemId][channel],
      },
    }));
  };

  const handleSave = () => {
    setSavedSettings(draftSettings);
    setSnackbar({ open: true, message: '通知設定を保存しました', severity: 'success' });
  };

  const handleReset = () => {
    setDraftSettings(savedSettings);
    setSnackbar({ open: true, message: '変更を取り消しました', severity: 'info' });
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px) - 60px)',
        px: { xs: 2.2, md: 3.4 },
        pt: { xs: 2.3, md: 3.4 },
        pb: { xs: 4.2, md: 6 },
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 0% 100%, rgba(20, 173, 255, 0.24), rgba(4, 18, 38, 0) 36%), radial-gradient(circle at 100% 0%, rgba(47, 223, 255, 0.22), rgba(4, 18, 38, 0) 32%), linear-gradient(180deg, #092345 0%, #081b37 48%, #08172f 100%)',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', lg: `${100 / NOTIFICATION_SCREEN_SCALE}%` },
          maxWidth: 920,
          mx: 'auto',
          zoom: { xs: 1, lg: NOTIFICATION_SCREEN_SCALE },
          transformOrigin: 'top center',
        }}
      >
        <ButtonBase
          onClick={() => navigate('/home')}
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
          <FiArrowLeft /> Homeに戻る
        </ButtonBase>

        <Typography
          sx={{
            color: '#f4fbff',
            textAlign: 'center',
            fontSize: { xs: '2.1rem', md: '2.75rem' },
            fontWeight: 900,
            letterSpacing: '0.03em',
            mb: 2.1,
            textShadow: '0 10px 28px rgba(8, 19, 45, 0.42)',
          }}
        >
          通知設定
        </Typography>

        <Box
          sx={{
            borderRadius: '22px',
            border: '1px solid rgba(102, 205, 255, 0.5)',
            background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.9), rgba(11, 32, 60, 0.92))',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.16), 0 18px 42px rgba(3, 14, 31, 0.58), 0 0 26px rgba(58, 194, 255, 0.2)',
            px: { xs: 1.6, sm: 2.3, md: 2.8 },
            py: { xs: 1.8, sm: 2.2, md: 2.5 },
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.9fr) minmax(150px, 0.9fr) minmax(150px, 0.9fr)',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid rgba(214, 233, 255, 0.16)',
                pb: 1.1,
                mb: 0.55,
              }}
            >
              <Box />
              <Box sx={{ ...cellSx, gap: 0.55 }}>
                <FiMail size={16} color="rgba(228, 242, 255, 0.92)" />
                <Typography sx={{ color: '#f6fbff', fontSize: { xs: '0.95rem', md: '1.1rem' }, fontWeight: 800 }}>
                  メール通知
                </Typography>
              </Box>
              <Box sx={{ ...cellSx, gap: 0.55 }}>
                <FiSend size={16} color="rgba(228, 242, 255, 0.92)" />
                <Typography sx={{ color: '#f6fbff', fontSize: { xs: '0.95rem', md: '1.1rem' }, fontWeight: 800 }}>
                  Push通知
                </Typography>
              </Box>
            </Box>

            <Box>
              {NOTIFICATION_ITEMS.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.9fr) minmax(150px, 0.9fr) minmax(150px, 0.9fr)',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: { xs: 56, md: 58 },
                    borderBottom: '1px solid rgba(214, 233, 255, 0.14)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#f4fbff',
                      fontSize: { xs: '1rem', md: '1.08rem' },
                      fontWeight: 800,
                      pl: { xs: 0.4, md: 0.9 },
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Box sx={cellSx}>
                    <Box sx={{ display: 'grid', justifyItems: 'center', gap: 0.3 }}>
                      <Switch
                      checked={draftSettings[item.id].email}
                      onChange={() => setChannel(item.id, 'email')}
                        sx={switchSx}
                      />
                      <Typography sx={{ color: draftSettings[item.id].email ? '#c9f1ff' : 'rgba(215, 230, 248, 0.56)', fontSize: '0.72rem', fontWeight: 800 }}>
                        {draftSettings[item.id].email ? 'ON' : 'OFF'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={cellSx}>
                    <Box sx={{ display: 'grid', justifyItems: 'center', gap: 0.3 }}>
                      <Switch
                      checked={draftSettings[item.id].push}
                      onChange={() => setChannel(item.id, 'push')}
                        sx={switchSx}
                      />
                      <Typography sx={{ color: draftSettings[item.id].push ? '#c9f1ff' : 'rgba(215, 230, 248, 0.56)', fontSize: '0.72rem', fontWeight: 800 }}>
                        {draftSettings[item.id].push ? 'ON' : 'OFF'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.3, mt: 1.8 }}>
              <ButtonBase
                onClick={handleSave}
                disabled={!isDirty}
                sx={{
                  minWidth: 118,
                  minHeight: 42,
                  px: 2.2,
                  borderRadius: '999px',
                  border: '1px solid rgba(35, 113, 214, 0.92)',
                  background: 'linear-gradient(145deg, #3f9bff, #226fd8)',
                  color: '#fcfeff',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  boxShadow: '0 10px 22px rgba(24, 82, 173, 0.34)',
                  '&:disabled': {
                    opacity: 0.45,
                  },
                }}
              >
                保存
              </ButtonBase>

              <ButtonBase
                onClick={handleReset}
                disabled={!isDirty}
                sx={{
                  minWidth: 118,
                  minHeight: 42,
                  px: 2.2,
                  borderRadius: '999px',
                  border: '1px solid rgba(189, 214, 244, 0.26)',
                  background: 'linear-gradient(180deg, rgba(236,243,255,0.18), rgba(113, 130, 163, 0.3))',
                  color: 'rgba(242, 249, 255, 0.95)',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 16px rgba(12, 24, 54, 0.16)',
                  '&:disabled': {
                    opacity: 0.45,
                  },
                }}
              >
                キャンセル
              </ButtonBase>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2400}
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
    </Box>
  );
};

export default SettingsNotificationsScreen;