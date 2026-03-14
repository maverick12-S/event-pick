/**
 * useAsyncErrorBoundary
 * ─────────────────────────────────────────────
 * 非同期エラー（useEffect / イベントハンドラ / Promise）を
 * React ErrorBoundary へブリッジするフック。
 *
 * React の ErrorBoundary はレンダリング中の同期エラーのみキャッチするため、
 * 非同期処理のエラーは手動で state 経由で再 throw する必要がある。
 */

import { useCallback, useState } from 'react';

/**
 * 非同期エラーを ErrorBoundary へ伝搬させるフック。
 *
 * @example
 * ```tsx
 * const throwToErrorBoundary = useAsyncErrorBoundary();
 *
 * useEffect(() => {
 *   fetchData().catch(throwToErrorBoundary);
 * }, []);
 *
 * const handleClick = async () => {
 *   try {
 *     await someAction();
 *   } catch (err) {
 *     throwToErrorBoundary(err);
 *   }
 * };
 * ```
 */
export function useAsyncErrorBoundary(): (error: unknown) => void {
  const [, setError] = useState<unknown>();

  return useCallback((error: unknown) => {
    setError(() => {
      throw error instanceof Error ? error : new Error(String(error));
    });
  }, []);
}
