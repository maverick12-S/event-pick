export type { AccountStatus, ContractPlan, BaseAccountItem } from '../../types/models/account';
import type { BaseAccountItem } from '../../types/models/account';

export const defaultCompanyCode = 'CORP-EP-001';

export const baseAccountsDb: BaseAccountItem[] = [
  { id: '1', companyCode: defaultCompanyCode, baseName: '東京本社', accountId: 'TK-001', status: '利用中', plan: 'プレミアムプラン' },
  { id: '2', companyCode: defaultCompanyCode, baseName: '大阪支店', accountId: 'OS-002', status: '利用中', plan: 'スタンダードプラン' },
  { id: '3', companyCode: defaultCompanyCode, baseName: '福岡営業所', accountId: 'FK-003', status: '停止中', plan: 'ライトプラン' },
  { id: '4', companyCode: defaultCompanyCode, baseName: '東京支店', accountId: 'KG-004', status: '停止中', plan: 'プレミアムプラン' },
  { id: '5', companyCode: defaultCompanyCode, baseName: '名古屋支店', accountId: 'NG-005', status: '利用中', plan: 'スタンダードプラン' },
];
