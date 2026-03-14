/**
 * 投稿管理系 DTO 型定義
 *
 * 対応画面:
 *  - PostCreateScreen / ScheduledPostEditScreen → PostCreateRequest
 *  - PostsListScreen / ScheduledPostsScreen     → PostSearchParams
 *  - PostDetailScreenB (編集モード)              → PostDetailEditRequest
 *  - PostDraftsScreen                            → PostDraftListResponse
 *  - PostPreviewScreen                           → PostPreviewPayload
 *
 * エンティティ準拠: EventPost_c, Event_Template_c, EventSchedule_c,
 *                   EventMedia_c, EventCategory_c
 */

import type { PostsTabKey, PostEventDbItem } from '../models/post';
import type { PostListSortKey } from '../models/postSort';
import type { PostDraftPayload, PostDraftItem } from '../models/postDraft';
import type { PostCondition, ScheduledPostItem } from '../models/scheduledPost';
import type { PaginatedResponse, PaginationParams } from './common';

// ─── 投稿作成 (PostCreateScreen) ───────────────────

/**
 * 投稿作成リクエスト POST /event-posts
 *
 * → Event_Template_c + EventSchedule_c + EventMedia_c を生成
 * フロントエンドI値はUI表記(日本語/大文字混在)だが、
 * APIに送信する際はスネークケースかつDB桁数制限を遵守する。
 */
export interface PostCreateRequest {
  /** タイトル — Event_Template_c.title VARCHAR(20) */
  title: string;
  /** アップロード済み画像URL一覧 — EventMedia_c.image_url VARCHAR(255)×最大3件 */
  image_urls: string[];
  /** 説明概要 — Event_Template_c.summary VARCHAR(80) */
  summary: string;
  /** 詳細説明 — Event_Template_c.description TEXT(1000) */
  description?: string;
  /** 予約URL — Event_Template_c.reservation_url VARCHAR(255) */
  reservation_url?: string;
  /** 住所ID — Event_Template_c.location_id CHAR(26) */
  location_id?: string;
  /** 会場名テキスト(UI入力) — 住所参照解決前のフリーテキスト */
  venue_name?: string;
  /** 開始時間 (HH:mm:ss) — Event_Template_c.event_start_time TIME(8) */
  event_start_time?: string;
  /** 終了時間 (HH:mm:ss) — Event_Template_c.event_end_time TIME(8) */
  event_end_time?: string;
  /** カテゴリーID — EventCategory_c.category_id CHAR(2) */
  category_id: string;
  /** 投稿予定日一覧 (YYYY-MM-DD) — EventSchedule_c.event_date DATE(10) */
  scheduled_dates: string[];
}

/** 投稿作成レスポンス */
export interface PostCreateResponse {
  /** テンプレートID — Event_Template_c.template_id CHAR(26) */
  template_id: string;
  /** 作成されたスケジュールID一覧 — EventSchedule_c.schedule_id CHAR(26) */
  schedule_ids: string[];
}

// ─── 投稿検索 (PostsListScreen / ScheduledPostsScreen) ──

/** 投稿検索フィルタ・パラメータ GET /event-posts */
export interface PostSearchParams extends PaginationParams {
  /** タイトル部分一致 — EventPost_c.title VARCHAR(20) */
  title?: string;
  /** カテゴリーIDフィルタ — EventCategory_c.category_id CHAR(2)[] */
  category_ids?: string[];
  /** 都道府県IDフィルタ — Region_List.region_id CHAR(2)[] */
  region_ids?: string[];
  /** 市町村IDフィルタ — City_List.city_id CHAR(6)[] */
  city_ids?: string[];
  /** 時間帯フィルタ — TIME(8)[] */
  time_slots?: string[];
  /** タブ (today / tomorrow / scheduled) */
  tab?: PostsTabKey;
  /** ソート */
  sortBy?: PostListSortKey;
  /** 日付範囲 - 開始 — EventPost_c.event_date DATE(10) */
  date_from?: string;
  /** 日付範囲 - 終了 — EventPost_c.event_date DATE(10) */
  date_to?: string;
}

