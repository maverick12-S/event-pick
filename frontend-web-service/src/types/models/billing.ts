/** 請求管理の型定義 */

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface BillingSubscription {
  id: string;
  planName: string;
  cycle: string;
  unitAmount: string;
  status: SubscriptionStatus;
  renewalDate: string;
  nextEstimate: string;
  stripePriceId?: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface BillingAddress {
  name: string;
  email: string;
  country: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  phoneCountry: string;
  phoneNumber: string;
}

export type InvoiceStatus = '支払い済み' | '未払い' | '失敗';

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
  pdfUrl?: string;
}

export interface BillingCompany {
  companyName: string;
  stripeCustomerId?: string;
}

export interface BillingData {
  company: BillingCompany;
  subscription: BillingSubscription;
  paymentMethods: PaymentMethod[];
  billingAddress: BillingAddress;
  invoices: Invoice[];
}
