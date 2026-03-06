import { postsDb, type PostEventDbItem, type PostsTabKey } from '../db/posts.screen';

export interface GetPostsParams {
  tab: PostsTabKey;
  page?: number;
  limit?: number;
  search?: string;
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

export const postsMockApi = {
  getPosts: async (params: GetPostsParams): Promise<PostsPage> => {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.max(params.limit ?? DEFAULT_LIMIT, 1);
    const search = (params.search ?? '').trim();

    const filtered = postsDb.filter((item) => {
      if (item.tab !== params.tab) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        includesWord(item.title, search) ||
        includesWord(item.ward, search) ||
        includesWord(item.venue, search) ||
        includesWord(item.category, search)
      );
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
