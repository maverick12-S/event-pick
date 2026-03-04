// =============================================
//  原則：通信設定は1箇所に集約する
// interceptorで「全リクエストに共通処理」を注入できる
// ここを変えれば全APIの挙動が変わる = 変更コストが最小
// =============================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenService } from './tokenService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const API_DEBUG = import.meta.env.VITE_API_DEBUG === 'true';

// axiosインスタンスを生成（singletonパターン）
export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

function log(...args: unknown[]) {
    if (API_DEBUG) console.debug('[api]', ...args);
}

// --- リクエストInterceptor ---
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // storage 戦略によってトークン付与方法を変える
        if (!tokenService.isUsingCookies()) {
            const token = tokenService.getAccessToken();
            if (token) {
                config.headers = config.headers ?? {};
                (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
        } else {
            // httpOnly cookie の場合は cookie が自動送信される想定（ブラウザの同一サイトポリシーに注意）
        }
        log('req', config.method, config.url);
        return config;
    },
    (error) => {
        log('req error', error);
        return Promise.reject(error);
    }
);

// --- レスポンスInterceptor（リフレッシュ排他制御を含む） ---
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let subscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
    subscribers.push(cb);
}

function onRefreshed(token: string | null) {
    subscribers.forEach((cb) => cb(token));
    subscribers = [];
}

async function doRefresh(): Promise<string | null> {
    // 既に実行中ならその Promise を返す
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            log('refresh token start');
            if (tokenService.isUsingCookies()) {
                // cookie ベース：サーバに /auth/refresh を叩けば httpOnly cookie が使われる想定
                const { data } = await axios.post(`${BASE_URL}/auth/refresh`);
                // サーバが新しい cookie をセットするならフロントで何もしない
                // ただしアクセストークンを返す場合は保存
                if (data?.access_token) tokenService.setAccessToken(data.access_token);
                return data?.access_token ?? null;
            } else {
                // localStorage ベース
                const refreshToken = tokenService.getRefreshToken();
                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                tokenService.setAccessToken(data.access_token);
                tokenService.setRefreshToken(data.refresh_token ?? null);
                return data.access_token ?? null;
            }
        } catch (err: unknown) {
                log('refresh failed', err);
                console.error(err);
                tokenService.clear();
                // 強制ログアウト
                window.location.href = '/login';
                return null;
            } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        log('res', response.config?.url, response.status);
        return response;
    },
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401: トークン期限切れ想定 → リフレッシュ試行
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await doRefresh();
                // 待機していたリクエストを再送
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token) => {
                        if (token) {
                            originalRequest.headers = originalRequest.headers ?? {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                    // 既にリフレッシュが終わっていれば通知
                    if (!isRefreshing) onRefreshed(newToken);
                });
            } catch (err: unknown) {
                        console.error(err);
                        return Promise.reject(err);
                    }
        }

        // 共通エラーハンドリングの例（必要に応じて拡張）
        log('res error', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

export default apiClient;
