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
import { getBillingAddress, updateBillingAddress } from '../../../api/db/billing.db';
import type { BillingAddress } from '../../../api/db/billing.db';

const BILLING_EDIT_SCALE = 1.2;

// shared field sx
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#f0f8ff',
    backgroundColor: 'rgba(8, 18, 34, 0.58)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(178, 204, 236, 0.5)' },
    '&:hover fieldset': { borderColor: 'rgba(178, 204, 236, 0.72)' },
    '&.Mui-focused fieldset': { borderColor: '#7dc8ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(215, 232, 252, 0.68)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7dc8ff' },
};

const selectSx = {
  color: '#f0f8ff',
  backgroundColor: 'rgba(8, 18, 34, 0.58)',
  borderRadius: '10px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.5)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.72)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7dc8ff' },
  '& .MuiSvgIcon-root': { color: '#d9e9ff' },
};

const labelSx = {
  color: 'rgba(215, 232, 252, 0.72)',
  fontSize: '0.82rem',
  fontWeight: 700,
  mb: 0.5,
};

const COUNTRY_OPTIONS = ['日本', 'アメリカ', 'シンガポール', 'イギリス', 'その他'];
const PHONE_PREFIX_OPTIONS = ['+81', '+1', '+65', '+44', '+86'];

const SettingsBillingEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<BillingAddress>(() => getBillingAddress());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const update = (key: keyof BillingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    updateBillingAddress(form);
    setSnackbar({ open: true, message: '請求先情報を更新しました', severity: 'success' });
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
          width: { xs: '100%', lg: `${100 / BILLING_EDIT_SCALE}%` },
          maxWidth: 720,
          mx: 'auto',
          zoom: { xs: 1, lg: BILLING_EDIT_SCALE },
          transformOrigin: 'top center',
        }}
      >
        {/* Back */}
        <ButtonBase
          onClick={() => navigate('/settings/billing')}
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
          <FiArrowLeft /> 請求管理に戻る
        </ButtonBase>

        <Typography
          sx={{
            color: '#f4fbff',
            textAlign: 'center',
            fontSize: { xs: '2.1rem', md: '2.75rem' },
            fontWeight: 900,
            letterSpacing: '0.03em',
            mb: 2.2,
            textShadow: '0 10px 28px rgba(8, 19, 45, 0.42)',
          }}
        >
          請求先情報
        </Typography>

        {/* --- form card --- */}
        <Box
          sx={{
            borderRadius: '22px',
            border: '1px solid rgba(102, 205, 255, 0.5)',
            background: 'linear-gradient(180deg, rgba(17, 44, 76, 0.9), rgba(11, 32, 60, 0.92))',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 0 1px rgba(72, 213, 255, 0.16), 0 18px 42px rgba(3, 14, 31, 0.58), 0 0 26px rgba(58, 194, 255, 0.2)',
            px: { xs: 2, sm: 2.6, md: 3 },
            py: { xs: 2, sm: 2.4, md: 2.8 },
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
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name */}
            <Box>
              <Typography sx={labelSx}>名前</Typography>
              <TextField
                fullWidth
                size="small"
                value={form.name}
                onChange={update('name')}
                sx={fieldSx}
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography sx={labelSx}>メール</Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                value={form.email}
                onChange={update('email')}
                sx={fieldSx}
              />
            </Box>

            {/* Address heading */}
            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800, mt: 0.8 }}>
              住所
            </Typography>

            {/* Country */}
            <Box>
              <Typography sx={labelSx}>国</Typography>
              <Select
                fullWidth
                size="small"
                value={form.country}
                onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                sx={selectSx}
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: { sx: { backgroundColor: '#17293f', color: '#e9f2ff' } },
                }}
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </Box>

            {/* PostalCode */}
            <Box>
              <Typography sx={labelSx}>郵便番号</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="154-0023"
                value={form.postalCode}
                onChange={update('postalCode')}
                sx={fieldSx}
              />
            </Box>

            {/* Prefecture / City */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <Box>
                <Typography sx={labelSx}>都道府県</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={form.prefecture}
                  onChange={update('prefecture')}
                  sx={fieldSx}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>市区町村</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={form.city}
                  onChange={update('city')}
                  sx={fieldSx}
                />
              </Box>
            </Box>

            {/* Address lines */}
            <Box>
              <Typography sx={labelSx}>住所 (1 行目)</Typography>
              <TextField
                fullWidth
                size="small"
                value={form.address1}
                onChange={update('address1')}
                sx={fieldSx}
              />
            </Box>
            <Box>
              <Typography sx={labelSx}>住所 (2 行目)</Typography>
              <TextField
                fullWidth
                size="small"
                value={form.address2}
                onChange={update('address2')}
                sx={fieldSx}
              />
            </Box>

            {/* Phone */}
            <Typography sx={{ color: '#f4fbff', fontSize: '1.05rem', fontWeight: 800, mt: 0.8 }}>
              電話番号
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 1.2, alignItems: 'end' }}>
              <Box>
                <Typography sx={labelSx}>JP</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={form.phoneCountry}
                  onChange={(e) => setForm((prev) => ({ ...prev, phoneCountry: e.target.value }))}
                  sx={selectSx}
                  MenuProps={{
                    disableScrollLock: true,
                    PaperProps: { sx: { backgroundColor: '#17293f', color: '#e9f2ff' } },
                  }}
                >
                  {PHONE_PREFIX_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography sx={labelSx}>&nbsp;</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="3 1234 5678"
                  value={form.phoneNumber}
                  onChange={update('phoneNumber')}
                  sx={fieldSx}
                />
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.3, mt: 2 }}>
              <ButtonBase
                onClick={() => navigate('/settings/billing')}
                sx={{
                  minWidth: 108,
                  minHeight: 42,
                  px: 2.2,
                  borderRadius: '999px',
                  border: '1px solid rgba(201, 231, 255, 0.36)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(112, 137, 180, 0.18))',
                  color: '#fcfeff',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 14px rgba(12, 24, 54, 0.18)',
                }}
              >
                キャンセル
              </ButtonBase>
              <ButtonBase
                onClick={handleSave}
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
                }}
              >
                保存
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

export default SettingsBillingEditScreen;
