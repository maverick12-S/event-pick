import React from 'react';
import { MenuItem, Select } from '@mui/material';
import type { PostListSortKey } from '../../../api/mock/postsMockApi';

export const POST_SORT_OPTIONS: Array<{ value: PostListSortKey; label: string }> = [
  { value: 'postedAtDesc', label: '投稿日が新しい順' },
  { value: 'postedAtAsc', label: '投稿日が古い順' },
  { value: 'likesDesc', label: 'いいね数が多い順' },
  { value: 'recommendedDesc', label: 'おすすめ順' },
  { value: 'titleAsc', label: 'タイトル順' },
];

interface PostSortSelectProps {
  value: PostListSortKey;
  onChange: (value: PostListSortKey) => void;
  minHeight?: number;
  minWidth?: number | string | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number };
}

const PostSortSelect: React.FC<PostSortSelectProps> = ({
  value,
  onChange,
  minHeight = 42,
  minWidth = { xs: '100%', sm: 240 },
}) => {
  return (
    <Select<PostListSortKey>
      value={value}
      onChange={(event) => onChange(event.target.value as PostListSortKey)}
      size="small"
      displayEmpty
      aria-label="並び替え"
      MenuProps={{
        disableScrollLock: true,
        PaperProps: {
          sx: {
            backgroundColor: '#17293f',
            color: '#e9f2ff',
          },
        },
      }}
      sx={{
        minHeight,
        minWidth,
        color: '#f2f8ff',
        backgroundColor: 'rgba(8, 18, 34, 0.72)',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(176, 201, 232, 0.72)' },
        '& .MuiSvgIcon-root': { color: '#d9e9ff' },
      }}
    >
      {POST_SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PostSortSelect;
