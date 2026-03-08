import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  FiAlertTriangle,
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiEye,
  FiImage,
  FiLink,
  FiMapPin,
  FiSend,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import postManagementMockApi from '../../../api/mock/postManagementMockApi';

const MAX_IMAGES = 10;
const DETAIL_MAX_LENGTH = 1200;
const POST_CREATE_SCALE = 1.62;

const GLASS_BG = 'rgba(255,255,255,0.1)';
const GLASS_BORDER = '1px solid rgba(255,255,255,0.2)';
const NEON_SHADOW = '0 0 15px rgba(80,160,255,0.6)';

const CATEGORIES = [
  '食事', '体験', '買い物', 'イベント',
  'ライブ', '観光', '祭り', '温泉', '車',
];

interface PostFormData {
  title: string;
  images: { file: File; preview: string }[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
}

type PreviewFormPayload = {
  title: string;
  images: string[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
};

type ScheduledEditLocationState = {
  restoreForm?: PreviewFormPayload;
  from?: 'posts' | 'reservations';
  restoreSelectedPostDates?: string[];
  restoreAutoPostEnabled?: boolean;
};

const INITIAL_FORM: PostFormData = {
  title: '',
  images: [],
  summary: '',
  detail: '',
  reservation: '',
  address: '',
  venueName: '',
  budget: '',
  startTime: '',
  endTime: '',
  category: '',
};

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

const toLocalIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseLocalIsoDate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const addDays = (iso: string, days: number): string => {
  const date = parseLocalIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toLocalIsoDate(date);
};

const FieldLabel: React.FC<{ num: number; label: string }> = ({ num, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65, mb: 0.5 }}>
    <Typography
      sx={{
        color: 'rgba(194,220,255,0.78)',
        fontSize: '0.86rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      {num}. {label}
    </Typography>
  </Box>
);

const DarkInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  type?: string;
  minHeight?: number;
  fontSize?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder, multiline = false, rows = 1, icon, type = 'text', minHeight = 44, fontSize = '0.9rem', maxLength }) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const handleContainerClick = () => {
    if (multiline || type !== 'time') return;

    const el = inputRef.current;
    if (!el) return;

    el.focus();
    if ('showPicker' in el && typeof (el as HTMLInputElement).showPicker === 'function') {
      (el as HTMLInputElement).showPicker();
    }
  };

  return (
    <Box
      onClick={handleContainerClick}
      sx={{
        display: 'flex',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 0.75,
        px: 1.5,
        py: multiline ? 1.25 : 0,
        minHeight: multiline ? 'auto' : minHeight,
        borderRadius: '12px',
        border: GLASS_BORDER,
        backgroundColor: GLASS_BG,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: NEON_SHADOW,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: !multiline && type === 'time' ? 'pointer' : 'text',
        '&:hover': {
          borderColor: 'rgba(98, 156, 230, 0.92)',
          boxShadow: '0 0 12px rgba(111,179,255,0.7)',
        },
        '&:focus-within': {
          borderColor: 'rgba(25, 56, 108, 0.98)',
          boxShadow: '0 0 14px rgba(80,160,255,0.66)',
        },
      }}
    >
      {icon && (
        <Box sx={{ color: 'rgba(216, 234, 255, 0.9)', flexShrink: 0, mt: multiline ? 0.35 : 0, fontSize: '0.95rem' }}>
          {icon}
        </Box>
      )}
      <Box
        ref={inputRef}
        component={multiline ? 'textarea' : 'input'}
        type={multiline ? undefined : type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(typeof maxLength === 'number' ? e.target.value.slice(0, maxLength) : e.target.value)
        }
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        maxLength={maxLength}
        sx={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: '#ffffff',
          fontSize,
          fontFamily: 'inherit',
          resize: multiline ? 'vertical' : 'none',
          lineHeight: 1.65,
          py: multiline ? 0 : 0,
          minHeight: multiline ? `${rows * 1.65 * 14}px` : 'auto',
          '&::placeholder': { color: 'rgba(221, 236, 255, 0.75)' },
          colorScheme: 'light',
          cursor: !multiline && type === 'time' ? 'pointer' : 'text',
        }}
      />
    </Box>
  );
};

