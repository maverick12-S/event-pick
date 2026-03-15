import React from 'react';
import { Box, Button, Collapse, Grid, MenuItem, Select } from '@mui/material';
import type { PostListSortKey } from '../../../types/models/postSort';
import { PostSortSelect } from '../components';
import { toSelectedValues, type PostSearchFilters } from '../utils/postSearchFilters';
import { postManagementApi } from '../hooks/usePostManagement';

const {
  categories: categoryOptions,
  cities: cityOptions,
  prefectures: prefectureOptions,
  timeSlots: timeSlotOptions,
} = postManagementApi.getPostFilterOptions();

const selectSx = {
  color: '#f2f8ff',
  backgroundColor: 'rgba(8, 18, 34, 0.72)',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(178, 204, 236, 0.8)' },
  '& .MuiSvgIcon-root': { color: '#d9e9ff' },
};

const menuPropsSx = {
  disableScrollLock: true,
  PaperProps: {
    sx: {
      backgroundColor: '#17293f',
      color: '#e9f2ff',
    },
  },
};

const PostSearchFilterPanel: React.FC<{
  open: boolean;
  draftFilters: PostSearchFilters;
  onDraftChange: React.Dispatch<React.SetStateAction<PostSearchFilters>>;
  sortBy: PostListSortKey;
  onSortChange: (value: PostListSortKey) => void;
  onClear: () => void;
  onApply: () => void;
}> = ({ open, draftFilters, onDraftChange, sortBy, onSortChange, onClear, onApply }) => (
  <Collapse
    in={open}
    timeout={420}
    easing="cubic-bezier(0.22, 1, 0.36, 1)"
    sx={{ mt: open ? { xs: 1, md: 0.9, lg: 1.2 } : 0 }}
  >
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(186, 210, 239, 0.45)',
        backgroundColor: 'rgba(18, 32, 54, 0.9)',
        boxShadow: 'inset 0 1px 0 rgba(243, 249, 255, 0.24)',
        p: { xs: 1.1, md: 1.25 },
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 260ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <Grid container spacing={1.1} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={draftFilters.categories}
            renderValue={(selected) => {
              const values = toSelectedValues(selected);
              return values.length > 0 ? values.join(' / ') : 'カテゴリー(全て)';
            }}
            onChange={(event) => {
              const values = event.target.value;
              onDraftChange((prev) => ({ ...prev, categories: typeof values === 'string' ? values.split(',') : values }));
            }}
            MenuProps={menuPropsSx}
            sx={selectSx}
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={draftFilters.prefectures}
            renderValue={(selected) => {
              const values = toSelectedValues(selected);
              return values.length > 0 ? values.join(' / ') : '県(全て)';
            }}
            onChange={(event) => {
              const values = event.target.value;
              onDraftChange((prev) => ({
                ...prev,
                prefectures: typeof values === 'string' ? values.split(',') : values,
              }));
            }}
            MenuProps={menuPropsSx}
            sx={selectSx}
          >
            {prefectureOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={draftFilters.cities}
            renderValue={(selected) => {
              const values = toSelectedValues(selected);
              return values.length > 0 ? values.join(' / ') : '市・区(全て)';
            }}
            onChange={(event) => {
              const values = event.target.value;
              onDraftChange((prev) => ({ ...prev, cities: typeof values === 'string' ? values.split(',') : values }));
            }}
            MenuProps={menuPropsSx}
            sx={selectSx}
          >
            {cityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={draftFilters.timeSlots}
            renderValue={(selected) => {
              const values = toSelectedValues(selected);
              return values.length > 0 ? values.join(' / ') : '時間帯(全て)';
            }}
            onChange={(event) => {
              const values = event.target.value;
              onDraftChange((prev) => ({ ...prev, timeSlots: typeof values === 'string' ? values.split(',') : values }));
            }}
            MenuProps={menuPropsSx}
            sx={selectSx}
          >
            {timeSlotOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.9, flexWrap: 'wrap' }}>
            <PostSortSelect
              value={sortBy}
              onChange={onSortChange}
              minHeight={42}
              minWidth={{ xs: '100%', sm: 240 }}
            />
            <Box sx={{ display: 'flex', gap: 0.8, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="outlined"
                onClick={onClear}
                sx={{
                  color: '#e8f2ff',
                  borderColor: 'rgba(169, 196, 228, 0.7)',
                }}
              >
                クリア
              </Button>
              <Button
                variant="contained"
                onClick={onApply}
              >
                検索
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Collapse>
);

export default PostSearchFilterPanel;
