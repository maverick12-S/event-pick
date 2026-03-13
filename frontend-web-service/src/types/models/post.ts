/** 投稿イベント関連の型定義 */

export type PostsTabKey = 'today' | 'tomorrow' | 'scheduled';

export interface PostEventDbItem {
  id: string;
  title: string;
  ward: string;
  venue: string;
  description: string;
  category: string;
  dateLabel: string;
  timeLabel: string;
  imageUrl: string;
  imageUrls: string[];
  detailPath: string;
  detailLabel: string;
  reservationContact: string;
  tab: PostsTabKey;
}