const ImageUploadArea: React.FC<{
  images: PostFormData['images'];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}> = ({ images, onAdd, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const emptySlots = Math.max(0, Math.min(3, MAX_IMAGES - images.length));
  const showSlots = [...images, ...Array(emptySlots).fill(null)].slice(0, Math.max(3, images.length + 1 <= MAX_IMAGES ? images.length + 1 : images.length));

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {showSlots.map((img, idx) =>
          img ? (
            <Box
              key={idx}
              sx={{
                width: { xs: 120, sm: 140 },
                height: { xs: 94, sm: 110 },
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                border: GLASS_BORDER,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 0 10px rgba(80,160,255,0.6)',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={img.preview}
                alt={`upload-${idx}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(220,60,80,0.85)' },
                }}
                onClick={() => onRemove(idx)}
              >
                <FiX size={10} color="#fff" />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 3,
                  left: 4,
                  fontSize: '0.55rem',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 700,
                }}
              >
                {idx + 1}/{images.length}
              </Box>
            </Box>
          ) : (
            <ButtonBase
              key={`empty-${idx}`}
              onClick={() => inputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              sx={{
                width: { xs: 120, sm: 140 },
                height: { xs: 94, sm: 110 },
                borderRadius: '14px',
                border: GLASS_BORDER,
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 0 10px rgba(80,160,255,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.4,
                flexShrink: 0,
                transition: 'all 0.2s',
                '&:hover:not(:disabled)': {
                  border: '1px solid #6FB3FF',
                  boxShadow: '0 0 12px rgba(111,179,255,0.7)',
                },
                '&:disabled': { opacity: 0.4 },
              }}
            >
              <FiUploadCloud size={18} style={{ color: 'rgba(238,246,255,0.92)' }} />
              <Typography sx={{ color: 'rgba(238,246,255,0.95)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.01em' }}>
                Upload Image
              </Typography>
            </ButtonBase>
          ),
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
        <FiImage size={11} style={{ color: 'rgba(228, 238, 252, 0.92)' }} />
        <Typography sx={{ color: 'rgba(228, 238, 252, 0.92)', fontSize: '0.7rem', fontWeight: 600 }}>
          {images.length} / {MAX_IMAGES} 枚
        </Typography>
        {images.length < MAX_IMAGES && (
          <ButtonBase
            onClick={() => inputRef.current?.click()}
            sx={{
              px: 0.9,
              py: 0.25,
              borderRadius: '4px',
              border: '1px solid rgba(243, 248, 255, 0.72)',
              backgroundColor: 'rgba(248, 252, 255, 0.1)',
              color: 'rgba(236, 246, 255, 0.95)',
              fontSize: '0.68rem',
              fontWeight: 700,
              '&:hover': {
                borderColor: 'rgba(33, 69, 120, 0.86)',
                boxShadow: '0 0 0 2px rgba(35, 74, 128, 0.16)',
              },
            }}
          >
            + 追加
          </ButtonBase>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && onAdd(e.target.files)}
      />
    </Box>
  );
};

const CategorySelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <Select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    displayEmpty
    IconComponent={FiChevronDown}
    sx={{
      width: '100%',
      height: 44,
      borderRadius: '10px',
      backgroundColor: GLASS_BG,
      border: GLASS_BORDER,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: NEON_SHADOW,
      color: value ? '#f8fbff' : 'rgba(229, 239, 255, 0.72)',
      fontSize: '0.9rem',
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '& .MuiSelect-icon': { color: 'rgba(240, 247, 255, 0.82)', right: 10 },
      '&:hover': {
        borderColor: 'rgba(98, 156, 230, 0.92)',
        boxShadow: '0 0 12px rgba(111,179,255,0.7)',
      },
      '&.Mui-focused': {
        borderColor: 'rgba(25, 56, 108, 0.98)',
        boxShadow: '0 0 14px rgba(80,160,255,0.66)',
      },
      '& .MuiSelect-select': { py: 0 },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: '#10213e',
          border: '1px solid rgba(155, 183, 225, 0.42)',
          borderRadius: '8px',
          mt: 0.5,
        },
      },
    }}
  >
    <MenuItem value="" disabled sx={{ color: 'rgba(140,170,220,0.5)', fontSize: '0.88rem' }}>
      カテゴリーを選択
    </MenuItem>
    {CATEGORIES.map((cat) => (
      <MenuItem
        key={cat}
        value={cat}
        sx={{
          color: '#e2eeff',
          fontSize: '0.88rem',
          '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(43, 83, 143, 0.32)',
            color: '#d2e7ff',
            '&:hover': { backgroundColor: 'rgba(43, 83, 143, 0.38)' },
          },
        }}
      >
        {cat}
      </MenuItem>
    ))}
  </Select>
);

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

type CalendarMonth = {
  key: string;
  label: string;
  rows: Array<Array<string | null>>;
};

const buildCalendarMonths = (startIso: string, endIso: string): CalendarMonth[] => {
  const start = parseLocalIsoDate(startIso);
  const end = parseLocalIsoDate(endIso);
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const months: CalendarMonth[] = [];

  while (cursor <= end) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<string | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(toLocalIsoDate(new Date(year, month, day)));
    }

    const rows: Array<Array<string | null>> = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    months.push({
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: `${year}年${month + 1}月`,
      rows,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};

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
            土日祝風（週末）
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
          選択日で投稿する
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
};

const ScheduledPostEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id = '' } = useParams<{ id: string }>();
  const [form, setForm] = useState<PostFormData>(INITIAL_FORM);
  const [selectedPostDates, setSelectedPostDates] = useState<string[]>([]);
  const [autoPostEnabled, setAutoPostEnabled] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [editSource, setEditSource] = useState<'posts' | 'reservations'>(
    (location.state as ScheduledEditLocationState | null)?.from === 'posts' ? 'posts' : 'reservations',
  );
  const isAccountPostsEdit = editSource === 'posts';
  const backTo = editSource === 'posts' ? '/posts/scheduled?view=posts' : '/posts/scheduled?view=reservations';

  const scheduledPost = useMemo(() => postManagementMockApi.findScheduledPostById(id), [id]);
  const todayIso = useMemo(() => toLocalIsoDate(new Date()), []);
  const maxSelectableIso = useMemo(() => addDays(todayIso, 30), [todayIso]);
  const calendarMonths = useMemo(() => buildCalendarMonths(todayIso, maxSelectableIso), [todayIso, maxSelectableIso]);

  const togglePostDate = (iso: string) => {
    setSelectedPostDates((prev) => (prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]));
  };

  const applyBulkSelect = (mode: 'all' | 'weekdays' | 'weekends' | 'clear') => {
    if (mode === 'clear') {
      setSelectedPostDates([]);
      return;
    }

    const selectableDates: string[] = [];
    for (let i = 0; i <= 30; i += 1) {
      selectableDates.push(addDays(todayIso, i));
    }

    const picked = selectableDates.filter((iso) => {
      const weekday = parseLocalIsoDate(iso).getDay();
      if (mode === 'all') return true;
      if (mode === 'weekdays') return weekday >= 1 && weekday <= 5;
      return weekday === 0 || weekday === 6;
    });
    setSelectedPostDates(picked);
  };

  useEffect(() => {
    const from = (location.state as ScheduledEditLocationState | null)?.from;
    if (from === 'posts' || from === 'reservations') {
      setEditSource(from);
    }

    const restore = (location.state as ScheduledEditLocationState | null)?.restoreForm;
    const restoreSelectedDates = (location.state as ScheduledEditLocationState | null)?.restoreSelectedPostDates;
    const restoreAutoPostEnabled = (location.state as ScheduledEditLocationState | null)?.restoreAutoPostEnabled;
    if (restore) {
      setForm({
        title: restore.title,
        images: restore.images.map((preview, idx) => ({
          file: new File([''], `restored-${idx + 1}.txt`, { type: 'text/plain' }),
          preview,
        })),
        summary: restore.summary,
        detail: restore.detail,
        reservation: restore.reservation,
        address: restore.address,
        venueName: restore.venueName,
        budget: restore.budget,
        startTime: restore.startTime,
        endTime: restore.endTime,
        category: restore.category,
      });
      setSelectedPostDates(Array.isArray(restoreSelectedDates) ? restoreSelectedDates : []);
      setAutoPostEnabled(typeof restoreAutoPostEnabled === 'boolean' ? restoreAutoPostEnabled : true);
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (!scheduledPost) return;

    const [startTime = '', endTime = ''] = scheduledPost.timeLabel.split('-');
    setForm({
      title: scheduledPost.title,
      images: [{
        file: new File([''], `scheduled-${scheduledPost.id}.txt`, { type: 'text/plain' }),
        preview: scheduledPost.imageUrl,
      }],
      summary: scheduledPost.description,
      detail: scheduledPost.description,
      reservation: 'https://www.google.com/',
      address: scheduledPost.ward,
      venueName: scheduledPost.venue,
      budget: '',
      startTime,
      endTime,
      category: scheduledPost.category,
    });
    setSelectedPostDates(scheduledPost.nextPostDate ? [scheduledPost.nextPostDate] : []);
    setAutoPostEnabled(scheduledPost.condition.autoPost);
  }, [location.pathname, location.state, navigate, scheduledPost]);

  const setField = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleAddImages = (files: FileList) => {
    const remaining = MAX_IMAGES - form.images.length;
    const toAdd = Array.from(files).slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setField('images', [...form.images, ...toAdd]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...form.images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setField('images', updated);
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return 'タイトルを入力してください';
    if (!form.category) return 'カテゴリーを選択してください';
    if (!form.summary.trim()) return '説明概要を入力してください';
    return null;
  };

  const handleSubmit = () => {
    if (!scheduledPost) {
      setSnackbar({ open: true, message: '編集対象が見つかりません', severity: 'error' });
      return;
    }

    const error = validate();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }

    const sortedSelectedDates = [...selectedPostDates].sort((a, b) => a.localeCompare(b));
    if (!isAccountPostsEdit && sortedSelectedDates.length === 0) {
      setSnackbar({ open: true, message: '投稿日を1日以上選択してください', severity: 'error' });
      return;
    }

    const updated = postManagementMockApi.updateScheduledPostById(scheduledPost.id, {
      title: form.title,
      ward: form.address,
      venue: form.venueName,
      category: form.category,
      description: form.summary,
      timeLabel: `${form.startTime || '00:00'}-${form.endTime || '00:00'}`,
      nextPostDate: isAccountPostsEdit ? scheduledPost.nextPostDate : (sortedSelectedDates[0] || scheduledPost.nextPostDate),
      condition: {
        autoPost: isAccountPostsEdit ? scheduledPost.condition.autoPost : autoPostEnabled,
      },
    });

    if (!updated) {
      setSnackbar({ open: true, message: '編集の保存に失敗しました', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: '編集が完了しました', severity: 'success' });
    setTimeout(() => navigate(backTo), 600);
  };

  const handlePreviewScreen = () => {
    const previewPayload: PreviewFormPayload = {
      title: form.title,
      images: form.images.map((img) => img.preview),
      summary: form.summary,
      detail: form.detail,
      reservation: form.reservation,
      address: form.address,
      venueName: form.venueName,
      budget: form.budget,
      startTime: form.startTime,
      endTime: form.endTime,
      category: form.category,
    };

    navigate('/posts/preview', {
      state: {
        previewForm: previewPayload,
        returnTo: `/posts/scheduled/edit/${id}`,
        from: editSource,
        restoreSelectedPostDates: selectedPostDates,
        restoreAutoPostEnabled: autoPostEnabled,
      },
    });
  };

  if (!scheduledPost) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Typography sx={{ color: '#eef6ff' }}>編集対象が見つかりません</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px))',
        mt: { xs: 1.35, md: 1.9 },
        px: { xs: 0.75, sm: 1.1, md: 1.35 },
        py: { xs: 1.2, md: 1.35 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          borderRadius: { xs: '14px', md: '16px' },
          border: '1px solid rgba(255,255,255,0.22)',
          background:
            'linear-gradient(135deg, #03060d 0%, #070d1a 46%, #02050b 100%)',
          boxShadow: '0 0 15px rgba(80,160,255,0.35), inset 0 1px 0 rgba(255,255,255,0.16)',
          backdropFilter: 'blur(14px) saturate(118%)',
          WebkitBackdropFilter: 'blur(14px) saturate(118%)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: { xs: 1.25, md: 1.65 } }}>
          <Grid container spacing={{ xs: 1.35, md: 1.6 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
                <Box>
                  <FieldLabel num={1} label="タイトル" />
                  <DarkInput
                    value={form.title}
                    onChange={(v) => setField('title', v)}
                    placeholder="イベントタイトルを入力"
                    minHeight={56}
                    fontSize="1.35rem"
                  />
                </Box>

                <Box>
                  <FieldLabel num={2} label={`画像（最大${MAX_IMAGES}枚）`} />
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      border: GLASS_BORDER,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      boxShadow: '0 0 10px rgba(80,160,255,0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <ImageUploadArea
                      images={form.images}
                      onAdd={handleAddImages}
                      onRemove={handleRemoveImage}
                    />
                  </Box>
                </Box>

                <Box>
                  <FieldLabel num={3} label="説明概要" />
                  <DarkInput
                    value={form.summary}
                    onChange={(v) => setField('summary', v)}
                    placeholder="イベントの概要を入力してください"
                    multiline
                    rows={3}
                  />
                </Box>

                <Box>
                  <FieldLabel num={5} label="予約欄" />
                  <DarkInput
                    value={form.reservation}
                    onChange={(v) => setField('reservation', v)}
                    placeholder="予約サイトURL: https://... or 事前予約不要"
                    icon={<FiLink />}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
                <Box>
                  <FieldLabel num={4} label="詳細説明" />
                  <DarkInput
                    value={form.detail}
                    onChange={(v) => setField('detail', v)}
                    placeholder={`【イベント詳細】\n日程: 2026年○月○日（土）14:30 - 21:00\n場所: \n入場料: \n出演アーティスト:\n\n【注意事項】`}
                    multiline
                    rows={5}
                    maxLength={DETAIL_MAX_LENGTH}
                  />
                  <Typography
                    sx={{
                      mt: 0.5,
                      textAlign: 'right',
                      color: 'rgba(205,225,248,0.72)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {form.detail.length} / {DETAIL_MAX_LENGTH}（空白・改行を含む）
                  </Typography>
                </Box>

                <Box>
                  <FieldLabel num={6} label="住所欄" />
                  <DarkInput
                    value={form.address}
                    onChange={(v) => setField('address', v)}
                    placeholder="EventPick公園, 東京都渋谷区神南1丁目"
                    icon={<FiMapPin />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={7} label="会場名" />
                  <DarkInput
                    value={form.venueName}
                    onChange={(v) => setField('venueName', v)}
                    placeholder="会場名を入力（例: EventPickホールA）"
                    icon={<FiMapPin />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={8} label="イベント開始時間と終了時間" />
                  <Grid container spacing={1.5}>
                    <Grid size={6}>
                      <Typography
                        sx={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.72rem', mb: 0.5 }}
                      >
                        開始時間
                      </Typography>
                      <DarkInput
                        value={form.startTime}
                        onChange={(v) => setField('startTime', v)}
                        placeholder="14:30"
                        icon={<FiClock />}
                        type="time"
                      />
                    </Grid>
                    <Grid size={6}>
                      <Typography
                        sx={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.72rem', mb: 0.5 }}
                      >
                        終了時間
                      </Typography>
                      <DarkInput
                        value={form.endTime}
                        onChange={(v) => setField('endTime', v)}
                        placeholder="21:00"
                        icon={<FiClock />}
                        type="time"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <FieldLabel num={9} label="予算" />
                  <DarkInput
                    value={form.budget}
                    onChange={(v) => setField('budget', v)}
                    placeholder="例: 無料 / ¥1,000〜¥3,000"
                    icon={<FiDollarSign />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={10} label="カテゴリー" />
                  <CategorySelect
                    value={form.category}
                    onChange={(v) => setField('category', v)}
                  />
                </Box>

              </Box>
            </Grid>
          </Grid>

          {!isAccountPostsEdit && (
          <Box sx={{ mt: 1.2 }}>
            <FieldLabel num={11} label="投稿予約設定" />
            <Box
              sx={{
                p: 1.2,
                borderRadius: '10px',
                border: GLASS_BORDER,
                backgroundColor: 'rgba(255,255,255,0.06)',
                boxShadow: '0 0 10px rgba(80,160,255,0.35)',
              }}
            >
              <Grid container spacing={1.2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography sx={{ color: 'rgba(180,210,250,0.78)', fontSize: '0.76rem', mb: 0.5 }}>
                    投稿日カレンダー（今日から1カ月）
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 0.7 }}>
                    <ButtonBase
                      onClick={() => applyBulkSelect('all')}
                      sx={{ px: 1.1, py: 0.4, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      すべて選択
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => applyBulkSelect('weekdays')}
                      sx={{ px: 1.1, py: 0.4, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      平日のみ
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => applyBulkSelect('weekends')}
                      sx={{ px: 1.1, py: 0.4, borderRadius: '999px', border: '1px solid rgba(120,170,240,0.45)', color: '#b9d7ff', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      週末のみ
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => applyBulkSelect('clear')}
                      sx={{ px: 1.1, py: 0.4, borderRadius: '999px', border: '1px solid rgba(190,210,235,0.35)', color: '#c6d9f5', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      解除
                    </ButtonBase>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.65, maxHeight: 310, overflowY: 'auto', pr: 0.2 }}>
                    {calendarMonths.map((month) => (
                      <Box
                        key={month.key}
                        sx={{
                          borderRadius: '10px',
                          border: '1px solid rgba(120,170,230,0.25)',
                          backgroundColor: 'rgba(11,24,48,0.48)',
                          p: 0.9,
                        }}
                      >
                        <Typography sx={{ color: '#d7e9ff', fontSize: '0.92rem', fontWeight: 800, mb: 0.8 }}>
                          {month.label}
                        </Typography>

                        <Grid container columns={7} spacing={0.55} sx={{ mb: 0.55 }}>
                          {WEEKDAY_JA.map((w) => (
                            <Grid key={`${month.key}-${w}`} size={1}>
                              <Typography sx={{ textAlign: 'center', color: 'rgba(170,200,240,0.65)', fontSize: '0.72rem', fontWeight: 700 }}>
                                {w}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.55 }}>
                          {month.rows.map((row, rowIdx) => (
                            <Grid key={`${month.key}-r-${rowIdx}`} container columns={7} spacing={0.55}>
                              {Array.from({ length: 7 }).map((_, cellIdx) => {
                                const iso = row[cellIdx] ?? null;
                                const selectable = Boolean(iso && iso >= todayIso && iso <= maxSelectableIso);
                                const selected = Boolean(iso && selectedPostDates.includes(iso));
                                return (
                                  <Grid key={`${month.key}-r-${rowIdx}-c-${cellIdx}`} size={1}>
                                    {iso ? (
                                      <ButtonBase
                                        onClick={() => selectable && togglePostDate(iso)}
                                        disabled={!selectable}
                                        sx={{
                                          width: '100%',
                                          minHeight: 38,
                                          borderRadius: '8px',
                                          border: selected ? '1px solid rgba(106,177,255,0.95)' : '1px solid rgba(120,170,230,0.25)',
                                          backgroundColor: selected ? 'rgba(44,119,220,0.3)' : 'rgba(11,24,48,0.55)',
                                          color: selectable ? '#e7f2ff' : 'rgba(146,168,196,0.45)',
                                          fontSize: '0.83rem',
                                          fontWeight: selected ? 800 : 600,
                                        }}
                                      >
                                        {iso.slice(8)}
                                      </ButtonBase>
                                    ) : (
                                      <Box sx={{ minHeight: 38 }} />
                                    )}
                                  </Grid>
                                );
                              })}
                            </Grid>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ color: 'rgba(180,210,250,0.78)', fontSize: '0.76rem', mb: 0.5 }}>
                    自動投稿予約
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.6 }}>
                    <ButtonBase
                      onClick={() => setAutoPostEnabled(true)}
                      sx={{
                        flex: 1,
                        minHeight: 38,
                        borderRadius: '8px',
                        border: autoPostEnabled ? '1px solid rgba(100,220,170,0.7)' : '1px solid rgba(120,170,230,0.25)',
                        backgroundColor: autoPostEnabled ? 'rgba(40,170,110,0.22)' : 'rgba(11,24,48,0.55)',
                        color: autoPostEnabled ? '#6ef0b1' : '#c8deff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      開始
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => setAutoPostEnabled(false)}
                      sx={{
                        flex: 1,
                        minHeight: 38,
                        borderRadius: '8px',
                        border: !autoPostEnabled ? '1px solid rgba(235,97,131,0.7)' : '1px solid rgba(120,170,230,0.25)',
                        backgroundColor: !autoPostEnabled ? 'rgba(190,66,98,0.22)' : 'rgba(11,24,48,0.55)',
                        color: !autoPostEnabled ? '#ff9db6' : '#c8deff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      停止
                    </ButtonBase>
                  </Box>

                  <Typography sx={{ mt: 0.85, color: 'rgba(200,220,245,0.72)', fontSize: '0.76rem' }}>
                    選択中の日付: {selectedPostDates.length > 0 ? selectedPostDates.join(' / ') : '未選択'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          )}
        </Box>

        <Box
          sx={{
            px: { xs: 1.75, md: 2.25 },
            py: { xs: 1.2, md: 1.35 },
            borderTop: '1px solid rgba(100,150,220,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            background: 'rgba(10,22,46,0.4)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <ButtonBase
              onClick={() => navigate(backTo)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(180,210,255,0.28)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#c8deff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                minWidth: 112,
              }}
            >
              キャンセル
            </ButtonBase>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ml: { xs: 0, md: 'auto' } }}>

            <ButtonBase
              onClick={handlePreviewScreen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(100,160,255,0.35)',
                backgroundColor: 'rgba(60,120,255,0.06)',
                color: '#7eb8ff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(60,120,255,0.14)' },
                minWidth: 112,
              }}
            >
              <FiEye size={14} />
              プレビュー
            </ButtonBase>

            <ButtonBase
              onClick={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2.5,
                py: 1,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1a6eff 0%, #0a4fd4 100%)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(20,80,240,0.4)',
                transition: 'all 0.18s',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(20,80,240,0.5)',
                },
                minWidth: 132,
              }}
            >
              <FiSend size={14} />
              編集完了
            </ButtonBase>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{
            backgroundColor:
              snackbar.severity === 'success'
                ? 'rgba(20,120,70,0.95)'
                : snackbar.severity === 'error'
                  ? 'rgba(180,40,60,0.95)'
                  : 'rgba(30,80,180,0.95)',
            color: '#fff',
            borderRadius: '8px',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduledPostEditScreen;
