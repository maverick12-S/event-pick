export type { PostsTabKey, PostEventDbItem } from '../../types/models/post';
import type { PostsTabKey, PostEventDbItem } from '../../types/models/post';

import { toFourByFiveUnsplash } from './mockImages';

export const cityOptions = [
  '渋谷区',
  '新宿区',
  '港区',
  '千代田区',
  '中央区',
  '台東区',
  '墨田区',
  '江東区',
  '品川区',
  '目黒区',
  '大田区',
  '世田谷区',
  '中野区',
  '杉並区',
  '豊島区',
  '北区',
  '荒川区',
  '板橋区',
  '練馬区',
  '足立区',
  '葛飾区',
  '江戸川区',
  '文京区',
];

export const categoryOptions = ['食事', '体験', '買い物', 'イベント', 'ライブ', '観光', '祭り', '温泉', '車'];
export const prefectureOptions = ['東京都', '神奈川県', '千葉県', '埼玉県'];
export const timeSlotOptions = ['朝', '昼', '夕方', '夜'];

const descriptionTemplates = [
  '10店舗以上の人気店が集まり、食べ歩きとライブを同時に楽しめます。',
  '家族でも参加しやすい体験ブースとステージ企画を終日開催。',
  '地域クリエイターが集まる展示とトークで街の魅力を発信します。',
  '夜はライトアップ演出つきで、フォトスポットも多数用意。',
];

const imagePool = [
  'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1464375117522-1311dd6a1f8b?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=960&q=80',
].map((url) => toFourByFiveUnsplash(url, 960));

const buildImageUrls = (index: number): string[] => {
  const count = 4 + (index % 7);
  return Array.from({ length: count }, (_, photoIndex) => imagePool[(index + photoIndex) % imagePool.length]);
};

const buildRows = (count: number, tab: PostsTabKey, dateLabel: string): PostEventDbItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const ward = cityOptions[i % cityOptions.length];
    const category = categoryOptions[i % categoryOptions.length];
    const hours = 10 + (i % 8);
    const end = hours + 2;
    const imageUrls = buildImageUrls(i);
    const eventId = `${tab}-${i + 1}`;
    const reservationContact =
      i % 2 === 0
        ? `03-45${String((i % 90) + 10)}-${String((i % 9000) + 1000)}`
        : 'https://www.google.com/';

    return {
      id: eventId,
      title: `${ward}${category}フェス 2026-${String((i % 12) + 1).padStart(2, '0')}`,
      ward,
      venue: `${ward}駅前広場${(i % 4) + 1}-${(i % 3) + 1}-${(i % 9) + 1}`,
      description: descriptionTemplates[i % descriptionTemplates.length],
      category,
      dateLabel,
      timeLabel: `${String(hours).padStart(2, '0')}:00-${String(end).padStart(2, '0')}:00`,
      imageUrl: imageUrls[0],
      imageUrls,
      detailPath: `/posts/${tab}/${i + 1}`,
      detailLabel: '詳細を見る',
      reservationContact,
      tab,
    };
  });
};

export const postsDb: PostEventDbItem[] = [
  ...buildRows(130, 'today', '2026-03-06'),
  ...buildRows(88, 'tomorrow', '2026-03-07'),
  ...buildRows(74, 'scheduled', '2026-03-08~'),
];