/** 投稿検索レスポンス */
export interface PostSearchResponse extends PaginatedResponse<PostEventDbItem> {}

// ─── 投稿詳細の編集 (PostDetailScreenB 編集モード) ──

/**
 * 投稿詳細の部分更新リクエスト PATCH /event-posts/:post_id
 * → EventPost_c エンティティ準拠
 */
export interface PostDetailEditRequest {
  /** タイトル — EventPost_c.title VARCHAR(20) */
  title?: string;
  /** 説明概要 — EventPost_c.summary VARCHAR(80) */
  summary?: string;
  /** 詳細説明 — EventPost_c.description TEXT(1000) */
  description?: string;
  /** 予約URL — EventPost_c.reservation_url VARCHAR(255) */
  reservation_url?: string;
  /** 住所 — EventPost_c.address CHAR(26) */
  address?: string;
  /** 開催日 — EventPost_c.event_date DATE(10) */
  event_date?: string;
  /** 開始時間 — EventPost_c.event_start_time TIME(8) */
  event_start_time?: string;
  /** 終了時間 — EventPost_c.event_end_time TIME(8) */
  event_end_time?: string;
  /** カテゴリーID — EventPost_c.category_id CHAR(26) */
  category_id?: string;
  /** 公開状態 — EventPost_c.status CHAR(1) */
  status?: string;
}

// ─── 予約投稿エンドポイント ────────────────────────

/** 予約投稿作成リクエスト POST /posts/scheduled */
export interface ScheduledPostCreateRequest {
  /** 投稿作成データ */
  post: PostCreateRequest;
  /** 自動投稿条件 */
  condition: PostCondition;
}

/**
 * 予約投稿更新リクエスト PUT /event-templates/:template_id
 * → Event_Template_c + EventSchedule_c エンティティ準拠
 */
export interface ScheduledPostUpdateRequest {
  /** タイトル — Event_Template_c.title VARCHAR(20) */
  title?: string;
  /** 画像URL一覧 — EventMedia_c.image_url VARCHAR(255)[] */
  image_urls?: string[];
  /** 説明概要 — Event_Template_c.summary VARCHAR(80) */
  summary?: string;
  /** 詳細説明 — Event_Template_c.description TEXT(1000) */
  description?: string;
  /** 予約URL — Event_Template_c.reservation_url VARCHAR(255) */
  reservation_url?: string;
  /** 住所ID — Event_Template_c.location_id CHAR(26) */
  location_id?: string;
  /** 会場名テキスト(UI入力) */
  venue_name?: string;
  /** 開始時間 — Event_Template_c.event_start_time TIME(8) */
  event_start_time?: string;
  /** 終了時間 — Event_Template_c.event_end_time TIME(8) */
  event_end_time?: string;
  /** カテゴリーID — Event_Template_c.category_id CHAR(26) */
  category_id?: string;
  /** テンプレ状態 — Event_Template_c.status CHAR(1) */
  status?: string;
  /** 投稿予定日一覧更新 (YYYY-MM-DD) — EventSchedule_c.event_date */
  scheduled_dates?: string[];
}

/** 予約投稿更新レスポンス */
export interface ScheduledPostUpdateResponse {
  item: ScheduledPostItem;
}

/** 予約投稿一覧パラメータ */
export interface ScheduledPostListParams extends PostSearchParams {
  /** 拠点アカウントID — Company_Account.company_account_id */
  company_account_id?: string;
}

/** 予約投稿一覧レスポンス */
export interface ScheduledPostListResponse extends PaginatedResponse<ScheduledPostItem> {}

// ─── 下書き (PostDraftsScreen) ─────────────────────

/** 下書き一覧レスポンス */
export interface PostDraftListResponse {
  items: PostDraftItem[];
}

// ─── プレビュー (PostPreviewScreen) ────────────────

/** プレビュー画面に渡す内部ペイロード (navigate state) */
export interface PostPreviewPayload extends PostDraftPayload {
  /** プレビュー用画像 (base64 or blob URL) */
  previewImages?: string[];
}
