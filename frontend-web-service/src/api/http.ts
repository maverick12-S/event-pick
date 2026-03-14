import axios, { type AxiosRequestConfig, type AxiosHeaders } from 'axios';
import { API_PREFIX } from './endpoints';
import { tokenService } from './tokenService';

export const apiClient = axios.create({
  baseURL: API_PREFIX,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Attach Authorization header from tokenService for all requests
apiClient.interceptors.request.use((config) => {
  try {
    const token = tokenService.getAccessToken();
    if (token) {
      if (!config.headers) config.headers = new axios.AxiosHeaders();
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
  } catch (err) {
    // swallow - do not block requests if token retrieval fails
    console.error('apiClient interceptor error', err);
  }
  return config;
});

// Response interceptor: try to refresh access token on 401 and retry original request
// Manage single refresh flow when multiple requests receive 401
type AxiosRequestConfigWithRetry = AxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  originalRequest: AxiosRequestConfigWithRetry;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token) {
        const merged = new axios.AxiosHeaders(p.originalRequest.headers as Record<string, string> | undefined);
        merged.set('Authorization', `Bearer ${token}`);
        p.originalRequest.headers = merged;
      }
      p.resolve(apiClient(p.originalRequest));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const originalRequest = error.config as AxiosRequestConfigWithRetry | undefined;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status !== 401) return Promise.reject(error);

    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, originalRequest });
      });
    }

    isRefreshing = true;
    try {
      const refreshRes = await axios.post(`${API_PREFIX}/auth/refresh`, {}, { withCredentials: true });
      const body = refreshRes.data;
      const tokens = body?.data ?? null;
      if (body?.success && tokens) {
        tokenService.setAccessToken(tokens.access_token ?? null);
        tokenService.setRefreshToken(tokens.refresh_token ?? null);
        processQueue(null, tokens.access_token ?? null);
        const mergedHeaders = new axios.AxiosHeaders(originalRequest.headers as Record<string, string> | undefined);
        mergedHeaders.set('Authorization', `Bearer ${tokens.access_token}`);
        originalRequest.headers = mergedHeaders;
        return apiClient(originalRequest);
      }
      // fallback: treat as failure
      processQueue(new Error('Refresh failed'), null);
      try { tokenService.clear(); } catch { /* noop */ }
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      try { tokenService.clear(); } catch { /* noop */ }
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
