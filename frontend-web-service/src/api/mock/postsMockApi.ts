import { postsDb, type PostEventDbItem, type PostsTabKey } from '../db/posts.screen';

export type PostListSortKey = 'postedAtDesc' | 'postedAtAsc' | 'titleAsc' | 'likesDesc' | 'recommendedDesc';

export interface GetPostsParams {
  tab: PostsTabKey;
  page?: number;
  limit?: number;
  sortBy?: PostListSortKey;
  search?: string;
  categories?: string[];
  prefectures?: string[];
  cities?: string[];
  timeSlots?: string[];
}

export interface PostsPage {
  items: PostEventDbItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 60;

const includesWord = (value: string, word: string) => {
  return value.toLowerCase().includes(word.toLowerCase());
};

const normalizeValues = (values?: string[]) => {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
};

const detectTimeSlot = (timeLabel: string) => {
  const startHour = Number.parseInt(timeLabel.slice(0, 2), 10);

  if (Number.isNaN(startHour)) {
    return '';
  }

  if (startHour < 12) {
    return '朝';
  }

  if (startHour < 16) {
    return '昼';
  }

  if (startHour < 19) {
    return '夕方';
  }

  return '夜';
};

const toSortableDate = (value: string): number => {
  const normalized = value.replace(/[^0-9-]/g, '');
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getLikeCount = (item: Pick<PostEventDbItem, 'id'>): number => {
  const numericId = Number(item.id.split('-').pop() ?? '1');
  return 20 + (Number.isNaN(numericId) ? 0 : numericId % 360);
};

type SubscriptionTier = 'FREE' | 'LIGHT' | 'STANDARD' | 'PRO';

const SUBSCRIPTION_SCORE_BY_TIER: Record<SubscriptionTier, number> = {
  FREE: 0.7,
  LIGHT: 1.0,
  STANDARD: 1.2,
  PRO: 1.6,
};

const PUBLISHER_SUBSCRIPTION_TIER: Record<string, SubscriptionTier> = {
  渋谷区: 'PRO',
  港区: 'PRO',
  新宿区: 'STANDARD',
  千代田区: 'STANDARD',
  中央区: 'STANDARD',
  品川区: 'STANDARD',
  目黒区: 'LIGHT',
  世田谷区: 'LIGHT',
  杉並区: 'LIGHT',
  豊島区: 'LIGHT',
  北区: 'LIGHT',
  文京区: 'LIGHT',
  台東区: 'FREE',
  墨田区: 'FREE',
  江東区: 'FREE',
  大田区: 'FREE',
  中野区: 'FREE',
  荒川区: 'FREE',
  板橋区: 'FREE',
  練馬区: 'FREE',
  足立区: 'FREE',
  葛飾区: 'FREE',
  江戸川区: 'FREE',
};

const toPublisherKey = (item: Pick<PostEventDbItem, 'ward'>): string => {
  return item.ward || 'default-publisher';
};

const toSubscriptionScore = (publisherKey: string): number => {
  const tier = PUBLISHER_SUBSCRIPTION_TIER[publisherKey] ?? 'LIGHT';
  return SUBSCRIPTION_SCORE_BY_TIER[tier];
};

const toTodayIsoDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toRecommendedScore = (
  item: PostEventDbItem,
  todayPostsByPublisher: Map<string, number>,
): number => {
  const postDate = toSortableDate(item.dateLabel);
  const ageHours = postDate > 0 ? Math.max((Date.now() - postDate) / (1000 * 60 * 60), 0) : 9999;
  const freshness = Math.exp(-ageHours / 48);
  const likes = getLikeCount(item);
  const publisherKey = toPublisherKey(item);
  const todayPosts = todayPostsByPublisher.get(publisherKey) ?? 0;
  const subscriptionScore = toSubscriptionScore(publisherKey);

  // EventPick recommendation score = engagement + freshness + activity + subscription boost.
  return likes * 1.2 + Math.sqrt(todayPosts) * 18 + subscriptionScore * 35 + freshness * 40;
};

const sortItems = (items: PostEventDbItem[], sortBy: PostListSortKey): PostEventDbItem[] => {
  const todayIso = toTodayIsoDate();
  const todayPostsByPublisher = items.reduce((acc, item) => {
    if (!item.dateLabel.startsWith(todayIso)) {
      return acc;
    }
    const key = toPublisherKey(item);
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  return [...items].sort((a, b) => {
    if (sortBy === 'titleAsc') {
      return a.title.localeCompare(b.title, 'ja');
    }

    if (sortBy === 'likesDesc') {
      return getLikeCount(b) - getLikeCount(a);
    }

    if (sortBy === 'recommendedDesc') {
      const scoreDiff = toRecommendedScore(b, todayPostsByPublisher) - toRecommendedScore(a, todayPostsByPublisher);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }
      return getLikeCount(b) - getLikeCount(a);
    }

    const dateDiff = toSortableDate(a.dateLabel) - toSortableDate(b.dateLabel);
    if (sortBy === 'postedAtAsc') {
      return dateDiff;
    }

    return -dateDiff;
  });
};

export const postsMockApi = {
  getPosts: async (params: GetPostsParams): Promise<PostsPage> => {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.max(params.limit ?? DEFAULT_LIMIT, 1);
    const search = (params.search ?? '').trim();
    const categories = normalizeValues(params.categories);
    const prefectures = normalizeValues(params.prefectures);
    const cities = normalizeValues(params.cities);
    const timeSlots = normalizeValues(params.timeSlots);
    const sortBy = params.sortBy ?? 'postedAtDesc';
    const prefecture = '東京都';

    const filtered = postsDb.filter((item) => {
      if (item.tab !== params.tab) {
        return false;
      }

      if (categories.length > 0 && !categories.some((category) => includesWord(item.category, category))) {
        return false;
      }

      if (prefectures.length > 0 && !prefectures.includes(prefecture)) {
        return false;
      }

      if (cities.length > 0 && !cities.some((city) => includesWord(item.ward, city))) {
        return false;
      }

      if (timeSlots.length > 0 && !timeSlots.includes(detectTimeSlot(item.timeLabel))) {
        return false;
      }

      if (!search) {
        return true;
      }

      const matchesSearch = includesWord(item.title, search);

      if (!matchesSearch) {
        return false;
      }

      return true;
    });

    const sorted = sortItems(filtered, sortBy);
    const total = sorted.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const end = start + limit;

    return Promise.resolve({
      items: sorted.slice(start, end).map((item) => ({ ...item })),
      page: safePage,
      limit,
      total,
      totalPages,
    });
  },
};

export default postsMockApi;
