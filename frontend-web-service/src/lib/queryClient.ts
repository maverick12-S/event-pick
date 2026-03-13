import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

/** 全 Query / Mutation のグローバルエラーハンドリング */
const handleGlobalError = (error: unknown) => {
  // 401 → ログアウトイベントを発火（http インターセプタでリフレッシュ失敗後に到達）
  const status = (error as any)?.response?.status ?? (error as any)?.status;
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
        const status = (error as any)?.response?.status ?? (error as any)?.status;
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
