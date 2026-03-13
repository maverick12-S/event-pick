export type ExecutionHistoryCategory = '投稿' | 'アカウント払出' | '情報変更' | '削除' | '削除予定';

export interface ExecutionHistoryItem {
  id: string;
  executedAt: string;
  category: ExecutionHistoryCategory;
  title: string;
  description: string;
  actor: string;
}

const now = new Date();

const toIsoAt = (dayOffset: number, hour: number, minute: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const executionHistoryDb: ExecutionHistoryItem[] = [
  {
    id: 'eh-001',
    executedAt: toIsoAt(0, 9, 12),
    category: '投稿',
    title: '春のワインフェス 投稿予約を実行',
    description: '投稿ID: post-20260313-01 を本日 09:10 に公開しました。',
    actor: '田中太郎',
  },
  {
    id: 'eh-002',
    executedAt: toIsoAt(0, 10, 5),
    category: '情報変更',
    title: '東京本社アカウント情報を更新',
    description: 'メールアドレスと住所を更新しました。',
    actor: '田中太郎',
  },
  {
    id: 'eh-003',
    executedAt: toIsoAt(0, 11, 18),
    category: 'アカウント払出',
    title: '名古屋支店アカウントを新規発行',
    description: '拠点アカウントID: NG-021 を払い出しました。',
    actor: '管理者',
  },
  {
    id: 'eh-004',
    executedAt: toIsoAt(-1, 14, 26),
    category: '削除予定',
    title: '福岡営業所アカウントを削除予定に設定',
    description: '60日後に完全削除予定です。',
    actor: '管理者',
  },
  {
    id: 'eh-005',
    executedAt: toIsoAt(-2, 17, 8),
    category: '削除',
    title: '旧アカウントを完全削除',
    description: '削除予定期間を経過したため完全削除しました。',
    actor: 'システム',
  },
  {
    id: 'eh-006',
    executedAt: toIsoAt(-3, 8, 45),
    category: '投稿',
    title: '週末ナイトイベント投稿を更新',
    description: '画像3枚と開催時間を変更しました。',
    actor: '田中太郎',
  },
  {
    id: 'eh-007',
    executedAt: toIsoAt(-6, 19, 32),
    category: '情報変更',
    title: '請求先情報を更新',
    description: '請求先住所と電話番号を更新しました。',
    actor: '管理者',
  },
  {
    id: 'eh-008',
    executedAt: toIsoAt(-12, 13, 5),
    category: 'アカウント払出',
    title: '大阪支店アカウントを払い出し',
    description: '拠点アカウントID: OS-018 を発行しました。',
    actor: '管理者',
  },
];

export const getExecutionHistories = (): ExecutionHistoryItem[] => {
  return [...executionHistoryDb].sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
};
