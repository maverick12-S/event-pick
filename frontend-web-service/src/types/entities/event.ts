import type {
  EventPostStatus,
  EventTemplateStatus,
  EventSchedulePostStatus,
} from './enums';

/**
 * イベント一覧 (EventPost_c)
 * API参照名: EventPost_c
 */
export interface EventPost {
  /** ULID — CHAR(26) */
  post_id: string;
  /** テンプレートID — CHAR(26) → Event_Template_c FK */
  template_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** タイトル — VARCHAR(20) */
  title: string;
  /** 説明概要 — VARCHAR(80) */
  summary: string;
  /** 詳細説明 — TEXT(1000) */
  description?: string;
  /** 予約URL — VARCHAR(255) */
  reservation_url?: string;
  /** 住所 — CHAR(26) 参照 */
  address: string;
  /** 開催日 — DATE(10) */
  event_date: string;
  /** 開始時間 — TIME(8) */
  event_start_time: string;
  /** 終了時間 — TIME(8) */
  event_end_time: string;
  /** カテゴリーID — CHAR(26) → EventCategory_c FK */
  category_id: string;
  /** 公開状態 — CHAR(1) */
  status: EventPostStatus;
  /** いいね数 — INT(9) 数式: COUNT(EventPreview_c) */
  like_count: number;
}

/**
 * イベントテンプレート (Event_Template_c)
 * API参照名: Event_Template_c
 */
export interface EventTemplate {
  /** ULID — CHAR(26) 外部ID */
  template_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** タイトル — VARCHAR(20) */
  title: string;
  /** 説明概要 — VARCHAR(80) */
  summary: string;
  /** 詳細説明 — TEXT(1000) */
  description?: string;
  /** 予約URL — VARCHAR(255) */
  reservation_url?: string;
  /** 住所ID — CHAR(26) → Location FK */
  location_id: string;
  /** 開始時間 — TIME(8) */
  event_start_time: string;
  /** 終了時間 — TIME(8) */
  event_end_time: string;
  /** カテゴリーID — CHAR(26) → EventCategory_c FK */
  category_id: string;
  /** テンプレ状態 — CHAR(1) */
  status: EventTemplateStatus;
}

/**
 * カテゴリー (EventCategory_c)
 * API参照名: EventCategory_c
 */
export interface EventCategory {
  /** カテゴリーID — CHAR(2) */
  category_id: string;
  /** カテゴリーコード — VARCHAR(20) */
  category_code: string;
  /** カテゴリー名 — VARCHAR(20) */
  category_name: string;
}

/**
 * イベントメディア (EventMedia_c)
 * API参照名: EventMedia_c
 */
export interface EventMedia {
  /** ULID — CHAR(26) 外部ID */
  media_id: string;
  /** テンプレートID — CHAR(26) → Event_Template_c FK（テンプレ用） */
  template_id?: string;
  /** 投稿ID — CHAR(26) → EventPost_c FK（投稿用） */
  post_id?: string;
  /** 画像URL（S3パス） — VARCHAR(255) */
  image_url: string;
  /** 表示順 1〜3 — SMALLINT(2) */
  sort_no: number;
}

/**
 * イベント開催日程 (EventSchedule_c)
 * API参照名: EventSchedule_c
 */
export interface EventSchedule {
  /** ULID — CHAR(26) 外部ID */
  schedule_id: string;
  /** テンプレートID — CHAR(26) → Event_Template_c FK */
  template_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** 開催日 — DATE(10) */
  event_date: string;
  /** 投稿予定日（通常はevent_date - 2日） — DATE(10) */
  scheduled_post_date: string;
  /** 投稿状態 — CHAR(1) */
  post_status: EventSchedulePostStatus;
}

/**
 * イベント集計 (EventPreview_c)
 * API参照名: EventPreview_c
 */
export interface EventPreview {
  /** ULID — CHAR(26) 外部ID */
  action_id: string;
  /** 投稿ID — CHAR(26) → EventPost_c FK */
  post_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  consumer_id: string;
  /** いいねフラグ — BOOLEAN */
  is_liked: boolean;
  /** お気に入りフラグ — BOOLEAN */
  is_favorited: boolean;
  /** 閲覧数 — INT(1) */
  view_count: number;
}
