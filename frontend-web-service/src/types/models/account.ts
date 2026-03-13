/** アカウント関連の型定義 */

export type AccountStatus = '利用中' | '停止中' | '削除予定';

export type ContractPlan = 'プレミアムプラン' | 'スタンダードプラン' | 'ライトプラン';

export interface BaseAccountItem {
  id: string;
  companyCode: string;
  baseName: string;
  accountId: string;
  status: AccountStatus;
  plan: ContractPlan;
  scheduledDeletionAt?: string;
}
