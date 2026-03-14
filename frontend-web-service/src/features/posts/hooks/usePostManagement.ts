/**
 * postManagement の全操作を一元管理するフック。
 * 画面は本フック経由でデータを取得・更新する。
 * API 移行時は本ファイルの実装のみ差し替えれば全画面に反映される。
 *
 * - コンポーネント内: usePostManagement() を呼び出す
 * - モジュールスコープ（コンポーネント外）: postManagementApi を直接使う
 */
import postManagementMockApi from '../../../api/mock/postManagementMockApi';

/** コンポーネント外（モジュールスコープ）で使う場合 */
export const postManagementApi = postManagementMockApi;

/** コンポーネント内で使うフック */
export const usePostManagement = () => postManagementMockApi;
