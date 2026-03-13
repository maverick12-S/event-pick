import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const CONTACT_SCREEN_SCALE = 1.35;

const categoryOptions = [
  'アカウント',
  '投稿機能',
  '請求・決済',
  '通知',
  '不具合報告',
  'その他',
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#eef6ff',
    backgroundColor: 'rgba(8, 18, 34, 0.52)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(178, 204, 236, 0.46)' },
    '&:hover fieldset': { borderColor: 'rgba(178, 204, 236, 0.72)' },
    '&.Mui-focused fieldset': { borderColor: '#7dc8ff' },
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(211, 229, 248, 0.62)',
    opacity: 1,
  },
};

const selectSx = {
  color: '#eef6ff',
  backgroundColor: 'rgba(8, 18, 34, 0.52)',
  borderRadius: '10px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.46)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.72)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dc8ff' },
  '& .MuiSvgIcon-root': { color: '#d9e9ff' },
};

const SettingsContactScreen: React.FC = () => {
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const handleSubmit = () => {
    if (!subject.trim()) {
      setSnackbar({ open: true, severity: 'error', message: '件名を入力してください' });
      return;
    }

    if (!message.trim()) {
      setSnackbar({ open: true, severity: 'error', message: 'お問い合わせ内容を入力してください' });
      return;
    }

    setSnackbar({ open: true, severity: 'success', message: 'お問い合わせを送信しました' });
    setSubject('');
    setCategory('');
    setMessage('');
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
          width: { xs: '100%', lg: `${100 / CONTACT_SCREEN_SCALE}%` },
          maxWidth: 760,
          mx: 'auto',
          zoom: { xs: 1, lg: CONTACT_SCREEN_SCALE },
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

        <Box
          sx={{
            width: 'min(680px, 100%)',
            mx: 'auto',
            borderRadius: '22px',
            border: '1px solid rgba(102, 205, 255, 0.5)',
            background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.9), rgba(11, 32, 60, 0.92))',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.16), 0 18px 42px rgba(3, 14, 31, 0.58), 0 0 26px rgba(58, 194, 255, 0.2)',
            px: { xs: 2, sm: 2.8, md: 3.2 },
            py: { xs: 2.2, sm: 2.8, md: 3.2 },
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
            <Typography
              sx={{
                color: '#f4fbff',
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.6rem' },
                fontWeight: 900,
                letterSpacing: '0.03em',
              }}
            >
              お問い合わせ
            </Typography>
            <Typography
              sx={{
                color: 'rgba(215, 232, 252, 0.76)',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
                mt: 0.4,
                mb: 2.1,
              }}
            >
              運営チームへのご連絡
            </Typography>

            <Typography sx={{ color: 'rgba(214, 230, 250, 0.9)', fontSize: '0.83rem', fontWeight: 700, mb: 0.5 }}>
              件名
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="件名を入力してください"
              sx={fieldSx}
            />

            <Typography sx={{ color: 'rgba(214, 230, 250, 0.9)', fontSize: '0.83rem', fontWeight: 700, mt: 1.2, mb: 0.5 }}>
              カテゴリー（任意）
            </Typography>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              MenuProps={{
                disableScrollLock: true,
                PaperProps: {
                  sx: {
                    backgroundColor: '#17293f',
                    color: '#e9f2ff',
                  },
                },
              }}
              sx={selectSx}
              renderValue={(selected) => (selected ? selected : 'カテゴリーを選択してください')}
            >
              <MenuItem value="">カテゴリーを選択してください</MenuItem>
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>

            <Typography sx={{ color: 'rgba(214, 230, 250, 0.9)', fontSize: '0.83rem', fontWeight: 700, mt: 1.2, mb: 0.5 }}>
              お問い合わせ内容
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="お問い合わせ内容をご記入ください"
              sx={fieldSx}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.2 }}>
              <ButtonBase
                onClick={handleSubmit}
                sx={{
                  minWidth: 190,
                  minHeight: 44,
                  borderRadius: '999px',
                  border: '1px solid rgba(35, 113, 214, 0.92)',
                  background: 'linear-gradient(145deg, #3f9bff, #22c9df)',
                  color: '#fcfeff',
                  fontSize: '1rem',
                  fontWeight: 900,
                  boxShadow: '0 10px 22px rgba(24, 82, 173, 0.34)',
                }}
              >
                送信
              </ButtonBase>
            </Box>
          </Box>
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
          sx={{ fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsContactScreen;
