import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { FiBookmark, FiEye, FiHeart, FiUsers } from 'react-icons/fi';
import type { ReportAggregateSummary } from '../../../types/models/reportSummary';
import {
  summaryGridSx,
  summaryMetricCardSx,
  summaryMetricLabelSx,
  summaryMetricValueSx,
  summaryPanelSx,
  summaryTitleSx,
} from '../styles/reportSummaryPanel.styles';

interface ReportSummaryPanelProps {
  summary: ReportAggregateSummary;
}

const ReportSummaryPanel: React.FC<ReportSummaryPanelProps> = ({ summary }) => {
  return (
    <Box sx={summaryPanelSx}>
      <Typography sx={summaryTitleSx}>
        サマリー
      </Typography>

      <Box sx={summaryGridSx}>
        <SummaryMetricCard label="投稿数" value={summary.totalPosts} />
        <SummaryMetricCard label="総表示回数" value={summary.totalImpressions} />
        <SummaryMetricCard label="総閲覧数" value={summary.totalViews} icon={<FiEye />} />
        <SummaryMetricCard label="総いいね数" value={summary.totalLikes} icon={<FiHeart />} />
        <SummaryMetricCard label="総お気に入り数" value={summary.totalFavorites} icon={<FiBookmark />} />
        <SummaryMetricCard
          label="企業をお気に入りしているユーザーの総計"
          value={summary.totalUsersWhoFavoriteCompanies}
          icon={<FiUsers />}
        />
      </Box>
    </Box>
  );
};

const SummaryMetricCard: React.FC<{ label: string; value: number; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <Box sx={summaryMetricCardSx}>
    <Stack direction="row" spacing={0.5} alignItems="center">
      {icon && <Box sx={{ color: 'rgba(198, 223, 255, 0.9)', display: 'grid', placeItems: 'center' }}>{icon}</Box>}
      <Typography sx={summaryMetricLabelSx}>
        {label}
      </Typography>
    </Stack>
    <Typography sx={summaryMetricValueSx}>
      {value.toLocaleString('ja-JP')}
    </Typography>
  </Box>
);

export default ReportSummaryPanel;
