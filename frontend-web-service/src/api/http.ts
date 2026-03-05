import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
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
      if (!config.headers) config.headers = {} as any;
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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
        p.originalRequest.headers = {
          ...(p.originalRequest.headers as Record<string, unknown> | undefined),
          Authorization: `Bearer ${token}`,
        } as any;
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
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as AxiosRequestConfigWithRetry | undefined;
    if (!originalRequest) return Promise.reject(axiosError);

    if (axiosError.response?.status !== 401) return Promise.reject(axiosError);

    if (originalRequest._retry) return Promise.reject(axiosError);
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
        originalRequest.headers = {
          ...(originalRequest.headers as Record<string, unknown> | undefined),
          Authorization: `Bearer ${tokens.access_token}`,
        } as any;
        return apiClient(originalRequest);
      }
      // fallback: treat as failure
      processQueue(new Error('Refresh failed'), null);
      try { tokenService.clear(); } catch {}
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(axiosError);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      try { tokenService.clear(); } catch {}
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
