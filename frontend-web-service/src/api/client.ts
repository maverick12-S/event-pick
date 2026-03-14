import endpoints from './endpoints';
import { apiClient } from './http';
import type { ApiResponse } from '../types/dto/common';
import type { Company } from '../types/entities';
import type { EventPost, UserAccount } from '../types/entities';
import type { LoginRequest, LoginResponse } from '../types/auth';
import type { RefreshTokenResponse } from '../types/dto/auth.dto';
import type { CompanyReview } from '../types/entities';
export { apiClient } from './http';

const unwrap = async <T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> => {
  const res = await p;
  const body = res.data;
  if (!body || body.success === false) {
    const msg = body?.error?.message || 'API error';
    throw new Error(msg);
  }
  return body.data as T;
};

// ===== Companies =====
export const companyApi = {
  list: (params?: Record<string, unknown>) => unwrap<Company[]>(apiClient.get(endpoints.companies, { params })),
  get: (companyId: string) => unwrap<Company>(apiClient.get(endpoints.company(companyId))),
  create: (payload: Record<string, unknown>) => unwrap<Company>(apiClient.post(endpoints.companies, payload)),
  update: (companyId: string, payload: Record<string, unknown>) => unwrap<Company>(apiClient.put(endpoints.company(companyId), payload)),
  updateStatus: (companyId: string, payload: { status: string }) => unwrap<Company>(apiClient.patch(endpoints.companyStatus(companyId), payload)),
  review: (companyId: string, payload: Record<string, unknown>) => unwrap<CompanyReview>(apiClient.post(endpoints.companyReview(companyId), payload)),
  delete: (companyId: string) => unwrap<void>(apiClient.delete(endpoints.company(companyId))),
};

// Hooks moved to services.ts

// ===== Events =====
export const eventApi = {
  list: (params?: Record<string, unknown>) => unwrap<EventPost[]>(apiClient.get(endpoints.events, { params })),
  get: (eventId: string) => unwrap<EventPost>(apiClient.get(endpoints.event(eventId))),
  create: (payload: Record<string, unknown>) => unwrap<EventPost>(apiClient.post(endpoints.events, payload)),
  update: (eventId: string, payload: Record<string, unknown>) => unwrap<EventPost>(apiClient.put(endpoints.event(eventId), payload)),
  hide: (eventId: string) => unwrap<EventPost>(apiClient.post(endpoints.eventHide(eventId))),
  publish: (eventId: string) => unwrap<EventPost>(apiClient.post(endpoints.eventPublish(eventId))),
};

// Hooks moved to services.ts

// ===== Users =====
export const userApi = {
  list: (params?: Record<string, unknown>) => unwrap<UserAccount[]>(apiClient.get(endpoints.users, { params })),
  get: (userId: string) => unwrap<UserAccount>(apiClient.get(`${endpoints.users}/${userId}`)),
  suspend: (userId: string) => unwrap<void>(apiClient.post(endpoints.users + `/${userId}/suspend`)),
};

// Hooks moved to services.ts

// ===== Auth =====
export const authService = {
  login: (payload: LoginRequest) => unwrap<LoginResponse>(apiClient.post(endpoints.authLogin, payload)),
  logout: () => unwrap<void>(apiClient.post(endpoints.authLogout)),
  refresh: () => unwrap<RefreshTokenResponse>(apiClient.post(endpoints.authRefresh)),
};

export default {
  companyApi,
  eventApi,
  userApi,
  authService,
};