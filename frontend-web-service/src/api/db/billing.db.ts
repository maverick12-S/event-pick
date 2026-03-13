// ─── 請求管理 DB（モック） ─────────────────────────────
// 将来 API に差し替える際は型定義をそのまま流用し、
// 取得関数を fetch / axios 呼び出しに置き換えるだけで移行可能にしている。

// ===================== 型定義 (types/models/billing.ts から re-export) =====================

export type {
  SubscriptionStatus,
  BillingSubscription,
  PaymentMethod,
  BillingAddress,
  InvoiceStatus,
  Invoice,
  BillingCompany,
  BillingData,
} from '../../types/models/billing';

import type {
  BillingSubscription,
  PaymentMethod,
  BillingAddress,
  Invoice,
  BillingCompany,
  BillingData,
} from '../../types/models/billing';

// ===================== モックデータ =====================

export const billingCompanyDb: BillingCompany = {
  companyName: 'MainFunc PTE. LTD.',
};

export const billingSubscriptionDb: BillingSubscription = {
  id: 'sub_1',
  planName: 'Plus Monthly Subscription',
  cycle: '1 カ月ごとに $54.99',
  unitAmount: '$54.99',
  status: 'active',
  renewalDate: '2026年3月14日',
  nextEstimate: '$27.49',
};

export const billingPaymentMethodsDb: PaymentMethod[] = [];

export const billingAddressDb: BillingAddress = {
  name: 'KAZUKI SHIBA',
  email: 'kazuki14148@gmail.com',
  country: '日本',
  postalCode: '154-0023',
  prefecture: '',
  city: '',
  address1: '',
  address2: '',
  phoneCountry: '+81',
  phoneNumber: '3 1234 5678',
};

export const billingInvoicesDb: Invoice[] = [
  { id: 'INV-2026-03', date: '2026/03/01', amount: '$54.99', status: '支払い済み' },
  { id: 'INV-2026-02', date: '2026/02/01', amount: '$54.99', status: '支払い済み' },
  { id: 'INV-2026-01', date: '2026/01/01', amount: '$54.99', status: '支払い済み' },
  { id: 'INV-2025-12', date: '2025/12/01', amount: '$54.99', status: '支払い済み' },
  { id: 'INV-2025-11', date: '2025/11/01', amount: '$54.99', status: '支払い済み' },
  { id: 'INV-2025-10', date: '2025/10/01', amount: '$54.99', status: '支払い済み' },
];

// ─── 取得ヘルパー（将来 API に差し替え） ────────────
export function getBillingData(): BillingData {
  return {
    company: billingCompanyDb,
    subscription: billingSubscriptionDb,
    paymentMethods: [...billingPaymentMethodsDb],
    billingAddress: { ...billingAddressDb },
    invoices: [...billingInvoicesDb],
  };
}

export function getBillingAddress(): BillingAddress {
  return { ...billingAddressDb };
}

export function updateBillingAddress(patch: Partial<BillingAddress>): BillingAddress {
  Object.assign(billingAddressDb, patch);
  return { ...billingAddressDb };
}
