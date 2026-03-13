/** レポート一覧の型定義 */

export type ReportSortKey = 'postedAtDesc' | 'postedAtAsc' | 'viewsDesc' | 'likesDesc' | 'titleAsc';

export interface ReportListItem {
  id: string;
  accountId: string;
  title: string;
  summary: string;
  postedAt: string;
  views: number;
  likes: number;
  detailPath: string;
}
