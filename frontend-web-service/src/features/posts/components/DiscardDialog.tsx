import React from 'react';
import {
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

const DiscardDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSaveAndExit: () => void;
}> = ({ open, onClose, onDiscard, onSaveAndExit }) => (
  <Dialog
    open={open}
    onClose={onClose}
    disableScrollLock
    PaperProps={{
      sx: {
        background: 'linear-gradient(145deg, #0e2040 0%, #091628 100%)',
        border: '1px solid rgba(200,220,255,0.22)',
        borderRadius: '12px',
        color: '#e8f2ff',
        minWidth: { xs: 300, sm: 380 },
      },
    }}
  >
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        fontWeight: 700,
        fontSize: '1rem',
        color: '#ffaabb',
        borderBottom: '1px solid rgba(200,220,255,0.14)',
        pb: 1.5,
      }}
    >
      <FiAlertTriangle size={18} />
      下書き保存をしますか？
    </DialogTitle>
    <DialogContent sx={{ pt: 2 }}>
      <Typography sx={{ color: 'rgba(210,230,255,0.75)', fontSize: '0.88rem', lineHeight: 1.75 }}>
        この内容を下書きとして保存できます。
        <br />
        保存せずに戻ると入力内容は失われます。
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 2.75, pb: 2.75, gap: 1.15, flexWrap: 'wrap' }}>
      <ButtonBase
        onClick={onClose}
        sx={{
          flex: { xs: '1 1 100%', sm: 1 },
          py: 1.35,
          minHeight: 52,
          borderRadius: '10px',
          border: '1px solid rgba(180,210,255,0.28)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#c8deff',
          fontWeight: 600,
          fontSize: '0.97rem',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
        }}
      >
        投稿へ戻る
      </ButtonBase>
      <ButtonBase
        onClick={onDiscard}
        sx={{
          flex: 1,
          py: 1.35,
          minHeight: 52,
          borderRadius: '10px',
          border: '1px solid rgba(180,210,255,0.3)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#c8deff',
          fontWeight: 700,
          fontSize: '0.97rem',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
        }}
      >
        HOME画面
      </ButtonBase>
      <ButtonBase
        onClick={onSaveAndExit}
        sx={{
          flex: 1,
          py: 1.35,
          minHeight: 52,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0d5fd8 0%, #1247a9 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.97rem',
          boxShadow: '0 4px 14px rgba(18,71,169,0.38)',
          '&:hover': { filter: 'brightness(1.08)' },
        }}
      >
        下書き保存
      </ButtonBase>
    </DialogActions>
  </Dialog>
);

export default DiscardDialog;
