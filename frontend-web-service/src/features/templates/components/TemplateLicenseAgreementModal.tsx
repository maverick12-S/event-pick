/**
 * テンプレートライセンス承諾モーダル
 *
 * ─ ダークテーマ全面オーバーレイ (シアン系カラースキーム)
 * ─ スクロール可能な承諾書本文 (行種別スタイリング・テーブル grid)
 * ─ 3 つのチェックボックスすべて ON で「同意してダウンロード」有効
 * ─ 承諾ログを API 保存後、onDownloadReady を呼び出し元に委譲
 */
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

import {
  AGREEMENT_CHECKBOXES,
  AGREEMENT_VERSION,
  TEMPLATE_LICENSE_TEXT,
  type AgreementCheckKey,
} from '../constants/templateLicense';
import { useCreateAgreementLog } from '../hooks/useCreateAgreementLog';
import type { TemplateLicenseAgreementModalProps } from '../types/templateLicense';

// ─── コンポーネント ───

const TemplateLicenseAgreementModal: React.FC<TemplateLicenseAgreementModalProps> = ({
  open,
  onClose,
  templateId,
  companyId,
  userId,
  onDownloadReady,
}) => {
  const [checks, setChecks] = useState<Record<AgreementCheckKey, boolean>>({
    confirm: false,
    nonParty: false,
    internalOnly: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const createLogMutation = useCreateAgreementLog();

  const allChecked = Object.values(checks).every(Boolean);

  const handleCheck = (key: AgreementCheckKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecks((prev) => ({ ...prev, [key]: e.target.checked }));
  };

  const resetState = () => {
    setChecks({ confirm: false, nonParty: false, internalOnly: false });
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAgreeAndDownload = async () => {
    if (!allChecked || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await createLogMutation.mutateAsync({
        company_id: companyId,
        user_id: userId,
        agreement_type: 'TEMPLATE_LICENSE',
        agreement_version: AGREEMENT_VERSION,
        agreed_at: new Date().toISOString(),
        template_id: templateId,
        user_agent: navigator.userAgent,
      });
      onDownloadReady?.(templateId);
      resetState();
      onClose();
    } catch {
      setError('承諾記録の保存に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const termLines = TEMPLATE_LICENSE_TEXT.split('\n');

  return createPortal(
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="契約書ひな型 利用ライセンス承諾書"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal, 100)',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        backgroundColor: 'rgba(4, 12, 24, 0.56)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 980,
          borderRadius: '14px',
          border: '1px solid rgba(86, 213, 255, 0.7)',
          background: 'linear-gradient(180deg, rgba(15, 37, 65, 0.97), rgba(10, 28, 52, 0.98))',
          boxShadow: '0 0 0 1px rgba(77, 208, 255, 0.2), 0 14px 30px rgba(2, 14, 30, 0.62)',
          overflow: 'hidden',
        }}
      >
        {/* ── ヘッダー ── */}
        <Box
          sx={{
            px: 2,
            py: 1.4,
            borderBottom: '1px solid rgba(127, 191, 241, 0.3)',
            background: 'linear-gradient(160deg, rgba(203, 232, 255, 0.14), rgba(113, 174, 228, 0.08))',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography sx={{ color: '#eaf6ff', fontSize: '1rem', fontWeight: 900, lineHeight: 1.4 }}>
              契約書ひな型 利用ライセンス承諾書
            </Typography>
            <Typography sx={{ color: 'rgba(160, 210, 255, 0.65)', fontSize: '0.71rem', mt: 0.4, lineHeight: 1.55 }}>
              本承諾書は、間接提携企業が個人事業主との契約締結に用いるために提供される契約書ひな型の利用条件を定めるものです。
              <br />
              内容をご確認の上、下部のチェックボックスにすべて同意いただいた場合のみダウンロードが可能になります。
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: '#d6efff',
              border: '1px solid rgba(165, 210, 246, 0.42)',
              borderRadius: '9px',
            mt: 0.2,
          }}
        >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── 本文 + フッターのスクロールエリア ── */}
        <Box ref={scrollRef} sx={{ px: 2, py: 1.6, maxHeight: '78dvh', overflowY: 'auto' }}>
          <Box sx={{ display: 'grid', gap: 0.2 }}>
            {termLines.map((line, index) => {
              if (line.length === 0) {
                return <Box key={`blank-${index}`} sx={{ height: 8 }} aria-hidden />;
              }

              const isTitle      = index === 0;
              const isArticle    = /^第\d+条/.test(line);
              const isSubArticle = /^\d+-\d+\s/.test(line);
              const isTableRow   = line.includes('\t');
              const isPreamble   = !isTitle && !isArticle && index < 5;

              if (isTableRow) {
                const cells = line.split('\t');
                return (
                  <Box
                    key={`row-${index}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        cells.length === 2
                          ? 'minmax(140px, 0.55fr) minmax(0, 1.45fr)'
                          : 'repeat(3, minmax(0, 1fr))',
                      gap: 1.1,
                      py: 0.5,
                      px: 0.8,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(137, 190, 238, 0.08)',
                      border: '1px solid rgba(140, 190, 236, 0.2)',
                    }}
                  >
                    {cells.map((cell, ci) => (
                      <Typography
                        key={`cell-${index}-${ci}`}
                        sx={{
                          color: 'rgba(223, 242, 255, 0.9)',
                          fontSize: '0.79rem',
                          fontWeight: 500,
                          lineHeight: 1.65,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {cell}
                      </Typography>
                    ))}
                  </Box>
                );
              }

              return (
                <Typography
                  key={`line-${index}`}
                  sx={{
                    color: isTitle
                      ? '#7dd4fc'
                      : isArticle
                      ? '#f4fbff'
                      : isPreamble
                      ? 'rgba(210, 235, 255, 0.7)'
                      : 'rgba(219, 239, 255, 0.88)',
                    fontSize: isTitle
                      ? '1.05rem'
                      : isArticle
                      ? '0.93rem'
                      : isSubArticle
                      ? '0.84rem'
                      : '0.8rem',
                    fontWeight: isTitle ? 900 : isArticle ? 900 : isSubArticle ? 700 : 500,
                    lineHeight: isTitle ? 2.2 : isArticle ? 1.85 : 1.75,
                    letterSpacing: isTitle ? '0.04em' : isArticle ? '0.01em' : 'normal',
                    mt: isArticle ? 0.6 : 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {line}
                </Typography>
              );
            })}
          </Box>

        {/* ── 承諾フッター ── */}
        <Box
          sx={{
            px: 2,
            pt: 1.4,
            pb: 1.6,
            borderTop: '1px solid rgba(127, 191, 241, 0.22)',
            background: 'linear-gradient(160deg, rgba(10, 26, 50, 0.99), rgba(7, 20, 40, 0.99))',
          }}
        >
          {/* チェックボックス */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.55, mb: 1.4 }}>
            {AGREEMENT_CHECKBOXES.map(({ key, label }) => {
              const checked = checks[key];
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleCheck(key)}
                      size="small"
                      sx={{
                        color: 'rgba(100, 180, 240, 0.45)',
                        '&.Mui-checked': { color: '#56d5ff' },
                        py: 0.25,
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: checked
                          ? 'rgba(220, 245, 255, 0.95)'
                          : 'rgba(170, 210, 240, 0.55)',
                        fontSize: '0.79rem',
                        lineHeight: 1.55,
                        transition: 'color 0.15s',
                      }}
                    >
                      {label}
                    </Typography>
                  }
                  sx={{ mx: 0, alignItems: 'flex-start' }}
                />
              );
            })}
          </Box>

          {/* エラーメッセージ */}
          {error && (
            <Typography
              sx={{ color: '#ff8a8a', fontSize: '0.74rem', mb: 1, px: 0.5, lineHeight: 1.5 }}
            >
              ⚠ {error}
            </Typography>
          )}

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 1.2, justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* 未チェック時のガイドテキスト */}
            {!allChecked && (
              <Typography sx={{ color: 'rgba(140, 180, 215, 0.45)', fontSize: '0.72rem', mr: 'auto' }}>
                すべての項目にチェックするとダウンロードが有効になります
              </Typography>
            )}

            <Button
              onClick={handleClose}
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                color: 'rgba(180, 215, 240, 0.7)',
                borderColor: 'rgba(140, 190, 230, 0.35)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                px: 2,
                '&:hover': {
                  borderColor: 'rgba(140, 190, 230, 0.6)',
                  background: 'rgba(140, 190, 230, 0.05)',
                },
              }}
            >
              閉じる
            </Button>

            <Button
              onClick={handleAgreeAndDownload}
              disabled={!allChecked || isLoading}
              variant="contained"
              size="small"
              startIcon={
                isLoading
                  ? <CircularProgress size={13} color="inherit" />
                  : <DownloadIcon sx={{ fontSize: '1rem !important' }} />
              }
              sx={{
                background: allChecked
                  ? 'linear-gradient(135deg, #1a7fc4 0%, #0fa8e0 100%)'
                  : 'rgba(35, 60, 90, 0.55)',
                color: allChecked ? '#fff' : 'rgba(120, 165, 200, 0.45)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                px: 2.4,
                minWidth: 168,
                boxShadow: allChecked ? '0 2px 14px rgba(15, 168, 224, 0.28)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover:not(:disabled)': {
                  background: 'linear-gradient(135deg, #1e8ed4 0%, #12b8f0 100%)',
                  boxShadow: '0 4px 18px rgba(15, 168, 224, 0.4)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(35, 60, 90, 0.55)',
                  color: 'rgba(120, 165, 200, 0.4)',
                },
              }}
            >
              {isLoading ? '処理中...' : '同意してダウンロード'}
            </Button>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
};

export default TemplateLicenseAgreementModal;
