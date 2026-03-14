import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  FiSave,
  FiSend,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import { postManagementApi } from '../hooks/usePostManagement';
import {
  ASSIST_NONE_VALUE,
  DEFAULT_APPLY_FIELDS,
  getPostQuickAssistSettings,
  type AssistFieldKey,
} from '../utils/postQuickAssistSettings';
import type { PostFormData, PreviewFormPayload, CalendarMonth } from '../types/postForm';
import { useFormValidation } from '../../../lib/useFormValidation';
import { postFormSchema } from '../../../lib/formSchemas';

const MAX_IMAGES = 10;
const DETAIL_MAX_LENGTH = 1200;
const POST_CREATE_FULLSCREEN_SCALE = 0.88;
const IMAGE_DRAG_SENSITIVITY = 0.6;
const IMAGE_BASE_OFFSET_LIMIT = 10;

const GLASS_BG = 'rgba(255,255,255,0.1)';
const GLASS_BORDER = '1px solid rgba(255,255,255,0.2)';
const NEON_SHADOW = '0 0 15px rgba(80,160,255,0.6)';

const CATEGORIES = [
  '食事', '体験', '買い物', 'イベント',
  'ライブ', '観光', '祭り', '温泉', '車',
];

type QuickAssistMode = 'replace' | 'append';

