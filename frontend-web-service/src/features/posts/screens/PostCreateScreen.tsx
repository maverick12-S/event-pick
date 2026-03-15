import React from 'react';
import {
  Alert,
  Box,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  FiAlertTriangle,
  FiClock,
  FiDollarSign,
  FiEye,
  FiLink,
  FiMapPin,
  FiSave,
  FiSend,
} from 'react-icons/fi';
import usePostCreateForm, {
  ASSIST_FIELD_OPTIONS,
  BUDGET_TEMPLATES,
  EVENT_TIME_TEMPLATES,
  QUICK_ASSIST_TEMPLATES,
} from '../hooks/usePostCreateForm';
import { ASSIST_NONE_VALUE, type AssistFieldKey } from '../utils/postQuickAssistSettings';
import FieldLabel from '../components/FieldLabel';
import DarkInput from '../components/DarkInput';
import ImageUploadArea from '../components/ImageUploadArea';
import CategorySelect from '../components/CategorySelect';
import DiscardDialog from '../components/DiscardDialog';
import ScheduleCalendarDialog from '../components/ScheduleCalendarDialog';
import { DETAIL_MAX_LENGTH, POST_CREATE_FULLSCREEN_SCALE } from '../utils/postCreateHelpers';

const PostCreateScreen: React.FC = () => {
  const {
    form,
    setField,
    maxImages,
    discardOpen,
    setDiscardOpen,
    scheduleOpen,
    setScheduleOpen,
    selectedPostDates,
    ticketConfirmOpen,
    hasToday,
    hasTomorrow,
    immediateTicketCount,
    assistTemplateKey,
    setAssistTemplateKey,
    assistEventTimeKey,
    setAssistEventTimeKey,
    assistBudgetKey,
    setAssistBudgetKey,
    assistMode,
    setAssistMode,
    assistApplyFields,
    setAssistApplyFields,
    snackbar,
    closeSnackbar,
    todayIso,
    maxSelectableIso,
    handleApplyQuickAssist,
    handleClearAssistFields,
    handleAddImages,
    handleRemoveImage,
    handleChangeImagePosition,
    handleChangeImageZoom,
    handleSubmit,
    handleDraft,
    handleDraftList,
    handlePreviewScreen,
    handleDiscard,
    handleSaveAndExit,
    togglePostDate,
    applyBulkSelect,
    confirmScheduledPost,
    handleTicketConfirmCancel,
    handleTicketConfirmOk,
  } = usePostCreateForm();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100dvh - var(--header-height, 72px))',
        mt: { xs: 1.35, md: 1.9 },
        px: { xs: 0.75, sm: 1.1, md: 1.35 },
        py: { xs: 1.2, md: 1.35 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mb: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          タイトル
        </Typography>
        <Box sx={{ mt: 0.6 }}>
          <FieldLabel num={1} label="タイトル" />
          <DarkInput
            value={form.title}
            onChange={(v) => setField('title', v)}
            placeholder="イベントタイトルを入力"
            minHeight={56}
            fontSize="1.1rem"
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mb: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          写真アップロード
        </Typography>
        <Box sx={{ mt: 0.6 }}>
          <FieldLabel num={2} label={`画像（最大${maxImages}枚）`} />
          <ImageUploadArea
            images={form.images}
            maxImages={maxImages}
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
            onPositionChange={handleChangeImagePosition}
            onZoomChange={handleChangeImageZoom}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          borderRadius: { xs: '14px', md: '16px' },
          border: '1px solid rgba(255,255,255,0.22)',
          background:
            'linear-gradient(135deg, #03060d 0%, #070d1a 46%, #02050b 100%)',
          boxShadow: '0 0 15px rgba(80,160,255,0.35), inset 0 1px 0 rgba(255,255,255,0.16)',
          backdropFilter: 'blur(14px) saturate(118%)',
          WebkitBackdropFilter: 'blur(14px) saturate(118%)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: { xs: 1.25, md: 1.65 } }}>
          <Grid container spacing={{ xs: 1.35, md: 1.6 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
                <Box>
                  <FieldLabel num={3} label="説明概要" />
                  <DarkInput
                    value={form.summary}
                    onChange={(v) => setField('summary', v)}
                    placeholder="イベントの概要を入力してください"
                    multiline
                    rows={3}
                  />
                </Box>

                <Box>
                  <FieldLabel num={4} label="詳細説明" />
                  <DarkInput
                    value={form.detail}
                    onChange={(v) => setField('detail', v)}
                    placeholder={`【イベント詳細】\n日程: 2026年○月○日（土）14:30 - 21:00\n場所: \n入場料: \n出演アーティスト:\n\n【注意事項】`}
                    multiline
                    rows={5}
                    maxLength={DETAIL_MAX_LENGTH}
                  />
                  <Typography
                    sx={{
                      mt: 0.5,
                      textAlign: 'right',
                      color: 'rgba(205,225,248,0.72)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {form.detail.length} / {DETAIL_MAX_LENGTH}（空白・改行を含む）
                  </Typography>
                </Box>

                <Box>
                  <FieldLabel num={5} label="予約欄" />
                  <DarkInput
                    value={form.reservation}
                    onChange={(v) => setField('reservation', v)}
                    placeholder="予約サイトURL: https://... or 事前予約不要"
                    icon={<FiLink />}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35 }}>
                <Box>
                  <FieldLabel num={6} label="住所欄" />
                  <DarkInput
                    value={form.address}
                    onChange={(v) => setField('address', v)}
                    placeholder="EventPick公園, 東京都渋谷区神南1丁目"
                    icon={<FiMapPin />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={7} label="会場名" />
                  <DarkInput
                    value={form.venueName}
                    onChange={(v) => setField('venueName', v)}
                    placeholder="会場名を入力（例: EventPickホールA）"
                    icon={<FiMapPin />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={8} label="イベント開始時間と終了時間" />
                  <Grid container spacing={1.5}>
                    <Grid size={6}>
                      <Typography
                        sx={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.72rem', mb: 0.5 }}
                      >
                        開始時間
                      </Typography>
                      <DarkInput
                        value={form.startTime}
                        onChange={(v) => setField('startTime', v)}
                        placeholder="14:30"
                        icon={<FiClock />}
                        type="time"
                      />
                    </Grid>
                    <Grid size={6}>
                      <Typography
                        sx={{ color: 'rgba(160,190,240,0.55)', fontSize: '0.72rem', mb: 0.5 }}
                      >
                        終了時間
                      </Typography>
                      <DarkInput
                        value={form.endTime}
                        onChange={(v) => setField('endTime', v)}
                        placeholder="21:00"
                        icon={<FiClock />}
                        type="time"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <FieldLabel num={9} label="予算" />
                  <DarkInput
                    value={form.budget}
                    onChange={(v) => setField('budget', v)}
                    placeholder="例: 無料 / ¥1,000〜¥3,000"
                    icon={<FiDollarSign />}
                  />
                </Box>

                <Box>
                  <FieldLabel num={10} label="カテゴリー" />
                  <CategorySelect
                    value={form.category}
                    onChange={(v) => setField('category', v)}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

        </Box>

        <Box
          sx={{
            px: { xs: 1.75, md: 2.25 },
            py: { xs: 1.2, md: 1.35 },
            borderTop: '1px solid rgba(100,150,220,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            background: 'rgba(10,22,46,0.4)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <ButtonBase
              onClick={() => setDiscardOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(180,210,255,0.28)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#c8deff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                minWidth: 112,
              }}
            >
              キャンセル
            </ButtonBase>

            <ButtonBase
              onClick={handleDraftList}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(120,170,240,0.35)',
                backgroundColor: 'rgba(70,120,200,0.08)',
                color: '#a8cfff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(70,120,200,0.18)' },
                minWidth: 112,
              }}
            >
              下書き一覧
            </ButtonBase>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ml: { xs: 0, md: 'auto' } }}>

            <ButtonBase
              onClick={handleDraft}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(100,200,150,0.4)',
                backgroundColor: 'rgba(30,160,100,0.1)',
                color: '#5dd8a0',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(30,160,100,0.18)' },
                minWidth: 120,
              }}
            >
              <FiSave size={14} />
              下書保存
            </ButtonBase>

            <ButtonBase
              onClick={handlePreviewScreen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid rgba(100,160,255,0.35)',
                backgroundColor: 'rgba(60,120,255,0.06)',
                color: '#7eb8ff',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.18s',
                '&:hover': { backgroundColor: 'rgba(60,120,255,0.14)' },
                minWidth: 112,
              }}
            >
              <FiEye size={14} />
              プレビュー
            </ButtonBase>

            <ButtonBase
              onClick={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2.5,
                py: 1,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1a6eff 0%, #0a4fd4 100%)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(20,80,240,0.4)',
                transition: 'all 0.18s',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(20,80,240,0.5)',
                },
                minWidth: 132,
              }}
            >
              <FiSend size={14} />
              投稿する
            </ButtonBase>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', xl: `${100 / POST_CREATE_FULLSCREEN_SCALE}%` },
          zoom: { xs: 1, xl: POST_CREATE_FULLSCREEN_SCALE },
          transformOrigin: 'top center',
          maxWidth: 1820,
          mx: 'auto',
          mt: { xs: 1, md: 1.2 },
          borderRadius: { xs: '12px', md: '14px' },
          border: '1px solid rgba(120,170,240,0.32)',
          backgroundColor: 'rgba(8,22,45,0.66)',
          boxShadow: '0 0 12px rgba(80,160,255,0.24)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          p: { xs: 1.1, md: 1.3 },
        }}
      >
        <Typography
          sx={{
            color: '#d7e9ff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          投稿内容の簡単入力補助
        </Typography>
        <Typography
          sx={{
            color: 'rgba(205,225,248,0.74)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            mt: 0.35,
          }}
        >
          複数選択した項目のみ反映するため、競合を避けながらテンプレート適用できます。解除項目も選択できます。
        </Typography>

        <Grid container spacing={0.8} sx={{ mt: 0.7 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              value={assistTemplateKey}
              onChange={(e) => setAssistTemplateKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '投稿テンプレ: ---';
                const selected = QUICK_ASSIST_TEMPLATES.find((t) => t.key === value);
                return selected ? selected.label : '投稿テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {QUICK_ASSIST_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  {template.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Select
              value={assistMode}
              onChange={(e) => setAssistMode(e.target.value as 'replace' | 'append')}
              size="small"
              fullWidth
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value="replace" sx={{ color: '#e2eeff', fontSize: '0.82rem' }}>
                上書き
              </MenuItem>
              <MenuItem value="append" sx={{ color: '#e2eeff', fontSize: '0.82rem' }}>
                追記
              </MenuItem>
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              multiple
              value={assistApplyFields}
              onChange={(e) => setAssistApplyFields((e.target.value as AssistFieldKey[]) ?? [])}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(selected) => {
                const values = selected as AssistFieldKey[];
                if (!values.length) return '反映項目: ---';
                return `反映: ${values.map((key) => ASSIST_FIELD_OPTIONS.find((o) => o.key === key)?.label ?? key).join(' / ')}`;
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              {ASSIST_FIELD_OPTIONS.map((option) => (
                <MenuItem
                  key={option.key}
                  value={option.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              value={assistEventTimeKey}
              onChange={(e) => setAssistEventTimeKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '時間テンプレ: ---';
                const selected = EVENT_TIME_TEMPLATES.find((t) => t.key === value);
                return selected ? `時間テンプレ: ${selected.label}（${selected.startTime} - ${selected.endTime}）` : '時間テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {EVENT_TIME_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  時間テンプレ: {template.label}（{template.startTime} - {template.endTime}）
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Select
              value={assistBudgetKey}
              onChange={(e) => setAssistBudgetKey(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              renderValue={(value) => {
                if (!value) return '予算テンプレ: ---';
                const selected = BUDGET_TEMPLATES.find((t) => t.key === value);
                return selected ? `予算テンプレ: ${selected.label}` : '予算テンプレ: ---';
              }}
              sx={{
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(170,205,250,0.28)',
                color: '#eaf3ff',
                fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-icon': { color: 'rgba(240,247,255,0.82)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#10213e',
                    border: '1px solid rgba(155,183,225,0.42)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value={ASSIST_NONE_VALUE} sx={{ color: '#9db7d8', fontSize: '0.82rem' }}>
                ---
              </MenuItem>
              {BUDGET_TEMPLATES.map((template) => (
                <MenuItem
                  key={template.key}
                  value={template.key}
                  sx={{
                    color: '#e2eeff',
                    fontSize: '0.82rem',
                    '&:hover': { backgroundColor: 'rgba(60,120,255,0.18)' },
                  }}
                >
                  予算テンプレ: {template.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ButtonBase
              onClick={handleClearAssistFields}
              sx={{
                width: '100%',
                height: 38,
                borderRadius: '8px',
                border: '1px solid rgba(255,170,170,0.45)',
                backgroundColor: 'rgba(170,60,60,0.18)',
                color: '#ffdede',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                '&:hover': { backgroundColor: 'rgba(170,60,60,0.28)' },
              }}
            >
              補助項目を解除
            </ButtonBase>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ButtonBase
              onClick={handleApplyQuickAssist}
              sx={{
                width: '100%',
                height: 38,
                borderRadius: '8px',
                border: '1px solid rgba(120,170,240,0.4)',
                backgroundColor: 'rgba(40,105,210,0.2)',
                color: '#d7e9ff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                '&:hover': { backgroundColor: 'rgba(40,105,210,0.3)' },
              }}
            >
              テンプレートを反映
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>

      <DiscardDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onDiscard={handleDiscard}
        onSaveAndExit={handleSaveAndExit}
      />
      <ScheduleCalendarDialog
        open={scheduleOpen}
        selectedDates={selectedPostDates}
        minDateIso={todayIso}
        maxDateIso={maxSelectableIso}
        onClose={() => setScheduleOpen(false)}
        onToggleDate={togglePostDate}
        onBulkSelect={applyBulkSelect}
        onConfirm={confirmScheduledPost}
      />

      <Dialog
        open={ticketConfirmOpen}
        onClose={handleTicketConfirmCancel}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #0a1428 0%, #0d1f3c 100%)',
            border: '1px solid rgba(130,170,230,0.32)',
            borderRadius: '14px',
            color: '#e8f2ff',
            maxWidth: 440,
            mx: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
            fontSize: '1rem',
            color: '#d8eaff',
            borderBottom: '1px solid rgba(100,150,255,0.18)',
            pb: 1.2,
          }}
        >
          <FiAlertTriangle size={18} color="#fbbf24" />
          チケット消費の確認
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1.5 }}>
          {(hasToday || hasTomorrow) ? (
            <>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {[hasToday && '本日', hasTomorrow && '明日'].filter(Boolean).join(', ')}の投稿になります。
              </Typography>
              <Typography sx={{ color: '#7dd4fc', fontSize: '1.1rem', fontWeight: 800, mt: 1 }}>
                {immediateTicketCount}枚消費
              </Typography>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7, mt: 0.5 }}>
                チケットを消費しますか？
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                選択された日付にチケッが消費されます。
              </Typography>
              <Typography sx={{ color: 'rgba(220,235,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7, mt: 0.5 }}>
                よろしいですか？
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2.2, pb: 1.8, gap: 1 }}>
          <ButtonBase
            onClick={handleTicketConfirmCancel}
            sx={{
              px: 2.2,
              py: 0.95,
              borderRadius: '8px',
              border: '1px solid rgba(180,210,255,0.32)',
              color: '#c8deff',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            キャンセル
          </ButtonBase>
          <ButtonBase
            onClick={handleTicketConfirmOk}
            sx={{
              px: 2.6,
              py: 0.95,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1a6eff 0%, #0a4fd4 100%)',
              color: '#fff',
              fontSize: '0.86rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(20,80,240,0.38)',
            }}
          >
            OK
          </ButtonBase>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{
            backgroundColor:
              snackbar.severity === 'success'
                ? 'rgba(20,120,70,0.95)'
                : snackbar.severity === 'error'
                  ? 'rgba(180,40,60,0.95)'
                  : 'rgba(30,80,180,0.95)',
            color: '#fff',
            borderRadius: '8px',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostCreateScreen;
