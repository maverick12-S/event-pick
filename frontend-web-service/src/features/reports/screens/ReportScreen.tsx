import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  CircularProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { FiCalendar, FiChevronDown, FiEye, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import useReportsMock from '../hooks/useReportsMock';
import type { ReportSortKey } from '../../../types/models/report';
import useReportAggregateSummary from '../hooks/useReportAggregateSummary';
import ReportSummaryPanel from '../components/ReportSummaryPanel';
import {
  accountIdRowCardSx,
  bodyCellSx,
  controlCardSx,
  controlInputSx,
  dateBodyCellSx,
  dateHeadCellSx,
  datePickerIconWrapSx,
  datePickerLabelSx,
  datePickerTriggerSx,
  datePickerValueSx,
  detailBodyCellSx,
  detailHeadCellSx,
  hiddenDateInputSx,
  metricBodyCellSx,
  metricHeadCellSx,
  summaryBodyCellSx,
  summaryHeadCellSx,
  titleBodyCellSx,
  titleHeadCellSx,
} from '../styles/reportScreen.styles';

const SORT_OPTIONS: Array<{ value: ReportSortKey; label: string }> = [
  { value: 'postedAtDesc', label: '投稿日が新しい順' },
  { value: 'postedAtAsc', label: '投稿日が古い順' },
  { value: 'viewsDesc', label: '閲覧数が多い順' },
  { value: 'likesDesc', label: 'いいね数が多い順' },
  { value: 'titleAsc', label: 'タイトル順' },
];

const toDateLabel = (value: string) => value.replaceAll('-', '.');
const formatDateLabel = (value: string, fallback = '指定日') => (value ? value.replaceAll('-', '.') : fallback);

const ReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 実API連携前の暫定判定: 親拠点系のrealmのみ拠点ID検索を表示。
  const isParentAccount = useMemo(() => {
    const realm = (user?.realm ?? '').toLowerCase();
    return realm.includes('parent') || realm.includes('admin') || realm.includes('hq') || realm.includes('mock');
  }, [user?.realm]);

  const [accountId, setAccountId] = useState('');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-02-16');
  const [sortBy, setSortBy] = useState<ReportSortKey>('postedAtDesc');
  const fromDateInputRef = useRef<HTMLInputElement | null>(null);
  const toDateInputRef = useRef<HTMLInputElement | null>(null);

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const input = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  const reportQuery = useReportsMock({
    from: fromDate,
    to: toDate,
    accountId: isParentAccount ? accountId : undefined,
    sortBy,
  });

  const rows = reportQuery.data ?? [];

  const summary = useReportAggregateSummary(rows);

  const onSortChange = (event: SelectChangeEvent<ReportSortKey>) => {
    setSortBy(event.target.value as ReportSortKey);
  };

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        width: '100%',
        px: { xs: 2.2, sm: 3.2, lg: 4.8 },
        pb: { xs: 4.2, md: 6.2 },
        pt: { xs: 2.2, md: 3.2 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1960, mx: 'auto' }}>
        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            color: '#f3f8ff',
            fontSize: { xs: '2.4rem', md: '3.1rem' },
            fontWeight: 700,
            letterSpacing: '0.05em',
            textShadow: '0 8px 18px rgba(4, 10, 26, 0.5)',
            mb: { xs: 1.8, md: 2.4 },
            mt: { xs: 0.25, md: 0.1 },
          }}
        >
          レポート
        </Typography>

        <Box
          sx={{
            borderRadius: { xs: 1.8, md: 1.8 },
            border: '1px solid rgba(228, 238, 250, 0.36)',
            background:
              'radial-gradient(circle at 50% 40%, rgba(8, 24, 48, 0) 0%, rgba(9, 26, 52, 0.46) 56%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.11))',
            boxShadow: 'inset 0 1px 0 rgba(248, 252, 255, 0.34), 0 20px 36px rgba(2, 8, 22, 0.42)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            p: { xs: 1.7, md: 2.3 },
            mb: 2.2,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: isParentAccount
                  ? 'minmax(220px, 1.2fr) minmax(320px, 1.45fr) minmax(220px, 1fr)'
                  : 'minmax(340px, 1.7fr) minmax(220px, 1fr)',
              },
              gap: { xs: 1.1, md: 1.4 },
            }}
          >
            {isParentAccount && (
              <Box sx={accountIdRowCardSx}>
                <TextField
                  value={accountId}
                  onChange={(event) => setAccountId(event.target.value)}
                  size="small"
                  placeholder="拠点アカウントID"
                  aria-label="拠点アカウントIDで検索"
                  sx={controlInputSx}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, px: 0.2 }}>

              <ButtonBase
                onClick={() => openDatePicker(fromDateInputRef)}
                sx={datePickerTriggerSx}
                aria-label="開始日を選択"
              >
                <Box sx={datePickerIconWrapSx}>
                  <FiCalendar style={{ color: 'rgba(180,215,250,0.9)', fontSize: '0.84rem' }} />
                </Box>
                <Typography sx={datePickerLabelSx}>開始</Typography>
                <Typography sx={datePickerValueSx}>{formatDateLabel(fromDate)}</Typography>
                <Box
                  ref={fromDateInputRef}
                  component="input"
                  type="date"
                  value={fromDate}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFromDate(event.target.value)}
                  sx={hiddenDateInputSx}
                />
              </ButtonBase>

              <Typography sx={{ color: 'rgba(195, 218, 248, 0.8)', fontWeight: 700 }}>~</Typography>

              <ButtonBase
                onClick={() => openDatePicker(toDateInputRef)}
                sx={datePickerTriggerSx}
                aria-label="終了日を選択"
              >
                <Box sx={datePickerIconWrapSx}>
                  <FiCalendar style={{ color: 'rgba(180,215,250,0.9)', fontSize: '0.84rem' }} />
                </Box>
                <Typography sx={datePickerLabelSx}>終了</Typography>
                <Typography sx={datePickerValueSx}>{formatDateLabel(toDate)}</Typography>
                <Box
                  ref={toDateInputRef}
                  component="input"
                  type="date"
                  value={toDate}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToDate(event.target.value)}
                  sx={hiddenDateInputSx}
                />
              </ButtonBase>
            </Box>

            <Box sx={{ ...controlCardSx, px: 0.25 }}>
              <Select<ReportSortKey>
                value={sortBy}
                onChange={onSortChange}
                size="small"
                displayEmpty
                IconComponent={FiChevronDown}
                aria-label="並び替え"
                sx={{
                  minHeight: 52,
                  width: '100%',
                  color: '#eef6ff',
                  fontSize: '1.02rem',
                  borderRadius: 1.6,
                  background: 'linear-gradient(180deg, rgba(20, 38, 66, 0.94), rgba(14, 30, 52, 0.94))',
                  boxShadow: 'inset 0 1px 0 rgba(240, 248, 255, 0.12)',
                  '& .MuiSelect-icon': { color: 'rgba(227, 240, 255, 0.92)' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      mt: 0.8,
                      borderRadius: 1.8,
                      border: '1px solid rgba(170, 202, 242, 0.34)',
                      background: 'linear-gradient(180deg, rgba(18, 34, 58, 0.98), rgba(12, 24, 42, 0.98))',
                      color: '#edf6ff',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 14px 24px rgba(1, 7, 20, 0.52)',
                      '& .MuiMenuItem-root': {
                        fontSize: '0.98rem',
                        color: '#edf6ff',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(102, 161, 238, 0.28)',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'rgba(102, 161, 238, 0.34)',
                        },
                      },
                    },
                  },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: { xs: 2.5, md: 1.8 },
            border: '1px solid rgba(210, 226, 246, 0.42)',
            background:
              'radial-gradient(140% 140% at 50% -15%, rgba(156, 199, 255, 0.18), rgba(156, 199, 255, 0) 45%), linear-gradient(180deg, rgba(18, 36, 62, 0.5), rgba(10, 24, 45, 0.64))',
            boxShadow: 'inset 0 1px 0 rgba(238, 247, 255, 0.2), 0 16px 32px rgba(2, 8, 22, 0.42)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            p: { xs: 1.9, md: 2.8 },
            position: 'relative',
          }}
        >
          <TableContainer
            sx={{
              borderRadius: 2,
              overflowX: 'auto',
              backgroundColor: 'transparent',
            }}
          >
            <Table
              size="medium"
              aria-label="投稿レポート一覧"
              sx={{
                minWidth: isParentAccount ? 1290 : 1120,
                tableLayout: 'fixed',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={titleHeadCellSx}>タイトル</TableCell>
                  <TableCell sx={summaryHeadCellSx}>投稿概要</TableCell>
                  <TableCell sx={dateHeadCellSx}>投稿日</TableCell>
                  <TableCell sx={metricHeadCellSx}>表示回数</TableCell>
                  <TableCell sx={metricHeadCellSx}>閲覧数</TableCell>
                  <TableCell sx={metricHeadCellSx}>いいね数</TableCell>
                  <TableCell sx={detailHeadCellSx}>詳細</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(126, 170, 236, 0.12)',
                      },
                      '& td': {
                        borderColor: 'rgba(196, 215, 239, 0.18)',
                      },
                    }}
                  >
                    <TableCell sx={titleBodyCellSx}>{item.title}</TableCell>
                    <TableCell sx={summaryBodyCellSx}>{item.summary}</TableCell>
                    <TableCell sx={dateBodyCellSx}>{toDateLabel(item.postedAt)}</TableCell>
                    <TableCell sx={metricBodyCellSx}>{(item.views * 2).toLocaleString('ja-JP')}</TableCell>
                    <TableCell sx={metricBodyCellSx}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                        <FiEye aria-hidden />
                        {item.views.toLocaleString('ja-JP')}
                      </Box>
                    </TableCell>
                    <TableCell sx={metricBodyCellSx}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                        <FiHeart aria-hidden />
                        {item.likes.toLocaleString('ja-JP')}
                      </Box>
                    </TableCell>
                    <TableCell sx={detailBodyCellSx}>
                      <ButtonBase
                        onClick={() => navigate(item.detailPath)}
                        sx={{
                          minHeight: 36,
                          px: 1.7,
                          borderRadius: 1.5,
                          border: '1px solid rgba(178, 214, 255, 0.6)',
                          background: 'linear-gradient(165deg, rgba(83, 156, 249, 0.95), rgba(52, 122, 221, 0.95))',
                          color: '#f7fbff',
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          boxShadow: '0 4px 10px rgba(8, 24, 50, 0.36)',
                          '&:hover': {
                            filter: 'brightness(1.05)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid rgba(220, 235, 255, 0.9)',
                            outlineOffset: 2,
                          },
                        }}
                      >
                        詳細
                      </ButtonBase>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ ...bodyCellSx, textAlign: 'center', py: 4 }}>
                      条件に一致する投稿がありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {reportQuery.isFetching && (
            <Box
              aria-live="polite"
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: { xs: 2.5, md: 1.8 },
                background: 'linear-gradient(180deg, rgba(8,20,38,0.06), rgba(8,20,38,0.2))',
                backdropFilter: 'blur(1px)',
                WebkitBackdropFilter: 'blur(1px)',
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
                animation: 'reportLoadingFade 260ms ease',
                '@keyframes reportLoadingFade': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.4,
                  py: 0.8,
                  borderRadius: 999,
                  border: '1px solid rgba(198,220,248,0.58)',
                  backgroundColor: 'rgba(10,24,45,0.72)',
                  color: '#eaf3ff',
                  boxShadow: '0 8px 18px rgba(2, 8, 22, 0.28)',
                }}
              >
                <CircularProgress size={16} thickness={5.2} sx={{ color: '#9ec6ff' }} />
                <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                  更新中...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <ReportSummaryPanel summary={summary} />
      </Box>
    </Box>
  );
};

export default ReportScreen;
