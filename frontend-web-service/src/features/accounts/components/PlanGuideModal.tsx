import React from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { PLAN_DETAILS, PLAN_GUIDE_ORDER, PLAN_GUIDE_STYLE } from '../constants/accountsIssue.constants';

type PlanGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

const PlanGuideModal: React.FC<PlanGuideModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <Box
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
        <Box
          sx={{
            px: 1.4,
            py: 1,
            borderBottom: '1px solid rgba(127, 191, 241, 0.3)',
            background: 'linear-gradient(160deg, rgba(203, 232, 255, 0.14), rgba(113, 174, 228, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ color: '#eaf6ff', fontSize: '1rem', fontWeight: 900 }}>
            プラン内容
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#d6efff', border: '1px solid rgba(165, 210, 246, 0.42)', borderRadius: '9px' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ p: 1.4, maxHeight: '78dvh', overflowY: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.1, alignItems: 'stretch' }}>
            {PLAN_GUIDE_ORDER.map((plan) => {
              const detail = PLAN_DETAILS[plan];
              const visual = PLAN_GUIDE_STYLE[plan];
              return (
                <Box
                  key={`guide-${plan}`}
                  sx={{
                    position: 'relative',
                    borderRadius: '14px',
                    border: `2px solid ${visual.borderColor}`,
                    background: visual.cardGradient,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.34), 0 0 22px ${visual.glowColor} inset`,
                    p: 1.15,
                    minHeight: { xs: 300, md: 360 },
                    height: '100%',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(460px 180px at 88% -16%, rgba(255,255,255,0.16), transparent 42%)',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Chip
                      label={plan}
                      size="small"
                      sx={{
                        mb: 0.9,
                        background: 'rgba(255,255,255,0.12)',
                        color: visual.accentColor,
                        border: `1px solid ${visual.borderColor}`,
                        fontWeight: 800,
                        fontSize: '0.8rem',
                      }}
                    />

                    <Typography sx={{ color: '#f5fbff', fontSize: '1.06rem', fontWeight: 900, mb: 0.55 }}>
                      {detail.monthly}
                    </Typography>
                    <Typography sx={{ color: 'rgba(224, 241, 255, 0.88)', fontSize: '0.82rem', lineHeight: 1.58, mb: 0.8 }}>
                      {detail.outline}
                    </Typography>

                    <Box sx={{ display: 'grid', gap: 0.45, mt: 'auto' }}>
                      {detail.featureList.map((feature) => (
                        <Box key={`${plan}-${feature}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.35 }}>
                          <CheckIcon sx={{ fontSize: '0.9rem', color: visual.accentColor, mt: 0.2, flexShrink: 0 }} />
                          <Typography sx={{ color: 'rgba(211, 234, 253, 0.86)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlanGuideModal;