type PostCreateLocationState = {
  restoreForm?: PreviewFormPayload;
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

const QUICK_ASSIST_SETTINGS = getPostQuickAssistSettings();
const QUICK_ASSIST_TEMPLATES = QUICK_ASSIST_SETTINGS.templates;
const EVENT_TIME_TEMPLATES = QUICK_ASSIST_SETTINGS.eventTimes;
const BUDGET_TEMPLATES = QUICK_ASSIST_SETTINGS.budgets;
const ASSIST_FIELD_OPTIONS = QUICK_ASSIST_SETTINGS.fieldOptions;

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];
const clampZoom = (value: number): number => Math.max(0.4, Math.min(3.2, value));
const getImageOffsetLimit = (zoom: number): number => Math.min(50, IMAGE_BASE_OFFSET_LIMIT + Math.max(0, zoom - 1) * 50);
const clampImagePosition = (value: number, zoom: number): number => {
  const limit = getImageOffsetLimit(zoom);
  return Math.max(50 - limit, Math.min(50 + limit, value));
};
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
  onPositionChange: (index: number, positionX: number, positionY: number) => void;
  onZoomChange: (index: number, zoom: number) => void;
}> = ({ images, onAdd, onRemove, onPositionChange, onZoomChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const longPressTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    index: number;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    stageWidth: number;
    stageHeight: number;
  } | null>(null);

  const openFilePicker = () => {
    if (!inputRef.current) return;
    // Allow selecting the same file again by clearing previous value.
    inputRef.current.value = '';
    inputRef.current.click();
  };

  useEffect(() => {
    if (images.length === 0) {
      setSelectedIndex(0);
      return;
    }
    if (selectedIndex >= images.length) {
      setSelectedIndex(images.length - 1);
    }
  }, [images.length, selectedIndex]);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startDrag = (
    targetElement: HTMLDivElement,
    pointerId: number,
    clientX: number,
    clientY: number,
    index: number,
  ) => {
    const target = images[index];
    if (!target) return;
    dragStateRef.current = {
      pointerId,
      index,
      startX: clientX,
      startY: clientY,
      startPosX: target.positionX,
      startPosY: target.positionY,
      stageWidth: targetElement.getBoundingClientRect().width || 1,
      stageHeight: targetElement.getBoundingClientRect().height || 1,
    };
    targetElement.setPointerCapture(pointerId);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointerType = event.pointerType;
    const isLeftMouse = pointerType === 'mouse' && event.button === 0;
    const isRightMouse = pointerType === 'mouse' && event.button === 2;
    const isTouchLike = pointerType === 'touch' || pointerType === 'pen';
    if (!isLeftMouse && !isRightMouse && !isTouchLike) return;

    event.preventDefault();

    if (isLeftMouse || isRightMouse) {
      startDrag(event.currentTarget, event.pointerId, event.clientX, event.clientY, selectedIndex);
      return;
    }

    clearLongPressTimer();
    const { currentTarget, pointerId, clientX, clientY } = event;
    longPressTimerRef.current = window.setTimeout(() => {
      startDrag(currentTarget, pointerId, clientX, clientY, selectedIndex);
      longPressTimerRef.current = null;
    }, 260);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;

    event.preventDefault();
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    const target = images[state.index];
    if (!target) return;
    onPositionChange(
      state.index,
      clampImagePosition(state.startPosX + (dx / state.stageWidth) * 100 * IMAGE_DRAG_SENSITIVITY, target.zoom),
      clampImagePosition(state.startPosY + (dy / state.stageHeight) * 100 * IMAGE_DRAG_SENSITIVITY, target.zoom),
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    clearLongPressTimer();
    if (dragStateRef.current?.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragStateRef.current = null;
    }
  };

  const selectedImage = images[selectedIndex] ?? null;

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (!selectedImage) return;
    event.preventDefault();
    const nextZoom = clampZoom(selectedImage.zoom + (event.deltaY < 0 ? 0.08 : -0.08));
    onZoomChange(selectedIndex, nextZoom);
  };

  const handleRemove = (index: number) => {
    if (index < selectedIndex) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (index === selectedIndex && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
    onRemove(index);
  };

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65 }}>
          <FiImage size={13} style={{ color: 'rgba(228, 238, 252, 0.92)' }} />
          <Typography sx={{ color: 'rgba(228, 238, 252, 0.92)', fontSize: '0.75rem', fontWeight: 700 }}>
            {images.length} / {MAX_IMAGES} 枚
          </Typography>
        </Box>
        <ButtonBase
          onClick={openFilePicker}
          disabled={images.length >= MAX_IMAGES}
          sx={{
            minHeight: 36,
            px: 1.2,
            borderRadius: '8px',
            border: '1px solid rgba(243, 248, 255, 0.72)',
            backgroundColor: 'rgba(248, 252, 255, 0.1)',
            color: 'rgba(236, 246, 255, 0.95)',
            fontSize: '0.73rem',
            fontWeight: 700,
          }}
        >
          <FiUploadCloud size={14} style={{ marginRight: 6 }} />
          写真を追加
        </ButtonBase>
      </Box>

      <Box
        sx={{
          borderRadius: '12px',
          border: GLASS_BORDER,
          backgroundColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 0 10px rgba(80,160,255,0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          p: 1,
        }}
      >
        {selectedImage ? (
          <>
            <Box
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onWheel={handleWheel}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 460,
                mx: 'auto',
                borderRadius: 0,
                overflow: 'hidden',
                aspectRatio: '4 / 5',
                border: '1px solid rgba(186, 211, 242, 0.42)',
                touchAction: 'none',
                backgroundColor: '#0f1724',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translate(${selectedImage.positionX - 50}%, ${selectedImage.positionY - 50}%)`,
                }}
              >
                <Box
                  component="img"
                  src={selectedImage.preview}
                  alt={`editor-${selectedIndex}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: `scale(${selectedImage.zoom})`,
                    transformOrigin: 'center center',
                    display: 'block',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: { xs: '84%', md: '80%' },
                  aspectRatio: '4 / 5',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0, borderRadius: 0 }} />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: { xs: '8%', md: '10%' },
                  backgroundColor: 'rgba(8, 12, 19, 0.42)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: { xs: '8%', md: '10%' },
                  backgroundColor: 'rgba(8, 12, 19, 0.42)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: { xs: '8%', md: '10%' },
                  bottom: { xs: '8%', md: '10%' },
                  width: { xs: '8%', md: '10%' },
                  backgroundColor: 'rgba(8, 12, 19, 0.42)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: { xs: '8%', md: '10%' },
                  bottom: { xs: '8%', md: '10%' },
                  width: { xs: '8%', md: '10%' },
                  backgroundColor: 'rgba(8, 12, 19, 0.42)',
                  pointerEvents: 'none',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: { xs: '84%', md: '80%' },
                  aspectRatio: '4 / 5',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: 0,
                  border: '2px solid rgba(232, 242, 255, 0.9)',
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  left: 8,
                  bottom: 8,
                  px: 0.7,
                  py: 0.3,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(6, 18, 35, 0.62)',
                  color: '#eaf3ff',
                  fontSize: '0.67rem',
                  fontWeight: 700,
                }}
              >
                左ドラッグで移動 / ホイールで拡大縮小 / 右クリック長押しも可
              </Box>
            </Box>

            <Box sx={{ mt: 0.8, px: { xs: 0.2, md: 0.4 } }}>
              <Typography sx={{ color: 'rgba(218, 233, 252, 0.9)', fontSize: '0.7rem', mb: 0.35 }}>ズーム</Typography>
              <input
                type="range"
                min={0.4}
                max={3.2}
                step={0.01}
                value={selectedImage.zoom}
                onChange={(event) => onZoomChange(selectedIndex, Number(event.target.value))}
                style={{ width: '100%' }}
              />
              <Typography sx={{ mt: 0.65, display: 'block', color: 'rgba(208, 225, 248, 0.72)', fontSize: '0.68rem' }}>
                現在倍率: {selectedImage.zoom.toFixed(2)}x
              </Typography>
            </Box>

            <Box sx={{ mt: 1, display: 'flex', gap: 0.8, overflowX: 'auto', pb: 0.4 }}>
              {images.map((img, idx) => {
                const active = idx === selectedIndex;
                return (
                  <Box
                    key={`${img.preview}-${idx}`}
                    sx={{
                      position: 'relative',
                      width: 88,
                      height: 110,
                      flexShrink: 0,
                      borderRadius: 0,
                      overflow: 'hidden',
                      border: active ? '2px solid #8ec0ff' : '1px solid rgba(175, 199, 228, 0.44)',
                      boxShadow: active ? '0 0 0 2px rgba(67, 123, 191, 0.2)' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <Box
                      component="img"
                      src={img.preview}
                      alt={`thumb-${idx}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${img.positionX}% ${img.positionY}%`,
                        transform: `scale(${img.zoom})`,
                        transformOrigin: 'center center',
                      }}
                    />
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(idx);
                      }}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 19,
                        height: 19,
                        backgroundColor: 'rgba(0,0,0,0.66)',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'rgba(220,60,80,0.9)' },
                      }}
                    >
                      <FiX size={10} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          </>
        ) : (
          <ButtonBase
            onClick={openFilePicker}
            sx={{
              width: '100%',
              minHeight: 140,
              borderRadius: '10px',
              border: '1px dashed rgba(179, 205, 239, 0.55)',
              color: 'rgba(225, 238, 255, 0.88)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            画像を追加してください
          </ButtonBase>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          const { files } = e.currentTarget;
          if (files && files.length > 0) {
            onAdd(files);
          }
          e.currentTarget.value = '';
        }}
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

const PostCreateScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<PostFormData>(INITIAL_FORM);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedPostDates, setSelectedPostDates] = useState<string[]>([]);
  const [ticketConfirmOpen, setTicketConfirmOpen] = useState(false);
  const [hasToday, setHasToday] = useState(false);
  const [hasTomorrow, setHasTomorrow] = useState(false);
  const [immediateTicketCount, setImmediateTicketCount] = useState(0);
  const [assistTemplateKey, setAssistTemplateKey] = useState<string>(QUICK_ASSIST_TEMPLATES[0]?.key ?? '');
  const [assistEventTimeKey, setAssistEventTimeKey] = useState<string>(EVENT_TIME_TEMPLATES[0]?.key ?? '');
  const [assistBudgetKey, setAssistBudgetKey] = useState<string>(BUDGET_TEMPLATES[0]?.key ?? '');
  const [assistMode, setAssistMode] = useState<QuickAssistMode>('replace');
  const [assistApplyFields, setAssistApplyFields] = useState<AssistFieldKey[]>(DEFAULT_APPLY_FIELDS);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const { validate, clearError, firstError } = useFormValidation(postFormSchema);

  const todayIso = useMemo(() => toLocalIsoDate(new Date()), []);
  const maxSelectableIso = useMemo(() => addDays(todayIso, 30), [todayIso]);
  const selectableDates = useMemo(() => {
    const days: string[] = [];
    for (let i = 0; i <= 30; i += 1) {
      days.push(addDays(todayIso, i));
    }
    return days;
  }, [todayIso]);

  useEffect(() => {
    const restore = (location.state as PostCreateLocationState | null)?.restoreForm;
    if (!restore) return;

    const restoredImages = (restore.imageEdits?.length
      ? restore.imageEdits
      : restore.images.map((preview) => ({
        preview,
        positionX: 50,
        positionY: 50,
        zoom: 1,
      }))
    ).map((image, idx) => ({
      // Fileオブジェクトはプレビュー復元用のダミー。送信時はAPI実装側で扱いを決める。
      file: new File([''], `restored-${idx + 1}.txt`, { type: 'text/plain' }),
      preview: image.preview,
      positionX: clampImagePosition(image.positionX, clampZoom(image.zoom)),
      positionY: clampImagePosition(image.positionY, clampZoom(image.zoom)),
      zoom: clampZoom(image.zoom),
    }));

    setForm({
      title: restore.title,
      images: restoredImages,
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

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const setField = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (typeof key === 'string') clearError(key);
  };

  const handleApplyQuickAssist = () => {
    if (assistApplyFields.length === 0) {
      setSnackbar({ open: true, message: '反映する項目を1つ以上選択してください', severity: 'error' });
      return;
    }

    const needsPostTemplate = assistApplyFields.some((field) =>
      field === 'summary' || field === 'detail' || field === 'reservation',
    );
    const needsTimeTemplate = assistApplyFields.some((field) =>
      field === 'startTime' || field === 'endTime',
    );
    const needsBudgetTemplate = assistApplyFields.includes('budget');

    const template = QUICK_ASSIST_TEMPLATES.find((item) => item.key === assistTemplateKey);
    const eventTimeTemplate = EVENT_TIME_TEMPLATES.find((item) => item.key === assistEventTimeKey);
    const budgetTemplate = BUDGET_TEMPLATES.find((item) => item.key === assistBudgetKey);

    if (needsPostTemplate && !template) {
      setSnackbar({ open: true, message: '入力補助テンプレートを選択してください', severity: 'error' });
      return;
    }
    if (needsTimeTemplate && !eventTimeTemplate) {
      setSnackbar({ open: true, message: 'イベント時間テンプレートを選択してください', severity: 'error' });
      return;
    }
    if (needsBudgetTemplate && !budgetTemplate) {
      setSnackbar({ open: true, message: '予算テンプレートを選択してください', severity: 'error' });
      return;
    }

    setForm((prev) => {
      const shouldReplace = assistMode === 'replace';
      const nextStartTime = assistApplyFields.includes('startTime') && eventTimeTemplate
        ? (shouldReplace ? eventTimeTemplate.startTime : (prev.startTime || eventTimeTemplate.startTime))
        : prev.startTime;
      const nextEndTime = assistApplyFields.includes('endTime') && eventTimeTemplate
        ? (shouldReplace ? eventTimeTemplate.endTime : (prev.endTime || eventTimeTemplate.endTime))
        : prev.endTime;
      const nextBudget = assistApplyFields.includes('budget') && budgetTemplate
        ? (shouldReplace ? budgetTemplate.value : (prev.budget.trim() ? prev.budget : budgetTemplate.value))
        : prev.budget;

      const generatedDetail = template
        ? template.buildDetail({
          title: prev.title,
          category: prev.category,
          venueName: prev.venueName,
          address: prev.address,
          startTime: nextStartTime,
          endTime: nextEndTime,
          budget: nextBudget,
        }).trim()
        : prev.detail;

      const nextDetail = assistApplyFields.includes('detail')
        ? (assistMode === 'append' && prev.detail.trim()
          ? `${prev.detail.trim()}\n\n${generatedDetail}`
          : generatedDetail)
        : prev.detail;

      return {
        ...prev,
        summary: assistApplyFields.includes('summary')
          ? (template ? (shouldReplace ? template.summary : (prev.summary.trim() ? prev.summary : template.summary)) : prev.summary)
          : prev.summary,
        budget: nextBudget,
        startTime: nextStartTime,
        endTime: nextEndTime,
        detail: nextDetail,
        reservation: assistApplyFields.includes('reservation')
          ? (template
            ? (shouldReplace ? template.reservationHint : (prev.reservation.trim() ? prev.reservation : template.reservationHint))
            : prev.reservation)
          : prev.reservation,
      };
    });

    setSnackbar({
      open: true,
      message: assistMode === 'append' ? '入力補助を追記しました' : '入力補助を反映しました',
      severity: 'success',
    });
  };

  const handleClearAssistFields = () => {
    setAssistTemplateKey(ASSIST_NONE_VALUE);
    setAssistEventTimeKey(ASSIST_NONE_VALUE);
    setAssistBudgetKey(ASSIST_NONE_VALUE);
    setAssistApplyFields([]);
    setSnackbar({ open: true, message: '補助入力項目を --- にリセットしました', severity: 'info' });
  };

  const handleAddImages = (files: FileList) => {
    setForm((prev) => {
      const remaining = MAX_IMAGES - prev.images.length;
      if (remaining <= 0) return prev;

      const toAdd = Array.from(files).slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        positionX: 50,
        positionY: 50,
        zoom: 1,
      }));

      return { ...prev, images: [...prev.images, ...toAdd] };
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...form.images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setField('images', updated);
  };

  const handleChangeImagePosition = (index: number, positionX: number, positionY: number) => {
    setForm((prev) => {
      if (!prev.images[index]) return prev;
      const next = [...prev.images];
      const currentZoom = next[index].zoom;
      next[index] = {
        ...next[index],
        positionX: clampImagePosition(positionX, currentZoom),
        positionY: clampImagePosition(positionY, currentZoom),
      };
      return { ...prev, images: next };
    });
  };

  const handleChangeImageZoom = (index: number, zoom: number) => {
    setForm((prev) => {
      if (!prev.images[index]) return prev;
      const next = [...prev.images];
      const nextZoom = clampZoom(zoom);
      next[index] = {
        ...next[index],
        zoom: nextZoom,
        positionX: clampImagePosition(next[index].positionX, nextZoom),
        positionY: clampImagePosition(next[index].positionY, nextZoom),
      };
      return { ...prev, images: next };
    });
  };

  const handleSubmit = () => {
    const result = validate(form);
    if (!result.success) {
      setSnackbar({ open: true, message: firstError ?? 'エラーがあります', severity: 'error' });
      return;
    }
    setSelectedPostDates((prev) => (prev.length > 0 ? prev : [todayIso]));
    setScheduleOpen(true);
  };

  const handleDraft = () => {
    if (!form.title.trim()) {
      setSnackbar({ open: true, message: 'タイトルを入力してください', severity: 'error' });
      return;
    }

    const saved = postManagementApi.upsertPostDraft({
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
    });

    if (!saved) {
      setSnackbar({ open: true, message: '下書き保存に失敗しました', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: '下書きを保存しました', severity: 'info' });
  };

  const handleDraftList = () => {
    navigate('/posts/drafts');
  };

  const handlePreviewScreen = () => {
    const previewPayload: PreviewFormPayload = {
      title: form.title,
      images: form.images.map((img) => img.preview),
      imageEdits: form.images.map((img) => ({
        preview: img.preview,
        positionX: img.positionX,
        positionY: img.positionY,
        zoom: img.zoom,
      })),
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
        returnTo: '/posts/create',
      },
    });
  };

  const handleDiscard = () => {
    form.images.forEach((img) => URL.revokeObjectURL(img.preview));
    setForm(INITIAL_FORM);
    setDiscardOpen(false);
    navigate('/home');
  };

  const handleSaveAndExit = () => {
    if (!form.title.trim()) {
      setSnackbar({ open: true, message: '下書き保存にはタイトルが必要です', severity: 'error' });
      return;
    }

    const saved = postManagementApi.upsertPostDraft({
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
    });

    if (!saved) {
      setSnackbar({ open: true, message: '下書き保存に失敗しました', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: '下書きを保存しました', severity: 'info' });
    setDiscardOpen(false);
    setTimeout(() => navigate('/home'), 500);
  };

  const togglePostDate = (iso: string) => {
    setSelectedPostDates((prev) => (prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]));
  };

  const applyBulkSelect = (mode: 'all' | 'weekdays' | 'weekends' | 'clear') => {
    if (mode === 'clear') {
      setSelectedPostDates([]);
      return;
    }

    const picked = selectableDates.filter((iso) => {
      const weekday = parseLocalIsoDate(iso).getDay();
      if (mode === 'all') return true;
      if (mode === 'weekdays') return weekday >= 1 && weekday <= 5;
      return weekday === 0 || weekday === 6;
    });
    setSelectedPostDates(picked);
  };

  const confirmScheduledPost = async () => {
    if (selectedPostDates.length === 0) {
      setSnackbar({ open: true, message: '投稿日を1日以上選択してください', severity: 'error' });
      return;
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    setHasToday(selectedPostDates.includes(todayStr));
    setHasTomorrow(selectedPostDates.includes(tomorrowStr));
    setImmediateTicketCount(selectedPostDates.filter(d => d === todayStr || d === tomorrowStr).length);
    setTicketConfirmOpen(true);
  };

  const handleTicketConfirmCancel = () => {
    setTicketConfirmOpen(false);
  };

  const handleTicketConfirmOk = () => {
    setTicketConfirmOpen(false);
    setScheduleOpen(false);
    setSnackbar({ open: true, message: `${selectedPostDates.length}日分の投稿予定を保存しました`, severity: 'success' });
    setTimeout(() => navigate('/posts/scheduled'), 1000);
  };

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
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mb: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          タイトル
        </Typography>
        <Box sx={{ mt: 0.6 }}>
          <FieldLabel num={1} label="タイトル" />
          <DarkInput
            value={form.title}
            onChange={(v) => setField('title', v)}
            placeholder="イベントタイトルを入力"
            minHeight={56}
            fontSize="1.1rem"
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mb: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          写真アップロード
        </Typography>
        <Box sx={{ mt: 0.6 }}>
          <FieldLabel num={2} label={`画像（最大${MAX_IMAGES}枚）`} />
          <ImageUploadArea
            images={form.images}
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
            onPositionChange={handleChangeImagePosition}
            onZoomChange={handleChangeImageZoom}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
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
              onClick={() => setDiscardOpen(true)}
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

            <ButtonBase
              onClick={handleDraftList}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(120,170,240,0.35)',
                backgroundColor: 'rgba(70,120,200,0.08)',
                color: '#a8cfff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(70,120,200,0.18)' },
                minWidth: 112,
              }}
            >
              下書き一覧
            </ButtonBase>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ml: { xs: 0, md: 'auto' } }}>

            <ButtonBase
              onClick={handleDraft}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(100,200,150,0.4)',
                backgroundColor: 'rgba(30,160,100,0.1)',
                color: '#5dd8a0',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(30,160,100,0.18)' },
                minWidth: 120,
              }}
            >
              <FiSave size={14} />
              下書保存
            </ButtonBase>

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
              投稿する
            </ButtonBase>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mt: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          投稿内容の簡単入力補助
        </Typography>
        <Typography
          sx={{
            color: 'rgba(205,225,248,0.74)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            mt: 0.35,
          }}
        >
          複数選択した項目のみ反映するため、競合を避けながらテンプレート適用できます。解除項目も選択できます。
        </Typography>

        <Grid container spacing={0.8} sx={{ mt: 0.7 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              value={assistTemplateKey}
              onChange={(e) => setAssistTemplateKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '投稿テンプレ: ---';
                const selected = QUICK_ASSIST_TEMPLATES.find((t) => t.key === value);
                return selected ? selected.label : '投稿テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {QUICK_ASSIST_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  {template.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Select
              value={assistMode}
              onChange={(e) => setAssistMode(e.target.value as QuickAssistMode)}
              size="small"
              fullWidth
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value="replace" sx={{ color: '#e2eeff', fontSize: '0.82rem' }}>
                上書き
              </MenuItem>
              <MenuItem value="append" sx={{ color: '#e2eeff', fontSize: '0.82rem' }}>
                追記
              </MenuItem>
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              multiple
              value={assistApplyFields}
              onChange={(e) => setAssistApplyFields((e.target.value as AssistFieldKey[]) ?? [])}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                const values = selected as AssistFieldKey[];
                if (!values.length) return '反映項目: ---';
                return `反映: ${values.map((key) => ASSIST_FIELD_OPTIONS.find((o) => o.key === key)?.label ?? key).join(' / ')}`;
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              {ASSIST_FIELD_OPTIONS.map((option) => (
                <MenuItem
                  key={option.key}
                  value={option.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              value={assistEventTimeKey}
              onChange={(e) => setAssistEventTimeKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '時間テンプレ: ---';
                const selected = EVENT_TIME_TEMPLATES.find((t) => t.key === value);
                return selected ? `時間テンプレ: ${selected.label}（${selected.startTime} - ${selected.endTime}）` : '時間テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {EVENT_TIME_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  時間テンプレ: {template.label}（{template.startTime} - {template.endTime}）
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Select
              value={assistBudgetKey}
              onChange={(e) => setAssistBudgetKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '予算テンプレ: ---';
                const selected = BUDGET_TEMPLATES.find((t) => t.key === value);
                return selected ? `予算テンプレ: ${selected.label}` : '予算テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {BUDGET_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  予算テンプレ: {template.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ButtonBase
              onClick={handleClearAssistFields}
              sx={{
                width: '100%',
                height: 38,
                borderRadius: '8px',
                border: '1px solid rgba(255,170,170,0.45)',
                backgroundColor: 'rgba(170,60,60,0.18)',
                color: '#ffdede',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                '&:hover': { backgroundColor: 'rgba(170,60,60,0.28)' },
              }}
            >
              補助項目を解除
            </ButtonBase>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ButtonBase
              onClick={handleApplyQuickAssist}
              sx={{
                width: '100%',
                height: 38,
                borderRadius: '8px',
                border: '1px solid rgba(120,170,240,0.4)',
                backgroundColor: 'rgba(40,105,210,0.2)',
                color: '#d7e9ff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                '&:hover': { backgroundColor: 'rgba(40,105,210,0.3)' },
              }}
            >
              テンプレートを反映
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>

      <DiscardDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onDiscard={handleDiscard}
        onSaveAndExit={handleSaveAndExit}
      />
      <ScheduleCalendarDialog
        open={scheduleOpen}
        selectedDates={selectedPostDates}
        minDateIso={todayIso}
        maxDateIso={maxSelectableIso}
        onClose={() => setScheduleOpen(false)}
        onToggleDate={togglePostDate}
        onBulkSelect={applyBulkSelect}
        onConfirm={confirmScheduledPost}
      />

      <Dialog
        open={ticketConfirmOpen}
        onClose={handleTicketConfirmCancel}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #0a1428 0%, #0d1f3c 100%)',
            border: '1px solid rgba(130,170,230,0.32)',
            borderRadius: '14px',
            color: '#e8f2ff',
            maxWidth: 440,
            mx: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
            fontSize: '1rem',
            color: '#d8eaff',
            borderBottom: '1px solid rgba(100,150,255,0.18)',
            pb: 1.2,
          }}
        >
          <FiAlertTriangle size={18} color="#fbbf24" />
          チケット消費の確認
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1.5 }}>
          {(hasToday || hasTomorrow) ? (
            <>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {[hasToday && '本日', hasTomorrow && '明日'].filter(Boolean).join(', ')}の投稿になります。
              </Typography>
              <Typography sx={{ color: '#7dd4fc', fontSize: '1.1rem', fontWeight: 800, mt: 1 }}>
                {immediateTicketCount}枚消費
              </Typography>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7, mt: 0.5 }}>
                チケットを消費しますか？
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                選択された日付にチケッが消費されます。
              </Typography>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7, mt: 0.5 }}>
                よろしいですか？
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2.2, pb: 1.8, gap: 1 }}>
          <ButtonBase
            onClick={handleTicketConfirmCancel}
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
            キャンセル
          </ButtonBase>
          <ButtonBase
            onClick={handleTicketConfirmOk}
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
            OK
          </ButtonBase>
        </DialogActions>
      </Dialog>

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

export default PostCreateScreen;
