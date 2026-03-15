import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PostFormData, PreviewFormPayload } from '../types/postForm';
import { postManagementApi } from './usePostManagement';
import {
  ASSIST_NONE_VALUE,
  DEFAULT_APPLY_FIELDS,
  getPostQuickAssistSettings,
  type AssistFieldKey,
} from '../utils/postQuickAssistSettings';
import { useFormValidation } from '../../../lib/useFormValidation';
import { postFormSchema } from '../../../lib/formSchemas';
import {
  addDays,
  clampImagePosition,
  clampZoom,
  getMaxImagesByPlan,
  parseLocalIsoDate,
  toLocalIsoDate,
} from '../utils/postCreateHelpers';
import { useAuth } from '../../../contexts/AuthContext';

const INITIAL_FORM: PostFormData = {
  title: '',
  images: [],
  summary: '',
  detail: '',
  reservation: '',
  address: '',
  venueName: '',
  budget: '',
  startTime: '',
  endTime: '',
  category: '',
};

type QuickAssistMode = 'replace' | 'append';

type PostCreateLocationState = {
  restoreForm?: PreviewFormPayload;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'error';
};

const QUICK_ASSIST_SETTINGS = getPostQuickAssistSettings();
export const QUICK_ASSIST_TEMPLATES = QUICK_ASSIST_SETTINGS.templates;
export const EVENT_TIME_TEMPLATES = QUICK_ASSIST_SETTINGS.eventTimes;
export const BUDGET_TEMPLATES = QUICK_ASSIST_SETTINGS.budgets;
export const ASSIST_FIELD_OPTIONS = QUICK_ASSIST_SETTINGS.fieldOptions;

const usePostCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const maxImages = getMaxImagesByPlan(user?.planCode);
  const [form, setForm] = useState<PostFormData>(INITIAL_FORM);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedPostDates, setSelectedPostDates] = useState<string[]>([]);
  const [ticketConfirmOpen, setTicketConfirmOpen] = useState(false);
  const [hasToday, setHasToday] = useState(false);
  const [hasTomorrow, setHasTomorrow] = useState(false);
  const [immediateTicketCount, setImmediateTicketCount] = useState(0);
  const [assistTemplateKey, setAssistTemplateKey] = useState<string>(QUICK_ASSIST_TEMPLATES[0]?.key ?? '');
  const [assistEventTimeKey, setAssistEventTimeKey] = useState<string>(EVENT_TIME_TEMPLATES[0]?.key ?? '');
  const [assistBudgetKey, setAssistBudgetKey] = useState<string>(BUDGET_TEMPLATES[0]?.key ?? '');
  const [assistMode, setAssistMode] = useState<QuickAssistMode>('replace');
  const [assistApplyFields, setAssistApplyFields] = useState<AssistFieldKey[]>(DEFAULT_APPLY_FIELDS);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const { validate, clearError, firstError } = useFormValidation(postFormSchema);

  const todayIso = useMemo(() => toLocalIsoDate(new Date()), []);
  const maxSelectableIso = useMemo(() => addDays(todayIso, 30), [todayIso]);
  const selectableDates = useMemo(() => {
    const days: string[] = [];
    for (let i = 0; i <= 30; i += 1) {
      days.push(addDays(todayIso, i));
    }
    return days;
  }, [todayIso]);

  useEffect(() => {
    const restore = (location.state as PostCreateLocationState | null)?.restoreForm;
    if (!restore) return;

    const restoredImages = (restore.imageEdits?.length
      ? restore.imageEdits
      : restore.images.map((preview) => ({
        preview,
        positionX: 50,
        positionY: 50,
        zoom: 1,
      }))
    ).map((image, idx) => ({
      file: new File([''], `restored-${idx + 1}.txt`, { type: 'text/plain' }),
      preview: image.preview,
      positionX: clampImagePosition(image.positionX, clampZoom(image.zoom)),
      positionY: clampImagePosition(image.positionY, clampZoom(image.zoom)),
      zoom: clampZoom(image.zoom),
    }));

    setForm({
      title: restore.title,
      images: restoredImages,
      summary: restore.summary,
      detail: restore.detail,
      reservation: restore.reservation,
      address: restore.address,
      venueName: restore.venueName,
      budget: restore.budget,
      startTime: restore.startTime,
      endTime: restore.endTime,
      category: restore.category,
    });

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const setField = useCallback(<K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (typeof key === 'string') clearError(key);
  }, [clearError]);

  const handleApplyQuickAssist = useCallback(() => {
    if (assistApplyFields.length === 0) {
      setSnackbar({ open: true, message: '反映する項目を1つ以上選択してください', severity: 'error' });
      return;
    }

    const needsPostTemplate = assistApplyFields.some((field) =>
      field === 'summary' || field === 'detail' || field === 'reservation',
    );
    const needsTimeTemplate = assistApplyFields.some((field) =>
      field === 'startTime' || field === 'endTime',
    );
    const needsBudgetTemplate = assistApplyFields.includes('budget');

    const template = QUICK_ASSIST_TEMPLATES.find((item) => item.key === assistTemplateKey);
    const eventTimeTemplate = EVENT_TIME_TEMPLATES.find((item) => item.key === assistEventTimeKey);
    const budgetTemplate = BUDGET_TEMPLATES.find((item) => item.key === assistBudgetKey);

    if (needsPostTemplate && !template) {
      setSnackbar({ open: true, message: '入力補助テンプレートを選択してください', severity: 'error' });
      return;
    }
    if (needsTimeTemplate && !eventTimeTemplate) {
      setSnackbar({ open: true, message: 'イベント時間テンプレートを選択してください', severity: 'error' });
      return;
    }
    if (needsBudgetTemplate && !budgetTemplate) {
      setSnackbar({ open: true, message: '予算テンプレートを選択してください', severity: 'error' });
      return;
    }

    setForm((prev) => {
      const shouldReplace = assistMode === 'replace';
      const nextStartTime = assistApplyFields.includes('startTime') && eventTimeTemplate
        ? (shouldReplace ? eventTimeTemplate.startTime : (prev.startTime || eventTimeTemplate.startTime))
        : prev.startTime;
      const nextEndTime = assistApplyFields.includes('endTime') && eventTimeTemplate
        ? (shouldReplace ? eventTimeTemplate.endTime : (prev.endTime || eventTimeTemplate.endTime))
        : prev.endTime;
      const nextBudget = assistApplyFields.includes('budget') && budgetTemplate
        ? (shouldReplace ? budgetTemplate.value : (prev.budget.trim() ? prev.budget : budgetTemplate.value))
        : prev.budget;

      const generatedDetail = template
        ? template.buildDetail({
          title: prev.title,
          category: prev.category,
          venueName: prev.venueName,
          address: prev.address,
          startTime: nextStartTime,
          endTime: nextEndTime,
          budget: nextBudget,
        }).trim()
        : prev.detail;

      const nextDetail = assistApplyFields.includes('detail')
        ? (assistMode === 'append' && prev.detail.trim()
          ? `${prev.detail.trim()}\n\n${generatedDetail}`
          : generatedDetail)
        : prev.detail;

      return {
        ...prev,
        summary: assistApplyFields.includes('summary')
          ? (template ? (shouldReplace ? template.summary : (prev.summary.trim() ? prev.summary : template.summary)) : prev.summary)
          : prev.summary,
        budget: nextBudget,
        startTime: nextStartTime,
        endTime: nextEndTime,
        detail: nextDetail,
        reservation: assistApplyFields.includes('reservation')
          ? (template
            ? (shouldReplace ? template.reservationHint : (prev.reservation.trim() ? prev.reservation : template.reservationHint))
            : prev.reservation)
          : prev.reservation,
      };
    });

    setSnackbar({
      open: true,
      message: assistMode === 'append' ? '入力補助を追記しました' : '入力補助を反映しました',
      severity: 'success',
    });
  }, [assistApplyFields, assistTemplateKey, assistEventTimeKey, assistBudgetKey, assistMode]);

  const handleClearAssistFields = useCallback(() => {
    setAssistTemplateKey(ASSIST_NONE_VALUE);
    setAssistEventTimeKey(ASSIST_NONE_VALUE);
    setAssistBudgetKey(ASSIST_NONE_VALUE);
    setAssistApplyFields([]);
    setSnackbar({ open: true, message: '補助入力項目を --- にリセットしました', severity: 'info' });
  }, []);

  const handleAddImages = useCallback((files: FileList) => {
    setForm((prev) => {
      const remaining = maxImages - prev.images.length;
      if (remaining <= 0) return prev;

      const toAdd = Array.from(files).slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        positionX: 50,
        positionY: 50,
        zoom: 1,
      }));

      return { ...prev, images: [...prev.images, ...toAdd] };
    });
  }, [maxImages]);

  const handleRemoveImage = useCallback((index: number) => {
    setForm((prev) => {
      const updated = [...prev.images];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  }, []);

  const handleChangeImagePosition = useCallback((index: number, positionX: number, positionY: number) => {
    setForm((prev) => {
      if (!prev.images[index]) return prev;
      const next = [...prev.images];
      const currentZoom = next[index].zoom;
      next[index] = {
        ...next[index],
        positionX: clampImagePosition(positionX, currentZoom),
        positionY: clampImagePosition(positionY, currentZoom),
      };
      return { ...prev, images: next };
    });
  }, []);

  const handleChangeImageZoom = useCallback((index: number, zoom: number) => {
    setForm((prev) => {
      if (!prev.images[index]) return prev;
      const next = [...prev.images];
      const nextZoom = clampZoom(zoom);
      next[index] = {
        ...next[index],
        zoom: nextZoom,
        positionX: clampImagePosition(next[index].positionX, nextZoom),
        positionY: clampImagePosition(next[index].positionY, nextZoom),
      };
      return { ...prev, images: next };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const result = validate(form);
    if (!result.success) {
      setSnackbar({ open: true, message: firstError ?? 'エラーがあります', severity: 'error' });
      return;
    }
    setSelectedPostDates((prev) => (prev.length > 0 ? prev : [todayIso]));
    setScheduleOpen(true);
  }, [form, validate, firstError, todayIso]);

  const handleDraft = useCallback(() => {
    if (!form.title.trim()) {
      setSnackbar({ open: true, message: 'タイトルを入力してください', severity: 'error' });
      return;
    }

    const saved = postManagementApi.upsertPostDraft({
      title: form.title,
      images: form.images.map((img) => img.preview),
      summary: form.summary,
      detail: form.detail,
      reservation: form.reservation,
      address: form.address,
      venueName: form.venueName,
      budget: form.budget,
      startTime: form.startTime,
      endTime: form.endTime,
      category: form.category,
    });

    if (!saved) {
      setSnackbar({ open: true, message: '下書き保存に失敗しました', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: '下書きを保存しました', severity: 'info' });
  }, [form]);

  const handleDraftList = useCallback(() => {
    navigate('/posts/drafts');
  }, [navigate]);

  const handlePreviewScreen = useCallback(() => {
    const previewPayload: PreviewFormPayload = {
      title: form.title,
      images: form.images.map((img) => img.preview),
      imageEdits: form.images.map((img) => ({
        preview: img.preview,
        positionX: img.positionX,
        positionY: img.positionY,
        zoom: img.zoom,
      })),
      summary: form.summary,
      detail: form.detail,
      reservation: form.reservation,
      address: form.address,
      venueName: form.venueName,
      budget: form.budget,
      startTime: form.startTime,
      endTime: form.endTime,
      category: form.category,
    };

    navigate('/posts/preview', {
      state: {
        previewForm: previewPayload,
        returnTo: '/posts/create',
      },
    });
  }, [form, navigate]);

  const handleDiscard = useCallback(() => {
    form.images.forEach((img) => URL.revokeObjectURL(img.preview));
    setForm(INITIAL_FORM);
    setDiscardOpen(false);
    navigate('/home');
  }, [form.images, navigate]);

  const handleSaveAndExit = useCallback(() => {
    if (!form.title.trim()) {
      setSnackbar({ open: true, message: '下書き保存にはタイトルが必要です', severity: 'error' });
      return;
    }

    const saved = postManagementApi.upsertPostDraft({
      title: form.title,
      images: form.images.map((img) => img.preview),
      summary: form.summary,
      detail: form.detail,
      reservation: form.reservation,
      address: form.address,
      venueName: form.venueName,
      budget: form.budget,
      startTime: form.startTime,
      endTime: form.endTime,
      category: form.category,
    });

    if (!saved) {
      setSnackbar({ open: true, message: '下書き保存に失敗しました', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: '下書きを保存しました', severity: 'info' });
    setDiscardOpen(false);
    setTimeout(() => navigate('/home'), 500);
  }, [form, navigate]);

  const togglePostDate = useCallback((iso: string) => {
    setSelectedPostDates((prev) => (prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]));
  }, []);

  const applyBulkSelect = useCallback((mode: 'all' | 'weekdays' | 'weekends' | 'clear') => {
    if (mode === 'clear') {
      setSelectedPostDates([]);
      return;
    }

    const picked = selectableDates.filter((iso) => {
      const weekday = parseLocalIsoDate(iso).getDay();
      if (mode === 'all') return true;
      if (mode === 'weekdays') return weekday >= 1 && weekday <= 5;
      return weekday === 0 || weekday === 6;
    });
    setSelectedPostDates(picked);
  }, [selectableDates]);

  const confirmScheduledPost = useCallback(async () => {
    if (selectedPostDates.length === 0) {
      setSnackbar({ open: true, message: '投稿日を1日以上選択してください', severity: 'error' });
      return;
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    setHasToday(selectedPostDates.includes(todayStr));
    setHasTomorrow(selectedPostDates.includes(tomorrowStr));
    setImmediateTicketCount(selectedPostDates.filter(d => d === todayStr || d === tomorrowStr).length);
    setTicketConfirmOpen(true);
  }, [selectedPostDates]);

  const handleTicketConfirmCancel = useCallback(() => {
    setTicketConfirmOpen(false);
  }, []);

  const handleTicketConfirmOk = useCallback(() => {
    setTicketConfirmOpen(false);
    setScheduleOpen(false);
    setSnackbar({ open: true, message: `${selectedPostDates.length}日分の投稿予定を保存しました`, severity: 'success' });
    setTimeout(() => navigate('/posts/scheduled'), 1000);
  }, [selectedPostDates.length, navigate]);

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }));
  }, []);

  return {
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
  };
};

export default usePostCreateForm;
