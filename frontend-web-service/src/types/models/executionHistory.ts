/** 実行履歴の型定義 */

export type ExecutionHistoryCategory = '投稿' | 'アカウント払出' | '情報変更' | '削除' | '削除予定';

export interface ExecutionHistoryItem {
  id: string;
  executedAt: string;
  category: ExecutionHistoryCategory;
  title: string;
  description: string;
  actor: string;
}
