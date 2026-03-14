/**
 * 投稿フォーム共通型定義
 *
 * PostCreateScreen / ScheduledPostEditScreen / PostPreviewScreen で
 * 重複定義されていた型を集約。
 */

/** 投稿フォームデータ（画面入力モデル） */
export interface PostFormData {
  title: string;
  images: PostFormImage[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
}

/** フォーム内画像データ */
export interface PostFormImage {
  file: File;
  preview: string;
  positionX: number;
  positionY: number;
  zoom: number;
}

/** プレビュー用画像ペイロード */
export interface PreviewImagePayload {
  preview: string;
  positionX: number;
  positionY: number;
  zoom: number;
}

/** プレビュー用フォームペイロード（navigateのstateで渡す） */
export interface PreviewFormPayload {
  title: string;
  images: string[];
  imageEdits?: PreviewImagePayload[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
}

/** カレンダー月表示データ */
export interface CalendarMonth {
  key: string;
  label: string;
  rows: Array<Array<string | null>>;
}
