import { baseAccountsDb, defaultCompanyCode } from '../db/accounts.screen';
import type { AccountStatus, BaseAccountItem, ContractPlan } from '../../types/models/account';
import type { AccountsSortKey, GetAccountsParams } from '../../types/models/accountQuery';

export type { AccountsSortKey } from '../../types/models/accountQuery';
export type { GetAccountsParams } from '../../types/models/accountQuery';

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
  couponCode?: string;
}

export interface IssueAccountResponse {
  id: string;
  accountId: string;
}

export interface AccountDetailResponse extends BaseAccountItem {
  address: string;
  email: string;
  password: string;
  paymentInfo: string;
  couponCode: string;
}

export interface UpdateAccountPayload {
  baseName: string;
  address: string;
  email: string;
  password: string;
  plan: ContractPlan;
  paymentInfo: string;
  couponCode: string;
  status: AccountStatus;
}

interface AccountDetailRecord {
  address: string;
  email: string;
  password: string;
  paymentInfo: string;
  couponCode: string;
}

const statusWeight: Record<AccountStatus, number> = {
  利用中: 0,
  停止中: 1,
  削除予定: 2,
};

const planWeight: Record<ContractPlan, number> = {
  プレミアムプラン: 0,
  スタンダードプラン: 1,
  ライトプラン: 2,
};

const buildDefaultDetail = (item: BaseAccountItem): AccountDetailRecord => ({
  address: `${item.baseName} 住所（未登録）`,
  email: `${item.accountId.toLowerCase()}@eventpick.local`,
  password: `Ep!${item.accountId}#2026`,
  paymentInfo: `${item.baseName} / 法人カード末尾1111`,
  couponCode: '',
});

const accountDetailsDb = new Map<string, AccountDetailRecord>(
  baseAccountsDb.map((item) => [item.id, buildDefaultDetail(item)]),
);

const ensureDetails = (item: BaseAccountItem): AccountDetailRecord => {
  const existing = accountDetailsDb.get(item.id);
  if (existing) return existing;
  const created = buildDefaultDetail(item);
  accountDetailsDb.set(item.id, created);
  return created;
};

const DELETION_GRACE_DAYS = 60;

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const purgeExpiredScheduledAccounts = () => {
  const now = Date.now();
  for (let i = baseAccountsDb.length - 1; i >= 0; i -= 1) {
    const account = baseAccountsDb[i];
    if (!account.scheduledDeletionAt) continue;
    const scheduledAt = new Date(account.scheduledDeletionAt).getTime();
    if (Number.isNaN(scheduledAt) || scheduledAt > now) continue;
    accountDetailsDb.delete(account.id);
    baseAccountsDb.splice(i, 1);
  }
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
    purgeExpiredScheduledAccounts();

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

    accountDetailsDb.set(id, {
      address: payload.address,
      email: `${accountId.toLowerCase()}@eventpick.local`,
      password: payload.initialPassword,
      paymentInfo: `${payload.baseName} / 支払い情報未設定`,
      couponCode: payload.couponCode ?? '',
    });

    return Promise.resolve({ id, accountId });
  },

  getAccountDetail: async (id: string): Promise<AccountDetailResponse> => {
    purgeExpiredScheduledAccounts();

    const item = baseAccountsDb.find((account) => account.id === id);
    if (!item) {
      return Promise.reject(new Error('ACCOUNT_NOT_FOUND'));
    }

    const detail = ensureDetails(item);
    return Promise.resolve({ ...item, ...detail });
  },

  updateAccount: async (id: string, payload: UpdateAccountPayload): Promise<AccountDetailResponse> => {
    purgeExpiredScheduledAccounts();

    const index = baseAccountsDb.findIndex((account) => account.id === id);
    if (index === -1) {
      return Promise.reject(new Error('ACCOUNT_NOT_FOUND'));
    }

    const current = baseAccountsDb[index];
    const updatedBase: BaseAccountItem = {
      ...current,
      baseName: payload.baseName,
      status: payload.status,
      plan: payload.plan,
      scheduledDeletionAt: payload.status === '削除予定' ? current.scheduledDeletionAt : undefined,
    };

    baseAccountsDb[index] = updatedBase;

    accountDetailsDb.set(id, {
      address: payload.address,
      email: payload.email,
      password: payload.password,
      paymentInfo: payload.paymentInfo,
      couponCode: payload.couponCode,
    });

    return Promise.resolve({
      ...updatedBase,
      address: payload.address,
      email: payload.email,
      password: payload.password,
      paymentInfo: payload.paymentInfo,
      couponCode: payload.couponCode,
    });
  },

  deleteAccount: async (id: string): Promise<void> => {
    purgeExpiredScheduledAccounts();

    const index = baseAccountsDb.findIndex((account) => account.id === id);
    if (index === -1) {
      return Promise.reject(new Error('ACCOUNT_NOT_FOUND'));
    }

    const current = baseAccountsDb[index];
    baseAccountsDb[index] = {
      ...current,
      status: '削除予定',
      scheduledDeletionAt: addDays(new Date(), DELETION_GRACE_DAYS).toISOString(),
    };

    return Promise.resolve();
  },

  cancelScheduledDeletion: async (id: string): Promise<void> => {
    purgeExpiredScheduledAccounts();

    const index = baseAccountsDb.findIndex((account) => account.id === id);
    if (index === -1) {
      return Promise.reject(new Error('ACCOUNT_NOT_FOUND'));
    }

    const current = baseAccountsDb[index];
    baseAccountsDb[index] = {
      ...current,
      status: '停止中',
      scheduledDeletionAt: undefined,
    };

    return Promise.resolve();
  },
};

export default accountsMockApi;
