import type { CalendarMonth } from '../types/postForm';

export const MAX_IMAGES = 10;
export const DETAIL_MAX_LENGTH = 1200;
export const POST_CREATE_FULLSCREEN_SCALE = 0.88;
export const IMAGE_DRAG_SENSITIVITY = 0.6;
export const IMAGE_BASE_OFFSET_LIMIT = 10;

/** プラン別の投稿写真上限 */
export const PLAN_IMAGE_LIMITS: Record<string, number> = {
  LIGHT: 3,
  STANDARD: 5,
  PREMIUM: 10,
};

/** プランコードから画像上限数を取得（デフォルトは LIGHT 相当） */
export const getMaxImagesByPlan = (planCode?: string): number =>
  PLAN_IMAGE_LIMITS[planCode ?? ''] ?? PLAN_IMAGE_LIMITS.LIGHT;

export const GLASS_BG = 'rgba(255,255,255,0.1)';
export const GLASS_BORDER = '1px solid rgba(255,255,255,0.2)';
export const NEON_SHADOW = '0 0 15px rgba(80,160,255,0.6)';

export const CATEGORIES = [
  '食事', '体験', '買い物', 'イベント',
  'ライブ', '観光', '祭り', '温泉', '車',
];

export const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土'];

export const clampZoom = (value: number): number => Math.max(0.4, Math.min(3.2, value));

export const getImageOffsetLimit = (zoom: number): number =>
  Math.min(50, IMAGE_BASE_OFFSET_LIMIT + Math.max(0, zoom - 1) * 50);

export const clampImagePosition = (value: number, zoom: number): number => {
  const limit = getImageOffsetLimit(zoom);
  return Math.max(50 - limit, Math.min(50 + limit, value));
};

export const toLocalIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseLocalIsoDate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const addDays = (iso: string, days: number): string => {
  const date = parseLocalIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toLocalIsoDate(date);
};

export const buildCalendarMonths = (startIso: string, endIso: string): CalendarMonth[] => {
  const start = parseLocalIsoDate(startIso);
  const end = parseLocalIsoDate(endIso);
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const months: CalendarMonth[] = [];

  while (cursor <= end) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<string | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(toLocalIsoDate(new Date(year, month, day)));
    }

    const rows: Array<Array<string | null>> = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    months.push({
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: `${year}年${month + 1}月`,
      rows,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};
