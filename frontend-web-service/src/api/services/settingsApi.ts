/**
 * 設定 API サービス
 * ─────────────────────────────────────────────
 * 画面: SettingsAccountScreen, SettingsNotificationsScreen, SettingsContactScreen,
 *       SettingsHistoryScreen, SettingsBillingScreen, SettingsBillingEditScreen
 * DTO: settings.dto.ts — Zod: settings.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  settingsAccountUpdateRequestSchema,
  billingAddressUpdateRequestSchema,
  notificationSettingsPayloadSchema,
  contactInquiryRequestSchema,
  contactInquiryResponseSchema,
  executionHistoryListParamsSchema,
} from '../../types/schemas';
import type {
  SettingsAccountUpdateRequest, SettingsAccountUpdateResponse,
  BillingAddressUpdateRequest, BillingAddressUpdateResponse,
  BillingDataResponse,
  NotificationSettingsPayload, NotificationSettingsResponse,
  ContactInquiryRequest, ContactInquiryResponse,
  ExecutionHistoryListParams, ExecutionHistoryListResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const settingsApi = {
  /** アカウント情報更新 PUT /companies/me */
  updateAccount: async (req: SettingsAccountUpdateRequest): Promise<SettingsAccountUpdateResponse> => {
    const validated = settingsAccountUpdateRequestSchema.parse(req);
    const res = await apiClient.put<ApiResponse<SettingsAccountUpdateResponse>>(
      endpoints.companiesMeUpdate,
      validated,
    );
    return unwrap(res);
  },

  /** 請求先住所更新 PUT /billing/address */
  updateBillingAddress: async (req: BillingAddressUpdateRequest): Promise<BillingAddressUpdateResponse> => {
    const validated = billingAddressUpdateRequestSchema.parse(req);
    const res = await apiClient.put<ApiResponse<BillingAddressUpdateResponse>>(
      endpoints.billingAddress,
      validated,
    );
    return unwrap(res);
  },

  /** 請求データ取得 GET /billing */
  getBillingData: async (): Promise<BillingDataResponse> => {
    const res = await apiClient.get<ApiResponse<BillingDataResponse>>(endpoints.billingRoot);
    return unwrap(res);
  },

  /** 通知設定更新 PUT /companies/me/notifications */
  updateNotifications: async (payload: NotificationSettingsPayload): Promise<NotificationSettingsResponse> => {
    const validated = notificationSettingsPayloadSchema.parse(payload);
    const res = await apiClient.put<ApiResponse<NotificationSettingsResponse>>(
      endpoints.companiesMeNotifications,
      { settings: validated },
    );
    return unwrap(res);
  },

  /** 通知設定取得 GET /companies/me/notifications */
  getNotifications: async (): Promise<NotificationSettingsResponse> => {
    const res = await apiClient.get<ApiResponse<NotificationSettingsResponse>>(
      endpoints.companiesMeNotifications,
    );
    return unwrap(res);
  },

  /** お問い合わせ送信 POST /inquiries */
  submitInquiry: async (req: ContactInquiryRequest): Promise<ContactInquiryResponse> => {
    const validated = contactInquiryRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<ContactInquiryResponse>>(
      endpoints.inquiries,
      validated,
    );
    return contactInquiryResponseSchema.parse(unwrap(res));
  },

  /** 実行履歴一覧 GET /execution-history */
  listExecutionHistory: async (params: ExecutionHistoryListParams): Promise<ExecutionHistoryListResponse> => {
    const validated = executionHistoryListParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<ExecutionHistoryListResponse>>(
      endpoints.executionHistory,
      { params: validated },
    );
    return unwrap(res);
  },
};
