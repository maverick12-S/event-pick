import { CURRENT_LOCATION_ID, scheduledPostsDb } from '../db/scheduledPosts.db';
import type { ScheduledPostItem } from '../../types/models/scheduledPost';
import {
  listPostDrafts,
  upsertPostDraft,
  deletePostDraft,
} from '../db/postDrafts.db';
import type { PostDraftItem, PostDraftPayload } from '../../types/models/postDraft';
import { postsDb } from '../db/posts.screen';
import type { PostEventDbItem } from '../../types/models/post';
import { categoryOptions, cityOptions, prefectureOptions, timeSlotOptions } from '../db/posts.screen';

const mapScheduledToPostEvent = (item: ScheduledPostItem): PostEventDbItem => ({
  id: `scheduled-${item.id}`,
  title: item.title,
  ward: item.ward,
  venue: item.venue,
  description: item.description,
  category: item.category,
  dateLabel: item.dateLabel,
  timeLabel: item.timeLabel,
  imageUrl: item.imageUrl,
  imageUrls: [item.imageUrl],
  detailPath: `/posts/scheduled/${item.id}`,
  detailLabel: '詳細を見る',
  reservationContact: 'https://www.google.com/',
  tab: 'scheduled',
});

export const postManagementMockApi = {
  getCurrentLocationId: (): string => CURRENT_LOCATION_ID,

  getPostFilterOptions: () => ({
    categories: [...categoryOptions],
    cities: [...cityOptions],
    prefectures: [...prefectureOptions],
    timeSlots: [...timeSlotOptions],
  }),

  listScheduledPosts: (): ScheduledPostItem[] => scheduledPostsDb.map((item) => ({ ...item })),

  findScheduledPostById: (id: string | undefined): ScheduledPostItem | null => {
    if (!id) return null;
    const found = scheduledPostsDb.find((item) => item.id === id);
    return found ? { ...found } : null;
  },

  updateScheduledPostById: (
    id: string,
    payload: Partial<Pick<ScheduledPostItem, 'title' | 'ward' | 'venue' | 'category' | 'description' | 'timeLabel' | 'nextPostDate'>>
      & { condition?: Partial<ScheduledPostItem['condition']> },
  ): ScheduledPostItem | null => {
    const index = scheduledPostsDb.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const current = scheduledPostsDb[index];
    const updated: ScheduledPostItem = {
      ...current,
      ...payload,
      condition: payload.condition
        ? {
          ...current.condition,
          ...payload.condition,
        }
        : current.condition,
      updatedAt: new Date().toISOString(),
    };
    scheduledPostsDb[index] = updated;
    return { ...updated };
  },

  listScheduledPostsByLocation: (locationId: string): ScheduledPostItem[] =>
    scheduledPostsDb.filter((item) => item.locationId === locationId).map((item) => ({ ...item })),

  listScheduledPostEventCardsByLocation: (locationId: string): PostEventDbItem[] =>
    scheduledPostsDb
      .filter((item) => item.locationId === locationId)
      .map((item) => mapScheduledToPostEvent(item)),

  findPostEventByRoute: (tab: string | undefined, id: string | undefined): PostEventDbItem | null => {
    if (!tab || !id) return null;
    const key = `${tab}-${id}`;
    return postsDb.find((entry) => entry.id === key) ?? null;
  },

  listPostDrafts: (): PostDraftItem[] => listPostDrafts(),

  upsertPostDraft: (payload: PostDraftPayload): PostDraftItem | null => upsertPostDraft(payload),

  deletePostDraft: (id: string): void => {
    deletePostDraft(id);
  },
};

export default postManagementMockApi;
