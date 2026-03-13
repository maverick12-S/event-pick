/** アカウントソート・クエリの型定義 */

export type AccountsSortKey = 'name-asc' | 'name-desc' | 'id-asc' | 'status' | 'plan';

export interface GetAccountsParams {
  query?: string;
  sortBy?: AccountsSortKey;
}
