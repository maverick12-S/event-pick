import React, { useEffect, useRef, useState } from 'react';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import { FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import type { PostFormData } from '../types/postForm';
import {
  clampImagePosition,
  clampZoom,
  GLASS_BORDER,
  IMAGE_DRAG_SENSITIVITY,
} from '../utils/postCreateHelpers';

const ImageUploadArea: React.FC<{
  images: PostFormData['images'];
  maxImages: number;
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  onPositionChange: (index: number, positionX: number, positionY: number) => void;
  onZoomChange: (index: number, zoom: number) => void;
}> = ({ images, maxImages, onAdd, onRemove, onPositionChange, onZoomChange }) => {
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
            {images.length} / {maxImages} 枚
          </Typography>
        </Box>
        <ButtonBase
          onClick={openFilePicker}
          disabled={images.length >= maxImages}
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

export default ImageUploadArea;
