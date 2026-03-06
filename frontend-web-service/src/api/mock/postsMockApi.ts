import { postsDb, type PostEventDbItem, type PostsTabKey } from '../db/posts.screen';

export interface GetPostsParams {
  tab: PostsTabKey;
  page?: number;
  limit?: number;
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

export const postsMockApi = {
  getPosts: async (params: GetPostsParams): Promise<PostsPage> => {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.max(params.limit ?? DEFAULT_LIMIT, 1);
    const search = (params.search ?? '').trim();
    const categories = normalizeValues(params.categories);
    const prefectures = normalizeValues(params.prefectures);
    const cities = normalizeValues(params.cities);
    const timeSlots = normalizeValues(params.timeSlots);
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

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const end = start + limit;

    return Promise.resolve({
      items: filtered.slice(start, end).map((item) => ({ ...item })),
      page: safePage,
      limit,
      total,
      totalPages,
    });
  },
};

export default postsMockApi;
