/**
 * 利用規約承諾モーダル
 *
 * ログイン後に利用規約への同意を求める全画面モーダル。
 * 表示形式は TemplateLicenseAgreementModal と同一のダークテーマオーバーレイ。
 * 利用規約テキストは TermsOfServiceModal と共有。
 */
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { TERMS_OF_SERVICE_TEXT } from './TermsOfServiceModal';

type TermsAcceptanceModalProps = {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

const termLines = TERMS_OF_SERVICE_TEXT.split('\n');

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  open,
  onAccept,
  onDecline,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return createPortal(
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="利用規約の承諾"
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
          background:
            'linear-gradient(180deg, rgba(15, 37, 65, 0.97), rgba(10, 28, 52, 0.98))',
          boxShadow:
            '0 0 0 1px rgba(77, 208, 255, 0.2), 0 14px 30px rgba(2, 14, 30, 0.62)',
          overflow: 'hidden',
        }}
      >
        {/* ── ヘッダー ── */}
        <Box
          sx={{
            px: 2,
            py: 1.4,
            borderBottom: '1px solid rgba(127, 191, 241, 0.3)',
            background:
              'linear-gradient(160deg, rgba(203, 232, 255, 0.14), rgba(113, 174, 228, 0.08))',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{ color: '#eaf6ff', fontSize: '1rem', fontWeight: 900, lineHeight: 1.4 }}
            >
              利用規約の承諾
            </Typography>
            <Typography
              sx={{
                color: 'rgba(160, 210, 255, 0.65)',
                fontSize: '0.71rem',
                mt: 0.4,
                lineHeight: 1.55,
              }}
            >
              本サービスをご利用いただくには、以下の利用規約に同意していただく必要があります。
              <br />
              内容をご確認の上、「同意する」ボタンを押してください。同意いただけない場合はログアウトとなります。
            </Typography>
          </Box>
          <IconButton
            onClick={onDecline}
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
          {/* 規約本文（TermsOfServiceModal と同一のレンダリング） */}
          <Box sx={{ display: 'grid', gap: 0.2 }}>
            {termLines.map((line, index) => {
              const isBlank = line.length === 0;
              const isArticle = /^第\d+条/.test(line);
              const isSubArticle = /^\d+-\d+\s/.test(line);
              const isTableRow = line.includes('\t');
              const isSectionLabel = /^【.+】$/.test(line);

              if (isBlank) {
                return <Box key={`blank-${index}`} sx={{ height: 8 }} aria-hidden />;
              }

              if (isTableRow) {
                const cells = line.split('\t');
                return (
                  <Box
                    key={`row-${index}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        cells.length === 2
                          ? 'minmax(140px, 0.6fr) minmax(0, 1.4fr)'
                          : 'repeat(3, minmax(0, 1fr))',
                      gap: 1.1,
                      py: 0.45,
                      px: 0.7,
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
                          fontWeight:
                            index > 0 && termLines[index - 1].startsWith('用語') ? 700 : 500,
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

              if (isSectionLabel) {
                return (
                  <Typography
                    key={`label-${index}`}
                    sx={{
                      color: 'rgba(130, 200, 255, 0.95)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      lineHeight: 1.8,
                      mt: 0.5,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {line}
                  </Typography>
                );
              }

              return (
                <Typography
                  key={`line-${index}`}
                  sx={{
                    color: isArticle ? '#f4fbff' : 'rgba(219, 239, 255, 0.9)',
                    fontSize: isArticle ? '0.93rem' : isSubArticle ? '0.84rem' : '0.8rem',
                    fontWeight: isArticle ? 900 : isSubArticle ? 700 : 500,
                    lineHeight: isArticle ? 1.8 : 1.75,
                    letterSpacing: isArticle ? '0.01em' : 'normal',
                    mt: isArticle ? 0.5 : 0,
                    whiteSpace: 'pre-wrap',
                    pl: isSubArticle ? 0.2 : 0,
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
              mt: 1.2,
              borderTop: '1px solid rgba(127, 191, 241, 0.22)',
              background:
                'linear-gradient(160deg, rgba(10, 26, 50, 0.99), rgba(7, 20, 40, 0.99))',
            }}
          >
            <Box
              sx={{ display: 'flex', gap: 1.2, justifyContent: 'flex-end', alignItems: 'center' }}
            >
              <Typography
                sx={{ color: 'rgba(140, 180, 215, 0.45)', fontSize: '0.72rem', mr: 'auto' }}
              >
                同意しない場合はログアウトされます
              </Typography>

              <Button
                onClick={onDecline}
                variant="outlined"
                size="small"
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
                同意しない
              </Button>

              <Button
                onClick={onAccept}
                variant="contained"
                size="small"
                startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  background: 'linear-gradient(135deg, #1a7fc4 0%, #0fa8e0 100%)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  px: 2.4,
                  minWidth: 148,
                  boxShadow: '0 2px 14px rgba(15, 168, 224, 0.28)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e8ed4 0%, #12b8f0 100%)',
                    boxShadow: '0 4px 18px rgba(15, 168, 224, 0.4)',
                  },
                }}
              >
                同意する
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
};

export default TermsAcceptanceModal;
