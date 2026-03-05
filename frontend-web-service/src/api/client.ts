import endpoints from './endpoints';
import { apiClient } from './http';
export { apiClient } from './http';
const unwrap = async <T>(p: Promise<{ data: any }>): Promise<T> => {
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
  list: (params?: Record<string, unknown>) => unwrap<unknown[]>(apiClient.get(endpoints.companies, { params })),
  get: (companyId: string) => unwrap<unknown>(apiClient.get(endpoints.company(companyId))),
  create: (payload: unknown) => unwrap<unknown>(apiClient.post(endpoints.companies, payload)),
  update: (companyId: string, payload: unknown) => unwrap<unknown>(apiClient.put(endpoints.company(companyId), payload)),
  updateStatus: (companyId: string, payload: unknown) => unwrap<unknown>(apiClient.patch(endpoints.companyStatus(companyId), payload)),
  review: (companyId: string, payload: unknown) => unwrap<unknown>(apiClient.post(endpoints.companyReview(companyId), payload)),
  delete: (companyId: string) => unwrap<void>(apiClient.delete(endpoints.company(companyId))),
};

// Hooks moved to services.ts

// ===== Events =====
export const eventApi = {
  list: (params?: Record<string, unknown>) => unwrap<unknown[]>(apiClient.get(endpoints.events, { params })),
  get: (eventId: string) => unwrap<unknown>(apiClient.get(endpoints.event(eventId))),
  create: (payload: unknown) => unwrap<unknown>(apiClient.post(endpoints.events, payload)),
  update: (eventId: string, payload: unknown) => unwrap<unknown>(apiClient.put(endpoints.event(eventId), payload)),
  hide: (eventId: string) => unwrap<unknown>(apiClient.post(endpoints.eventHide(eventId))),
  publish: (eventId: string) => unwrap<unknown>(apiClient.post(endpoints.eventPublish(eventId))),
};

// Hooks moved to services.ts

// ===== Users =====
export const userApi = {
  list: (params?: Record<string, unknown>) => unwrap<unknown[]>(apiClient.get(endpoints.users, { params })),
  get: (userId: string) => unwrap<unknown>(apiClient.get(`${endpoints.users}/${userId}`)),
  suspend: (userId: string) => unwrap<unknown>(apiClient.post(endpoints.users + `/${userId}/suspend`)),
};

// Hooks moved to services.ts

// ===== Auth =====
export const authService = {
  login: (payload: unknown) => unwrap<unknown>(apiClient.post(endpoints.authLogin, payload)),
  logout: () => unwrap<void>(apiClient.post(endpoints.authLogout)),
  refresh: () => unwrap<unknown>(apiClient.post(endpoints.authRefresh)),
};

export default {
  companyApi,
  eventApi,
  userApi,
  authService,
};