import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import axios from 'axios';

/** エラーからHTTPステータスコードを安全に抽出 */
const getErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) return error.response?.status;
  if (error && typeof error === 'object' && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined;
  }
  return undefined;
};

/** 全 Query / Mutation のグローバルエラーハンドリング */
const handleGlobalError = (error: unknown) => {
  // 401 → ログアウトイベントを発火（http インターセプタでリフレッシュ失敗後に到達）
  const status = getErrorStatus(error);
  if (status === 401) {
    window.dispatchEvent(new Event('auth:logout'));
  }
  console.error('[QueryClient] Error:', error);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError,
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 認証エラー・権限エラー・404 はリトライしない
        const status = getErrorStatus(error);
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
