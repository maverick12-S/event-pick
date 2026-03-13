/** 下書き投稿の型定義 */

export type PostDraftPayload = {
  title: string;
  images: string[];
  summary: string;
  detail: string;
  reservation: string;
  address: string;
  venueName: string;
  budget: string;
  startTime: string;
  endTime: string;
  category: string;
};

export type PostDraftItem = PostDraftPayload & {
  id: string;
  savedAt: string;
};
