/**
 * 投稿管理 API サービス
 * ─────────────────────────────────────────────
 * 画面: PostCreateScreen, PostsListScreen, PostDetailScreenB,
 *       ScheduledPostsScreen, ScheduledPostEditScreen, PostDraftsScreen
 * DTO: post.dto.ts — Zod: post.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  postCreateRequestSchema,
  postCreateResponseSchema,
  postSearchParamsSchema,
  postDetailEditRequestSchema,
  scheduledPostUpdateRequestSchema,
  scheduledPostListParamsSchema,
} from '../../types/schemas';
import type {
  PostCreateRequest, PostCreateResponse,
  PostSearchParams, PostSearchResponse,
  PostDetailEditRequest,
  ScheduledPostUpdateRequest, ScheduledPostUpdateResponse,
  ScheduledPostListParams, ScheduledPostListResponse,
  PostDraftListResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const postApi = {
  /** 投稿作成 POST /events */
  create: async (req: PostCreateRequest): Promise<PostCreateResponse> => {
    const validated = postCreateRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<PostCreateResponse>>(endpoints.events, validated);
    return postCreateResponseSchema.parse(unwrap(res));
  },

  /** 投稿検索 GET /events/search */
  search: async (params: PostSearchParams): Promise<PostSearchResponse> => {
    const validated = postSearchParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<PostSearchResponse>>(
      endpoints.eventsSearch,
      { params: validated },
    );
    return unwrap(res);
  },

  /** 投稿詳細取得 GET /events/:id */
  detail: async (postId: string): Promise<unknown> => {
    const res = await apiClient.get<ApiResponse<unknown>>(endpoints.event(postId));
    return unwrap(res);
  },

  /** 投稿詳細編集 PUT /events/:id */
  editDetail: async (postId: string, req: PostDetailEditRequest): Promise<void> => {
    const validated = postDetailEditRequestSchema.parse(req);
    await apiClient.put(endpoints.event(postId), validated);
  },

  /** スケジュール投稿一覧 GET /events/scheduled */
  listScheduled: async (params: ScheduledPostListParams): Promise<ScheduledPostListResponse> => {
    const validated = scheduledPostListParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<ScheduledPostListResponse>>(
      endpoints.eventsScheduled,
      { params: validated },
    );
    return unwrap(res);
  },

  /** スケジュール投稿更新 PUT /events/:id/schedule */
  updateScheduled: async (eventId: string, req: ScheduledPostUpdateRequest): Promise<ScheduledPostUpdateResponse> => {
    const validated = scheduledPostUpdateRequestSchema.parse(req);
    const res = await apiClient.put<ApiResponse<ScheduledPostUpdateResponse>>(
      endpoints.event(eventId),
      validated,
    );
    return unwrap(res);
  },

  /** スケジュール投稿削除 DELETE /events/:id/schedule */
  deleteScheduled: async (eventId: string): Promise<void> => {
    await apiClient.delete(endpoints.eventScheduleDelete(eventId));
  },

  /** 下書き一覧 GET /events/drafts */
  listDrafts: async (): Promise<PostDraftListResponse> => {
    const res = await apiClient.get<ApiResponse<PostDraftListResponse>>(endpoints.eventsDrafts);
    return unwrap(res);
  },

  /** 今日の投稿一覧 GET /events/today */
  listToday: async (params?: PostSearchParams): Promise<PostSearchResponse> => {
    const res = await apiClient.get<ApiResponse<PostSearchResponse>>(
      endpoints.eventsToday,
      { params },
    );
    return unwrap(res);
  },

  /** 明日の投稿一覧 GET /events/tomorrow */
  listTomorrow: async (params?: PostSearchParams): Promise<PostSearchResponse> => {
    const res = await apiClient.get<ApiResponse<PostSearchResponse>>(
      endpoints.eventsTomorrow,
      { params },
    );
    return unwrap(res);
  },
};
