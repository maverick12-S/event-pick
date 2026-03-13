/** 予約投稿の型定義 */

export interface PostCondition {
  hashtags: string[];
  platforms: Array<'Instagram' | 'Twitter' | 'Facebook' | 'LINE'>;
  autoPost: boolean;
  repeatInterval: '毎日' | '毎週' | '毎月' | 'なし';
  captionTemplate?: string;
}

export interface ScheduledPostItem {
  id: string;
  locationId: string;
  title: string;
  ward: string;
  venue: string;
  category: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  imageUrl: string;
  condition: PostCondition;
  nextPostDate: string;
  status: 'scheduled' | 'posted' | 'paused';
  createdAt: string;
  updatedAt: string;
}
