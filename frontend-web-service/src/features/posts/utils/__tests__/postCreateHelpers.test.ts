import { describe, it, expect } from 'vitest';
import {
  MAX_IMAGES,
  DETAIL_MAX_LENGTH,
  POST_CREATE_FULLSCREEN_SCALE,
  IMAGE_DRAG_SENSITIVITY,
  IMAGE_BASE_OFFSET_LIMIT,
  PLAN_IMAGE_LIMITS,
  getMaxImagesByPlan,
  CATEGORIES,
  WEEKDAY_JA,
  clampZoom,
  getImageOffsetLimit,
  clampImagePosition,
  toLocalIsoDate,
  parseLocalIsoDate,
  addDays,
  buildCalendarMonths,
  GLASS_BG,
  GLASS_BORDER,
  NEON_SHADOW,
} from '../postCreateHelpers';

// ─── 定数 ───
describe('定数', () => {
  it('MAX_IMAGES は 10', () => {
    expect(MAX_IMAGES).toBe(10);
  });

  it('DETAIL_MAX_LENGTH は 1200', () => {
    expect(DETAIL_MAX_LENGTH).toBe(1200);
  });

  it('POST_CREATE_FULLSCREEN_SCALE は 0.88', () => {
    expect(POST_CREATE_FULLSCREEN_SCALE).toBe(0.88);
  });

  it('IMAGE_DRAG_SENSITIVITY は 0.6', () => {
    expect(IMAGE_DRAG_SENSITIVITY).toBe(0.6);
  });

  it('IMAGE_BASE_OFFSET_LIMIT は 10', () => {
    expect(IMAGE_BASE_OFFSET_LIMIT).toBe(10);
  });

  it('GLASS_BG / GLASS_BORDER / NEON_SHADOW が文字列', () => {
    expect(typeof GLASS_BG).toBe('string');
    expect(typeof GLASS_BORDER).toBe('string');
    expect(typeof NEON_SHADOW).toBe('string');
  });

  it('CATEGORIES は 9カテゴリー', () => {
    expect(CATEGORIES).toHaveLength(9);
    expect(CATEGORIES).toContain('食事');
    expect(CATEGORIES).toContain('体験');
    expect(CATEGORIES).toContain('車');
  });

  it('WEEKDAY_JA は日〜土の7曜日', () => {
    expect(WEEKDAY_JA).toEqual(['日', '月', '火', '水', '木', '金', '土']);
  });
});

// ─── PLAN_IMAGE_LIMITS / getMaxImagesByPlan ───
describe('PLAN_IMAGE_LIMITS', () => {
  it('LIGHT は 3枚', () => {
    expect(PLAN_IMAGE_LIMITS.LIGHT).toBe(3);
  });

  it('STANDARD は 5枚', () => {
    expect(PLAN_IMAGE_LIMITS.STANDARD).toBe(5);
  });

  it('PREMIUM は 10枚', () => {
    expect(PLAN_IMAGE_LIMITS.PREMIUM).toBe(10);
  });
});

describe('getMaxImagesByPlan', () => {
  it('LIGHT プランで 3 を返す', () => {
    expect(getMaxImagesByPlan('LIGHT')).toBe(3);
  });

  it('STANDARD プランで 5 を返す', () => {
    expect(getMaxImagesByPlan('STANDARD')).toBe(5);
  });

  it('PREMIUM プランで 10 を返す', () => {
    expect(getMaxImagesByPlan('PREMIUM')).toBe(10);
  });

  it('undefined でデフォルト LIGHT (3) を返す', () => {
    expect(getMaxImagesByPlan(undefined)).toBe(3);
  });

  it('不明なプランコードでデフォルト LIGHT (3) を返す', () => {
    expect(getMaxImagesByPlan('UNKNOWN')).toBe(3);
  });

  it('空文字でデフォルト LIGHT (3) を返す', () => {
    expect(getMaxImagesByPlan('')).toBe(3);
  });
});

// ─── clampZoom ───
describe('clampZoom', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(clampZoom(1.0)).toBe(1.0);
    expect(clampZoom(2.5)).toBe(2.5);
  });

  it('最小値 0.4 にクランプする', () => {
    expect(clampZoom(0.1)).toBe(0.4);
    expect(clampZoom(-1)).toBe(0.4);
    expect(clampZoom(0)).toBe(0.4);
  });

  it('最大値 3.2 にクランプする', () => {
    expect(clampZoom(5.0)).toBe(3.2);
    expect(clampZoom(3.3)).toBe(3.2);
  });

  it('境界値を返す', () => {
    expect(clampZoom(0.4)).toBe(0.4);
    expect(clampZoom(3.2)).toBe(3.2);
  });
});

