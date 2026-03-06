// Token storage abstraction
// 環境変数 VITE_AUTH_USE_COOKIES=true の場合は httpOnly cookie を使う想定
const USE_COOKIES = import.meta.env.VITE_AUTH_USE_COOKIES === 'true';
const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';
// モック認証時は必ず localStorage を使って ProtectedRoute 判定を通す
const EFFECTIVE_USE_COOKIES = USE_COOKIES && !USE_MOCK_AUTH;

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenService = {
  isUsingCookies(): boolean {
    return EFFECTIVE_USE_COOKIES;
  },

  getAccessToken(): string | null {
    if (EFFECTIVE_USE_COOKIES) return null; // httpOnly cookie は JS から取得不可
    return localStorage.getItem(ACCESS_KEY);
  },

  setAccessToken(token: string | null) {
    if (EFFECTIVE_USE_COOKIES) return; // cookie サーバ側で管理
    if (token) localStorage.setItem(ACCESS_KEY, token);
    else localStorage.removeItem(ACCESS_KEY);
  },

  getRefreshToken(): string | null {
    if (EFFECTIVE_USE_COOKIES) return null;
    return localStorage.getItem(REFRESH_KEY);
  },

  setRefreshToken(token: string | null) {
    if (EFFECTIVE_USE_COOKIES) return;
    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  },

  clear() {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch (err: unknown) {
      console.error('tokenService.clear error', err);
    }
  }
};

export default tokenService;
