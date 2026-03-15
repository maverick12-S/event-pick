import { z } from 'zod';

// ─── 投稿管理 Zod スキーマ ──────────────────────
// 参照エンティティ: EventPost_c, Event_Template_c, EventSchedule_c, EventMedia_c

/** 時間形式 HH:MM or HH:MM:SS */
const timeSchema = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'HH:MM 形式で入力してください');

/** 日付形式 YYYY-MM-DD */
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください');

/** 投稿作成リクエスト → Event_Template_c + EventSchedule_c 生成 */
export const postCreateRequestSchema = z.object({
  /** タイトル VARCHAR(20) ○ */
  title: z.string().min(1, 'タイトルを入力してください').max(20, '20文字以内で入力してください'),
  /** 画像URL配列 — EventMedia_c 最大3枚 */
  image_urls: z.array(z.string().max(255, '255文字以内で入力してください')).min(1, '画像を1枚以上選択してください').max(3, '画像は3枚までです'),
  /** 説明概要 VARCHAR(80) ○ */
  summary: z.string().min(1, '概要を入力してください').max(80, '80文字以内で入力してください'),
  /** 詳細説明 TEXT(1000) △ */
  description: z.string().max(1000, '1000文字以内で入力してください').optional(),
  /** 予約URL VARCHAR(255) △ */
  reservation_url: z.string().url('有効なURLを入力してください').max(255, '255文字以内で入力してください').optional(),
  /** 住所ID CHAR(26) △ — location_id FK */
  location_id: z.string().max(26, '26文字以内で入力してください').optional(),
  /** 会場名 △ UI補助用 */
  venue_name: z.string().max(40, '40文字以内で入力してください').optional(),
  /** 開始時間 TIME(8) △ */
  event_start_time: timeSchema.optional(),
  /** 終了時間 TIME(8) △ */
  event_end_time: timeSchema.optional(),
  /** カテゴリーID CHAR(26) ○ — EventCategory_c FK */
  category_id: z.string().min(1, 'カテゴリーを選択してください').max(26),
  /** 開催日リスト DATE(10)[] ○ */
  scheduled_dates: z.array(dateSchema).min(1, '開催日を1日以上選択してください'),
});

/** 投稿作成レスポンス */
export const postCreateResponseSchema = z.object({
  /** テンプレートID CHAR(26) */
  template_id: z.string().length(26),
  /** 開催日程ID CHAR(26)[] */
  schedule_ids: z.array(z.string().length(26)),
});

/** 投稿検索パラメータ */
export const postSearchParamsSchema = z.object({
  title: z.string().max(100, '100文字以内で入力してください').optional(),
  category_ids: z.array(z.string().max(26)).optional(),
  region_ids: z.array(z.string().length(2)).optional(),
  city_ids: z.array(z.string().max(6)).optional(),
  time_slots: z.array(z.string()).optional(),
  tab: z.enum(['today', 'tomorrow', 'scheduled']).optional(),
  sortBy: z.enum(['newest', 'likes', 'date']).optional(),
  date_from: dateSchema.optional(),
  date_to: dateSchema.optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});

/** 投稿詳細編集リクエスト → EventPost_c 更新 */
export const postDetailEditRequestSchema = z.object({
  /** タイトル VARCHAR(20) */
  title: z.string().min(1, 'タイトルを入力してください').max(20, '20文字以内で入力してください').optional(),
  /** 説明概要 VARCHAR(80) */
  summary: z.string().max(80, '80文字以内で入力してください').optional(),
  /** 詳細説明 TEXT(1000) */
  description: z.string().max(1000, '1000文字以内で入力してください').optional(),
  /** 予約URL VARCHAR(255) */
  reservation_url: z.string().url('有効なURLを入力してください').max(255, '255文字以内で入力してください').optional(),
  /** 住所 VARCHAR(100) */
  address: z.string().max(100, '100文字以内で入力してください').optional(),
  /** 開催日 DATE(10) */
  event_date: dateSchema.optional(),
  /** 開始時間 TIME(8) */
  event_start_time: timeSchema.optional(),
  /** 終了時間 TIME(8) */
  event_end_time: timeSchema.optional(),
  /** カテゴリーID CHAR(26) */
  category_id: z.string().max(26, '26文字以内で入力してください').optional(),
  /** 公開状態 CHAR(1) 1:公開前/2:公開中/3:終了 */
  status: z.enum(['1', '2', '3']).optional(),
});

/** スケジュール投稿更新リクエスト → Event_Template_c 更新 */
export const scheduledPostUpdateRequestSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(20, '20文字以内で入力してください').optional(),
  image_urls: z.array(z.string().max(255, '255文字以内で入力してください')).max(3, '画像は3枚までです').optional(),
  summary: z.string().max(80, '80文字以内で入力してください').optional(),
  description: z.string().max(1000, '1000文字以内で入力してください').optional(),
  reservation_url: z.string().url('有効なURLを入力してください').max(255, '255文字以内で入力してください').optional(),
  location_id: z.string().max(26, '26文字以内で入力してください').optional(),
  venue_name: z.string().max(40, '40文字以内で入力してください').optional(),
  event_start_time: timeSchema.optional(),
  event_end_time: timeSchema.optional(),
  category_id: z.string().max(26, '26文字以内で入力してください').optional(),
  /** テンプレ状態 CHAR(1) 1:下書き/2:使用可/3:停止 */
  status: z.enum(['1', '2', '3']).optional(),
  scheduled_dates: z.array(dateSchema).optional(),
});

/** スケジュール投稿一覧パラメータ */
export const scheduledPostListParamsSchema = z.object({
  company_account_id: z.string().max(36, '36文字以内で入力してください').optional(),
  title: z.string().max(100, '100文字以内で入力してください').optional(),
  category_ids: z.array(z.string().max(26)).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
});
