import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { FiArrowLeft, FiSearch, FiSend } from 'react-icons/fi';
import type { AccountsSortKey } from '../../../api/mock/accountsMockApi';
import useAccountsMock from '../hooks/useAccountsMock';
import { cellAlignSx, desktopTableMinWidth, rowGridTemplate } from '../styles/accountsList.styles';

const ACCOUNTS_LIST_SCALE = 1.25;

const AccountsListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<AccountsSortKey>('name-asc');

  const accountsQuery = useAccountsMock({ query, sortBy: sortKey });
  const companyCode = accountsQuery.data?.companyCode ?? '-';
  const items = useMemo(() => accountsQuery.data?.items ?? [], [accountsQuery.data?.items]);

  const handleSortChange = (event: SelectChangeEvent<AccountsSortKey>) => {
    setSortKey(event.target.value as AccountsSortKey);
  };

  const handleIssue = () => {
    navigate('/accounts/issue');
  };

  const handleEdit = (item: { baseName: string; accountId: string }) => {
    window.alert(`拠点アカウント編集: ${item.baseName} (${item.accountId})`);
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
      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / ACCOUNTS_LIST_SCALE}%` },
          maxWidth: 1960,
          mx: 'auto',
          zoom: { xs: 1, xl: ACCOUNTS_LIST_SCALE },
          transformOrigin: 'top center',
          borderRadius: '18px',
          border: '1px solid rgba(198, 220, 252, 0.24)',
          background:
            'radial-gradient(circle at 7% 0%, rgba(112, 176, 255, 0.16), rgba(6, 18, 40, 0) 30%), radial-gradient(circle at 93% 12%, rgba(126, 202, 255, 0.12), rgba(6, 18, 40, 0) 34%), linear-gradient(180deg, rgba(12, 32, 62, 0.95), rgba(8, 23, 46, 0.98))',
          boxShadow: '0 16px 34px rgba(3, 10, 27, 0.45), inset 0 1px 0 rgba(255,255,255,0.16)',
          p: { xs: 1.25, sm: 1.7, md: 2.05 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.2, flexWrap: 'wrap' }}>
          <ButtonBase
            onClick={() => navigate('/home')}
            sx={{
              borderRadius: 999,
              px: 1.2,
              py: 0.58,
              border: '1px solid rgba(186, 214, 250, 0.5)',
              backgroundColor: 'rgba(11, 34, 67, 0.66)',
              color: '#d8ebff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.65,
              fontSize: '0.76rem',
              fontWeight: 700,
            }}
          >
            <FiArrowLeft /> Homeへ戻る
          </ButtonBase>
          <Typography sx={{ color: 'rgba(216, 235, 255, 0.76)', fontSize: '0.76rem', fontWeight: 600 }}>
            法人コード: {companyCode}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: '#ecf5ff',
            fontWeight: 900,
            textAlign: 'center',
            fontSize: { xs: '1.48rem', md: '2.08rem' },
            letterSpacing: '0.02em',
            mb: 1.15,
          }}
        >
          拠点アカウント管理
        </Typography>

        <Box
          sx={{
            borderRadius: '15px',
            border: '1px solid rgba(198, 220, 252, 0.28)',
            backgroundColor: 'rgba(241, 248, 255, 0.07)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
            p: { xs: 1, md: 1.05 },
            mb: 1.1,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 0.8,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'minmax(220px, 1fr) 190px auto' },
            }}
          >
            <Box
              sx={{
                height: 42,
                borderRadius: 999,
                border: '1px solid rgba(206, 227, 252, 0.35)',
                backgroundColor: 'rgba(247, 251, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.7,
                px: 1.2,
              }}
            >
              <FiSearch size={16} color="rgba(217, 236, 255, 0.82)" />
              <Box
                component="input"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                placeholder="拠点検索"
                aria-label="拠点検索"
                sx={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#e8f3ff',
                  fontSize: '0.88rem',
                  '&::placeholder': {
                    color: 'rgba(213, 232, 255, 0.72)',
                  },
                }}
              />
            </Box>

            <Select
              value={sortKey}
              onChange={handleSortChange}
              displayEmpty
              size="small"
              sx={{
                height: 42,
                borderRadius: '11px',
                border: '1px solid rgba(206, 227, 252, 0.34)',
                backgroundColor: 'rgba(247, 251, 255, 0.12)',
                color: '#e8f3ff',
                '& .MuiSelect-select': {
                  py: 0.6,
                  fontSize: '0.86rem',
                },
                '& .MuiSvgIcon-root': { color: '#d5e9ff' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#0f274c',
                    color: '#e8f3ff',
                    border: '1px solid rgba(130, 181, 248, 0.32)',
                  },
                },
              }}
            >
              <MenuItem value="name-asc">並び替え: 拠点名 (昇順)</MenuItem>
              <MenuItem value="name-desc">並び替え: 拠点名 (降順)</MenuItem>
              <MenuItem value="id-asc">並び替え: アカウントID</MenuItem>
              <MenuItem value="status">並び替え: 利用ステータス</MenuItem>
              <MenuItem value="plan">並び替え: 契約プラン</MenuItem>
            </Select>

            <ButtonBase
              onClick={handleIssue}
              sx={{
                height: 42,
                px: 1.5,
                borderRadius: 999,
                justifySelf: { xs: 'stretch', md: 'stretch', lg: 'end' },
                gridColumn: { xs: 'auto', md: '1 / -1', lg: 'auto' },
                border: '1px solid rgba(142, 199, 255, 0.44)',
                background: 'linear-gradient(135deg, #2d91ff, #1666c7)',
                color: '#f4faff',
                fontWeight: 800,
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.55,
                boxShadow: '0 7px 16px rgba(16, 87, 176, 0.42)',
              }}
            >
              <FiSend size={14} />
              拠点アカウント払出
            </ButtonBase>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: '15px',
            border: '1px solid rgba(194, 220, 253, 0.22)',
            backgroundColor: 'rgba(241, 248, 255, 0.08)',
            p: { xs: 0.82, md: 0.95 },
          }}
        >
          <Box sx={{ display: { xs: 'grid', lg: 'none' }, gap: 0.8 }}>
            {items.map((item) => (
              <Box
                key={`card-${item.id}`}
                sx={{
                  borderRadius: '11px',
                  border: '1px solid rgba(211, 230, 253, 0.26)',
                  background: 'linear-gradient(180deg, rgba(245, 251, 255, 0.2), rgba(189, 214, 244, 0.16))',
                  px: 1.1,
                  py: 0.95,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(6, 18, 40, 0.28)',
                }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '96px 1fr', rowGap: 0.55, columnGap: 0.75, alignItems: 'center' }}>
                  <Typography sx={{ color: 'rgba(216, 235, 255, 0.78)', fontSize: '0.78rem', fontWeight: 700 }}>拠点名</Typography>
                  <Typography sx={{ color: '#eef7ff', fontWeight: 800, fontSize: '0.96rem', lineHeight: 1.25 }}>{item.baseName}</Typography>

                  <Typography sx={{ color: 'rgba(216, 235, 255, 0.78)', fontSize: '0.78rem', fontWeight: 700 }}>アカウントID</Typography>
                  <Typography sx={{ color: 'rgba(232, 244, 255, 0.95)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.25 }}>{item.accountId}</Typography>

                  <Typography sx={{ color: 'rgba(216, 235, 255, 0.78)', fontSize: '0.78rem', fontWeight: 700 }}>利用ステータス</Typography>
                  <Box>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        minWidth: 90,
                        height: 30,
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        color: '#f5fbff',
                        backgroundColor: item.status === '利用中' ? 'rgba(46, 201, 113, 0.8)' : 'rgba(128, 144, 167, 0.78)',
                        border: '1px solid rgba(235, 244, 255, 0.3)',
                      }}
                    />
                  </Box>

                  <Typography sx={{ color: 'rgba(216, 235, 255, 0.78)', fontSize: '0.78rem', fontWeight: 700 }}>契約プラン</Typography>
                  <Typography sx={{ color: '#eef7ff', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.25 }}>{item.plan}</Typography>

                  <Typography sx={{ color: 'rgba(216, 235, 255, 0.78)', fontSize: '0.78rem', fontWeight: 700 }}>操作</Typography>
                  <Box>
                    <ButtonBase
                      onClick={() => handleEdit(item)}
                      sx={{
                        minWidth: 96,
                        height: 32,
                        borderRadius: '9px',
                        border: '1px solid rgba(186, 216, 252, 0.46)',
                        background: 'linear-gradient(160deg, rgba(228, 241, 255, 0.16), rgba(166, 196, 230, 0.12))',
                        color: '#e6f2ff',
                        px: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.45,
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(6, 20, 43, 0.26)',
                      }}
                      aria-label={`${item.baseName}を編集`}
                    >
                      <EditOutlined sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.01em' }}>編集</Typography>
                    </ButtonBase>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ overflowX: 'auto', pb: 0.3, display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ minWidth: desktopTableMinWidth }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: rowGridTemplate,
                  px: 1.25,
                  py: 0,
                  minHeight: 56,
                  color: '#e6f2ff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                <Box sx={cellAlignSx}>拠点アカウント名</Box>
                <Box sx={cellAlignSx}>アカウントID</Box>
                <Box sx={{ ...cellAlignSx, justifyContent: 'center', textAlign: 'center' }}>利用ステータス</Box>
                <Box sx={{ ...cellAlignSx, justifyContent: 'center', textAlign: 'center' }}>契約プラン</Box>
                <Box sx={{ ...cellAlignSx, justifyContent: 'center' }}>編集</Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.62 }}>
                {items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      borderRadius: '11px',
                      border: '1px solid rgba(211, 230, 253, 0.26)',
                      background: 'linear-gradient(180deg, rgba(245, 251, 255, 0.2), rgba(189, 214, 244, 0.16))',
                      minHeight: 80,
                      height: 80,
                      px: 1.2,
                      py: 0,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(6, 18, 40, 0.28)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        alignItems: 'stretch',
                        height: '100%',
                        gap: 1,
                        gridTemplateColumns: rowGridTemplate,
                      }}
                    >
                      <Box sx={cellAlignSx}>
                        <Typography sx={{ color: '#eef7ff', fontWeight: 800, fontSize: '1.12rem', lineHeight: 1.25 }}>
                          {item.baseName}
                        </Typography>
                      </Box>

                      <Box sx={cellAlignSx}>
                        <Typography sx={{ color: 'rgba(232, 244, 255, 0.95)', fontWeight: 700, fontSize: '1.08rem', lineHeight: 1.25 }}>
                          {item.accountId}
                        </Typography>
                      </Box>

                      <Box sx={{ ...cellAlignSx, justifyContent: 'center' }}>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            minWidth: 98,
                            height: 36,
                            borderRadius: 999,
                            fontWeight: 800,
                            fontSize: '0.96rem',
                            color: '#f5fbff',
                            backgroundColor: item.status === '利用中' ? 'rgba(46, 201, 113, 0.8)' : 'rgba(128, 144, 167, 0.78)',
                            border: '1px solid rgba(235, 244, 255, 0.3)',
                          }}
                        />
                      </Box>

                      <Box sx={{ ...cellAlignSx, justifyContent: 'center' }}>
                        <Typography sx={{ color: '#eef7ff', fontWeight: 700, fontSize: '1.08rem', lineHeight: 1.25, textAlign: 'center' }}>
                          {item.plan}
                        </Typography>
                      </Box>

                      <Box sx={{ ...cellAlignSx, justifyContent: 'center' }}>
                        <ButtonBase
                          onClick={() => handleEdit(item)}
                          sx={{
                            minWidth: 106,
                            height: 36,
                            borderRadius: '9px',
                            border: '1px solid rgba(186, 216, 252, 0.46)',
                            background: 'linear-gradient(160deg, rgba(228, 241, 255, 0.16), rgba(166, 196, 230, 0.12))',
                            color: '#e6f2ff',
                            px: 1.1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(6, 20, 43, 0.26)',
                            transition: 'border-color 0.16s ease, background 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease',
                            '&:hover': {
                              borderColor: 'rgba(214, 233, 255, 0.86)',
                              background: 'linear-gradient(160deg, rgba(242, 250, 255, 0.24), rgba(189, 221, 255, 0.2))',
                              transform: 'translateY(-1px)',
                              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 5px 12px rgba(7, 23, 49, 0.34)',
                            },
                            '&:active': { transform: 'translateY(0)' },
                          }}
                          aria-label={`${item.baseName}を編集`}
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.01em' }}>
                            編集
                          </Typography>
                        </ButtonBase>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

            {accountsQuery.isLoading && (
              <Box sx={{ p: 2.2, display: 'grid', placeItems: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#d9ebff' }} />
              </Box>
            )}

            {accountsQuery.isError && (
              <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>
                拠点アカウントの取得に失敗しました
              </Alert>
            )}

            {!accountsQuery.isLoading && !accountsQuery.isError && items.length === 0 && (
              <Box sx={{ p: 2.2, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(223, 238, 255, 0.86)', fontSize: '0.92rem' }}>
                  条件に一致する拠点アカウントがありません
                </Typography>
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountsListScreen;
