import React, { useState, useMemo } from 'react';
import { Box, ButtonBase, Typography, Tabs, Tab, IconButton, TextField } from '@mui/material';
import { FiSearch } from 'react-icons/fi';

// 仮データ（後でAPI接続）
const mockPosts = [
  {
    id: '1',
    title: '春のイベント',
    condition: '雨天決行',
    nextDate: '2026-03-10',
    baseId: 'A01',
  },
  {
    id: '2',
    title: '夏祭り',
    condition: '事前予約',
    nextDate: '2026-03-15',
    baseId: 'A01',
  },
];

const PostReservationScreen: React.FC = () => {
  const [tab, setTab] = useState<'posts' | 'reservations'>('reservations');
  const [searchDate, setSearchDate] = useState('');

  // 検索機能（仮実装）
  const filteredPosts = useMemo(() => {
    if (!searchDate) return mockPosts;
    return mockPosts.filter((post) => post.nextDate === searchDate);
  }, [searchDate]);

  // 拠点IDによる全削除（仮実装）
  const handleDeleteAll = (baseId: string) => {
    // TODO: APIで拠点ID紐づく投稿を全削除
    alert(`拠点ID ${baseId} の投稿を全削除します`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: 2 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ButtonBase sx={{ fontWeight: 700, px: 2, py: 1, borderRadius: 999, background: '#eef5ff', color: '#2d5080' }}>今日</ButtonBase>
          <ButtonBase sx={{ fontWeight: 700, px: 2, py: 1, borderRadius: 999, background: '#eef5ff', color: '#2d5080' }}>明日</ButtonBase>
          <ButtonBase sx={{ fontWeight: 700, px: 2, py: 1, borderRadius: 999, background: '#e74c6f', color: '#fff' }}>予約・確認</ButtonBase>
        </Box>
        <IconButton>
          <FiSearch />
        </IconButton>
      </Box>

      {/* 日付検索 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          type="date"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
          label="日付で検索"
          InputLabelProps={{ shrink: true }}
          sx={{ width: 220 }}
        />
      </Box>

      {/* タブ */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab value="posts" label="投稿一覧" />
        <Tab value="reservations" label="予約一覧" />
      </Tabs>

      {/* 一覧表示（予約一覧がデフォルト） */}
      <Box>
        {filteredPosts.map(post => (
          <Box key={post.id} sx={{ mb: 2, p: 2, borderRadius: 2, background: '#fff', boxShadow: '0 2px 8px rgba(74,112,165,0.08)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>{post.title}</Typography>
            <Typography sx={{ color: '#7a9cc4', mb: 0.5 }}>条件: {post.condition}</Typography>
            <Typography sx={{ color: '#2e4564', mb: 0.5 }}>次回投稿日: {post.nextDate}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ButtonBase sx={{ px: 2, py: 0.7, borderRadius: 999, background: '#eef5ff', color: '#2d5080', fontWeight: 700 }}>編集</ButtonBase>
              <ButtonBase sx={{ px: 2, py: 0.7, borderRadius: 999, background: '#e74c6f', color: '#fff', fontWeight: 700 }}>削除</ButtonBase>
            </Box>
            <ButtonBase sx={{ mt: 1, px: 2, py: 0.7, borderRadius: 999, background: '#d35400', color: '#fff', fontWeight: 700 }} onClick={() => handleDeleteAll(post.baseId)}>
              拠点ID {post.baseId} の投稿を全削除
            </ButtonBase>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PostReservationScreen;
