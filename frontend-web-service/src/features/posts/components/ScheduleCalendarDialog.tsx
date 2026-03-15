import React, { useMemo } from 'react';
import {
  Box,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { FiCalendar, FiX } from 'react-icons/fi';
import { buildCalendarMonths, WEEKDAY_JA } from '../utils/postCreateHelpers';

const ScheduleCalendarDialog: React.FC<{
  open: boolean;
  selectedDates: string[];
  minDateIso: string;
  maxDateIso: string;
  onClose: () => void;
  onToggleDate: (iso: string) => void;
  onBulkSelect: (mode: 'all' | 'weekdays' | 'weekends' | 'clear') => void;
  onConfirm: () => void;
}> = ({
  open,
  selectedDates,
  minDateIso,
  maxDateIso,
  onClose,
  onToggleDate,
  onBulkSelect,
  onConfirm,
}) => {
  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);
  const months = useMemo(() => buildCalendarMonths(minDateIso, maxDateIso), [minDateIso, maxDateIso]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          width: 'min(1200px, 96vw)',
          minHeight: 'min(860px, 92dvh)',
          background: 'linear-gradient(145deg, #050b17 0%, #0a1428 100%)',
          border: '1px solid rgba(130,170,230,0.26)',
          borderRadius: '14px',
          color: '#e8f2ff',
          display: 'flex',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#d8eaff',
          borderBottom: '1px solid rgba(100,150,255,0.18)',
          pb: 1.4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiCalendar size={16} />
          投稿日を選択（今日から1カ月）
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(180,210,255,0.7)' }}>
          <FiX />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.8, pb: 1.2, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
          <ButtonBase
            onClick={() => onBulkSelect('all')}
            sx={{ px: 1.2, py: 0.5, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
          >
            すべて選択
          </ButtonBase>
          <ButtonBase
            onClick={() => onBulkSelect('weekdays')}
            sx={{ px: 1.2, py: 0.5, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
          >
            平日のみ
          </ButtonBase>
          <ButtonBase
            onClick={() => onBulkSelect('weekends')}
            sx={{ px: 1.2, py: 0.5, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
          >
            土日祝
          </ButtonBase>
          <ButtonBase
            onClick={() => onBulkSelect('clear')}
            sx={{ px: 1.2, py: 0.5, borderRadius: '999px', border: '1px solid rgba(190,210,235,0.35)', color: '#c6d9f5', fontSize: '0.75rem', fontWeight: 700 }}
          >
            解除
          </ButtonBase>
        </Box>

        <Typography sx={{ color: 'rgba(205,225,248,0.78)', fontSize: '0.78rem', mb: 1.2 }}>
          選択中: {selectedDates.length}日
        </Typography>

        <Grid container spacing={1.8}>
          {months.map((month) => (
            <Grid key={month.key} size={12}>
              <Box sx={{ borderRadius: '12px', border: '1px solid rgba(130,170,230,0.24)', p: { xs: 1.35, md: 1.8 }, background: 'rgba(15,30,58,0.44)' }}>
                <Typography sx={{ color: '#d7e9ff', fontSize: '1rem', fontWeight: 800, mb: 1 }}>{month.label}</Typography>
                <Grid container columns={7} spacing={0.8} sx={{ mb: 0.6 }}>
                  {WEEKDAY_JA.map((w) => (
                    <Grid key={`${month.key}-${w}`} size={1}>
                      <Typography sx={{ textAlign: 'center', color: 'rgba(170,200,240,0.65)', fontSize: '0.78rem', fontWeight: 700 }}>{w}</Typography>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.95 }}>
                  {month.rows.map((row, rowIdx) => (
                    <Grid key={`${month.key}-r-${rowIdx}`} container columns={7} spacing={0.85}>
                      {Array.from({ length: 7 }).map((_, cellIdx) => {
                        const iso = row[cellIdx] ?? null;
                        const selectable = Boolean(iso && iso >= minDateIso && iso <= maxDateIso);
                        const selected = Boolean(iso && selectedSet.has(iso));

                        return (
                          <Grid key={`${month.key}-r-${rowIdx}-c-${cellIdx}`} size={1}>
                            {iso ? (
                              <ButtonBase
                                onClick={() => selectable && onToggleDate(iso)}
                                disabled={!selectable}
                                sx={{
                                  width: '100%',
                                  py: { xs: 1.15, md: 1.35 },
                                  minHeight: { xs: 52, md: 60 },
                                  borderRadius: '10px',
                                  border: selected ? '1px solid rgba(106,177,255,0.95)' : '1px solid rgba(120,170,230,0.25)',
                                  backgroundColor: selected ? 'rgba(44,119,220,0.3)' : 'rgba(11,24,48,0.55)',
                                  color: selectable ? '#e7f2ff' : 'rgba(146,168,196,0.45)',
                                  fontSize: { xs: '0.92rem', md: '1rem' },
                                  fontWeight: selected ? 800 : 600,
                                  transition: 'all 0.15s',
                                  '&:hover': selectable
                                    ? {
                                      borderColor: 'rgba(106,177,255,0.95)',
                                      backgroundColor: selected ? 'rgba(44,119,220,0.36)' : 'rgba(20,56,106,0.62)',
                                    }
                                    : undefined,
                                }}
                              >
                                {iso.slice(8)}
                              </ButtonBase>
                            ) : (
                              <Box sx={{ height: { xs: 52, md: 60 } }} />
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 2.2, pb: 1.8, gap: 1 }}>
        <ButtonBase
          onClick={onClose}
          sx={{
            px: 2.2,
            py: 0.95,
            borderRadius: '8px',
            border: '1px solid rgba(180,210,255,0.32)',
            color: '#c8deff',
            fontSize: '0.86rem',
            fontWeight: 600,
          }}
        >
          戻る
        </ButtonBase>
        <ButtonBase
          onClick={onConfirm}
          sx={{
            px: 2.6,
            py: 0.95,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a6eff 0%, #0a4fd4 100%)',
            color: '#fff',
            fontSize: '0.86rem',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(20,80,240,0.38)',
          }}
        >
          投稿する
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleCalendarDialog;
