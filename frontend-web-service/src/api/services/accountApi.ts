/**
 * アカウント管理 API サービス
 * ─────────────────────────────────────────────
 * 画面: AccountsIssueScreen, AccountsEditScreen, AccountsListScreen
 * DTO: account.dto.ts — Zod: account.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  accountIssueRequestSchema,
  accountIssueResponseSchema,
  accountUpdateRequestSchema,
  accountDeleteRequestSchema,
  accountCancelDeletionRequestSchema,
  accountListParamsSchema,
  accountDetailResponseSchema,
} from '../../types/schemas';
import type {
  AccountIssueRequest, AccountIssueResponse,
  AccountUpdateRequest, AccountUpdateResponse,
  AccountDeleteRequest, AccountDeleteResponse,
  AccountCancelDeletionRequest, AccountCancelDeletionResponse,
  AccountListParams, AccountListResponse,
  AccountDetailResponse,
  ApiResponse,
} from '../../types/dto';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const accountApi = {
  /** アカウント一覧 GET /company-accounts */
  list: async (params: AccountListParams): Promise<AccountListResponse> => {
    const validated = accountListParamsSchema.parse(params);
    const res = await apiClient.get<ApiResponse<AccountListResponse>>(
      endpoints.companyAccounts,
      { params: validated },
    );
    return unwrap(res);
  },

  /** アカウント詳細 GET /company-accounts/:id */
  detail: async (accountId: string): Promise<AccountDetailResponse> => {
    const res = await apiClient.get<ApiResponse<AccountDetailResponse>>(
      endpoints.companyAccount(accountId),
    );
    return accountDetailResponseSchema.parse(unwrap(res));
  },

  /** アカウント払出 POST /company-accounts */
  issue: async (req: AccountIssueRequest): Promise<AccountIssueResponse> => {
    const validated = accountIssueRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<AccountIssueResponse>>(
      endpoints.companyAccounts,
      validated,
    );
    return accountIssueResponseSchema.parse(unwrap(res));
  },

  /** アカウント更新 PUT /company-accounts/:id */
  update: async (accountId: string, req: AccountUpdateRequest): Promise<AccountUpdateResponse> => {
    const validated = accountUpdateRequestSchema.parse(req);
    const res = await apiClient.put<ApiResponse<AccountUpdateResponse>>(
      endpoints.companyAccount(accountId),
      validated,
    );
    return unwrap(res);
  },

  /** アカウント削除 DELETE /company-accounts/:id */
  delete: async (req: AccountDeleteRequest): Promise<AccountDeleteResponse> => {
    const validated = accountDeleteRequestSchema.parse(req);
    const res = await apiClient.delete<ApiResponse<AccountDeleteResponse>>(
      endpoints.companyAccount(validated.company_account_id),
    );
    return unwrap(res);
  },

  /** アカウント削除取消 POST /company-accounts/:id/cancel-deletion */
  cancelDeletion: async (req: AccountCancelDeletionRequest): Promise<AccountCancelDeletionResponse> => {
    const validated = accountCancelDeletionRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<AccountCancelDeletionResponse>>(
      `${endpoints.companyAccount(validated.company_account_id)}/cancel-deletion`,
    );
    return unwrap(res);
  },
};
