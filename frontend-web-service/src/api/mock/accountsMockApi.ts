import {
  baseAccountsDb,
  defaultCompanyCode,
  type AccountStatus,
  type BaseAccountItem,
  type ContractPlan,
} from '../db/accounts.screen';

export type AccountsSortKey = 'name-asc' | 'name-desc' | 'id-asc' | 'status' | 'plan';

export interface GetAccountsParams {
  query?: string;
  sortBy?: AccountsSortKey;
}

export interface AccountsListResponse {
  companyCode: string;
  items: BaseAccountItem[];
}

export interface IssueAccountPayload {
  baseName: string;
  displayName: string;
  address: string;
  initialPassword: string;
  plan: ContractPlan;
}

export interface IssueAccountResponse {
  id: string;
  accountId: string;
}

const statusWeight: Record<AccountStatus, number> = {
  利用中: 0,
  停止中: 1,
};

const planWeight: Record<ContractPlan, number> = {
  プレミアムプラン: 0,
  スタンダードプラン: 1,
  ライトプラン: 2,
};

const sortItems = (items: BaseAccountItem[], sortBy: AccountsSortKey): BaseAccountItem[] => {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortBy === 'name-asc') return a.baseName.localeCompare(b.baseName, 'ja');
    if (sortBy === 'name-desc') return b.baseName.localeCompare(a.baseName, 'ja');
    if (sortBy === 'id-asc') return a.accountId.localeCompare(b.accountId, 'en');
    if (sortBy === 'status') return statusWeight[a.status] - statusWeight[b.status] || a.baseName.localeCompare(b.baseName, 'ja');
    return planWeight[a.plan] - planWeight[b.plan] || a.baseName.localeCompare(b.baseName, 'ja');
  });
  return sorted;
};

export const accountsMockApi = {
  generateAccountId: (): string => {
    const now = new Date();
    const year = String(now.getFullYear());
    const seed = String(now.getTime()).slice(-5);
    return `LOC-${year}-${seed}`;
  },

  getAccounts: async (params: GetAccountsParams): Promise<AccountsListResponse> => {
    const query = (params.query ?? '').trim().toLowerCase();
    const filtered = baseAccountsDb.filter((item) => {
      if (!query) return true;
      return item.baseName.toLowerCase().includes(query) || item.accountId.toLowerCase().includes(query);
    });

    const sorted = sortItems(filtered, params.sortBy ?? 'name-asc');

    return Promise.resolve({
      companyCode: defaultCompanyCode,
      items: sorted.map((item) => ({ ...item })),
    });
  },

  issueAccount: async (payload: IssueAccountPayload): Promise<IssueAccountResponse> => {
    const accountId = accountsMockApi.generateAccountId();
    const id = `acc-${Date.now()}`;

    // Keep list data shape aligned with account list screen for future API replacement.
    baseAccountsDb.unshift({
      id,
      companyCode: defaultCompanyCode,
      baseName: payload.baseName,
      accountId,
      status: '利用中',
      plan: payload.plan,
    });

    return Promise.resolve({ id, accountId });
  },
};

export default accountsMockApi;