// ─── getImageOffsetLimit ───
describe('getImageOffsetLimit', () => {
  it('zoom=1.0 で IMAGE_BASE_OFFSET_LIMIT を返す', () => {
    expect(getImageOffsetLimit(1.0)).toBe(IMAGE_BASE_OFFSET_LIMIT);
  });

  it('zoom=0.4 で IMAGE_BASE_OFFSET_LIMIT を返す（zoom-1 < 0 のため）', () => {
    expect(getImageOffsetLimit(0.4)).toBe(IMAGE_BASE_OFFSET_LIMIT);
  });

  it('zoom=2.0 で増加値を返す', () => {
    const expected = Math.min(50, IMAGE_BASE_OFFSET_LIMIT + (2.0 - 1) * 50);
    expect(getImageOffsetLimit(2.0)).toBe(expected);
  });

  it('zoom=3.2 で最大50にクランプされる', () => {
    expect(getImageOffsetLimit(3.2)).toBe(50);
  });
});

// ─── clampImagePosition ───
describe('clampImagePosition', () => {
  it('zoom=1.0 で中央付近の位置をクランプする', () => {
    const limit = getImageOffsetLimit(1.0);
    expect(clampImagePosition(50, 1.0)).toBe(50);
    expect(clampImagePosition(50 - limit, 1.0)).toBe(50 - limit);
    expect(clampImagePosition(50 + limit, 1.0)).toBe(50 + limit);
  });

  it('範囲外の値をクランプする', () => {
    expect(clampImagePosition(0, 1.0)).toBe(50 - getImageOffsetLimit(1.0));
    expect(clampImagePosition(100, 1.0)).toBe(50 + getImageOffsetLimit(1.0));
  });

  it('zoom=3.2 で広い範囲を許容する', () => {
    expect(clampImagePosition(0, 3.2)).toBe(0);
    expect(clampImagePosition(100, 3.2)).toBe(100);
  });
});

// ─── toLocalIsoDate ───
describe('toLocalIsoDate', () => {
  it('Date を YYYY-MM-DD 形式に変換する', () => {
    expect(toLocalIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toLocalIsoDate(new Date(2026, 11, 25))).toBe('2026-12-25');
  });

  it('月・日を2桁にゼロ埋めする', () => {
    expect(toLocalIsoDate(new Date(2026, 2, 1))).toBe('2026-03-01');
  });
});

// ─── parseLocalIsoDate ───
describe('parseLocalIsoDate', () => {
  it('YYYY-MM-DD を Date に変換する', () => {
    const date = parseLocalIsoDate('2026-03-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(15);
  });

  it('不完全な文字列でもクラッシュしない', () => {
    const date = parseLocalIsoDate('2026');
    expect(date.getFullYear()).toBe(2026);
  });
});

// ─── addDays ───
describe('addDays', () => {
  it('0日後は同じ日', () => {
    expect(addDays('2026-03-15', 0)).toBe('2026-03-15');
  });

  it('1日後を返す', () => {
    expect(addDays('2026-03-15', 1)).toBe('2026-03-16');
  });

  it('月末を跨ぐ', () => {
    expect(addDays('2026-03-31', 1)).toBe('2026-04-01');
  });

  it('年末を跨ぐ', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('30日後を返す', () => {
    expect(addDays('2026-03-01', 30)).toBe('2026-03-31');
  });

  it('負の日数を処理する', () => {
    expect(addDays('2026-03-15', -1)).toBe('2026-03-14');
  });
});

// ─── buildCalendarMonths ───
describe('buildCalendarMonths', () => {
  it('1ヶ月分のカレンダーを生成する', () => {
    const months = buildCalendarMonths('2026-03-01', '2026-03-31');
    expect(months).toHaveLength(1);
    expect(months[0].key).toBe('2026-03');
    expect(months[0].label).toBe('2026年3月');
  });

  it('2ヶ月分のカレンダーを生成する', () => {
    const months = buildCalendarMonths('2026-03-01', '2026-04-30');
    expect(months).toHaveLength(2);
    expect(months[0].key).toBe('2026-03');
    expect(months[1].key).toBe('2026-04');
  });

  it('各月の rows がカレンダーグリッドになっている', () => {
    const months = buildCalendarMonths('2026-03-01', '2026-03-31');
    const rows = months[0].rows;
    expect(rows.length).toBeGreaterThanOrEqual(4);

    // 各行は最大7要素
    for (const row of rows) {
      expect(row.length).toBeLessThanOrEqual(7);
    }
  });

  it('月初の曜日に合わせて null パディングされる', () => {
    const months = buildCalendarMonths('2026-03-01', '2026-03-31');
    const firstRow = months[0].rows[0];
    // 2026-03-01 は日曜日 → パディング無し
    expect(firstRow[0]).toBe('2026-03-01');
  });

  it('月の最終日が含まれる', () => {
    const months = buildCalendarMonths('2026-03-01', '2026-03-31');
    const allCells = months[0].rows.flat().filter(Boolean);
    expect(allCells).toContain('2026-03-31');
    expect(allCells).toHaveLength(31);
  });

  it('年跨ぎのカレンダーを生成する', () => {
    const months = buildCalendarMonths('2026-12-01', '2027-01-31');
    expect(months).toHaveLength(2);
    expect(months[0].key).toBe('2026-12');
    expect(months[1].key).toBe('2027-01');
  });

  it('同じ日付を開始と終了に指定しても1ヶ月を返す', () => {
    const months = buildCalendarMonths('2026-03-15', '2026-03-15');
    expect(months).toHaveLength(1);
  });
});
