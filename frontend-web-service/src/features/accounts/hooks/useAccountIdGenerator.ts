import accountsMockApi from '../../../api/mock/accountsMockApi';

/**
 * アカウントID生成。API移行時は本ファイルのみ差し替え。
 */
export const useAccountIdGenerator = () => {
  return () => accountsMockApi.generateAccountId();
};
