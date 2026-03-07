import { categoryOptions, cityOptions } from './posts.screen';

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

const imagePool = [
  'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464375117522-1311dd6a1f8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&q=80',
];

const hashtagSets: string[][] = [
  ['#東京グルメ', '#食べ歩き', '#フェス'],
  ['#体験イベント', '#ファミリー', '#週末おでかけ'],
  ['#ライブ', '#音楽フェス', '#東京'],
  ['#観光', '#東京観光', '#おすすめスポット'],
  ['#祭り', '#夏祭り', '#地域イベント'],
  ['#温泉', '#癒し', '#リラックス'],
];

const platformSets: PostCondition['platforms'][] = [
  ['Instagram', 'Twitter'],
  ['Instagram'],
  ['Instagram', 'Facebook'],
  ['Twitter', 'LINE'],
  ['Instagram', 'Twitter', 'Facebook'],
];

const repeatIntervals: PostCondition['repeatInterval'][] = ['毎日', '毎週', '毎月', 'なし'];

const statusList: ScheduledPostItem['status'][] = ['scheduled', 'scheduled', 'scheduled', 'posted', 'paused'];

const captionTemplates = [
  'フェスの見どころを写真と動画で紹介してください。',
  'お気に入りのグルメ写真と感想を投稿してください。',
  'イベントの雰囲気が伝わる動画を短くまとめて投稿してください。',
  '会場の魅力とアクセス情報をあわせて発信してください。',
];

const addDays = (base: string, n: number): string => {
  const date = new Date(base);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
};

const BASE_DATE = '2026-03-06';

const buildScheduledRows = (
  count: number,
  locationId: string,
  idStart: number,
): ScheduledPostItem[] =>
  Array.from({ length: count }, (_, i) => {
    const ward = cityOptions[i % cityOptions.length];
    const category = categoryOptions[i % categoryOptions.length];
    const hours = 10 + (i % 8);
    const end = hours + 2;
    const nextDays = 1 + ((i * 3) % 30);

    const condition: PostCondition = {
      hashtags: hashtagSets[i % hashtagSets.length],
      platforms: platformSets[i % platformSets.length],
      autoPost: i % 3 !== 0,
      repeatInterval: repeatIntervals[i % repeatIntervals.length],
      captionTemplate: captionTemplates[i % captionTemplates.length],
    };

    return {
      // 既存詳細ルート `/posts/scheduled/:id` に接続できるよう数値文字列IDを利用
      id: String(idStart + i),
      locationId,
      title: `${ward}${category}フェス 2026-${String((i % 12) + 1).padStart(2, '0')}`,
      ward,
      venue: `${ward}駅前広場${(i % 4) + 1}-${(i % 3) + 1}-${(i % 9) + 1}`,
      category,
      description: [
        'フェスの見どころを詳しく紹介してください。ハッシュタグを活用して拡散を狙います。',
        'お気に入りのグルメ写真を撮影し、来場したくなる導線を作ってください。',
        'イベントの様子を写真や動画でキャプチャし、SNSに掲載してください。',
        'ステージや展示の魅力を短く分かりやすく投稿してください。',
      ][i % 4],
      dateLabel: addDays(BASE_DATE, i % 14),
      timeLabel: `${String(hours).padStart(2, '0')}:00-${String(end).padStart(2, '0')}:00`,
      imageUrl: imagePool[i % imagePool.length],
      condition,
      nextPostDate: addDays(BASE_DATE, nextDays),
      status: statusList[i % statusList.length],
      createdAt: `${addDays(BASE_DATE, -(i % 10))}T09:00:00`,
      updatedAt: `${addDays(BASE_DATE, -(i % 5))}T12:30:00`,
    };
  });

export const scheduledPostsDb: ScheduledPostItem[] = [
  ...buildScheduledRows(18, 'loc-001', 1),
  ...buildScheduledRows(6, 'loc-002', 101),
];

export const CURRENT_LOCATION_ID = 'loc-001';
