import { z } from 'zod';

/** サブスクリプションステータス */
export const subscriptionStatusSchema = z.enum(['active', 'past_due', 'canceled', 'trialing']);

/** サブスクリプション */
export const billingSubscriptionSchema = z.object({
  id: z.string(),
  planName: z.string(),
  cycle: z.string(),
  unitAmount: z.string(),
  status: subscriptionStatusSchema,
  renewalDate: z.string(),
  nextEstimate: z.string(),
  stripePriceId: z.string().optional(),
});

/** 支払方法 */
export const paymentMethodSchema = z.object({
  id: z.string(),
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number(),
  expYear: z.number(),
  isDefault: z.boolean(),
});

/** 請求先住所 */
export const billingAddressSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  country: z.string(),
  postalCode: z.string(),
  prefecture: z.string(),
  city: z.string(),
  address1: z.string(),
  address2: z.string(),
  phoneCountry: z.string(),
  phoneNumber: z.string(),
});

/** 請求書ステータス */
export const invoiceStatusSchema = z.enum(['支払い済み', '未払い', '失敗']);

/** 請求書 */
export const invoiceSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.string(),
  status: invoiceStatusSchema,
  pdfUrl: z.string().optional(),
});

/** 請求データ全体 */
export const billingDataSchema = z.object({
  company: z.object({
    companyName: z.string(),
    stripeCustomerId: z.string().optional(),
  }),
  subscription: billingSubscriptionSchema,
  paymentMethods: z.array(paymentMethodSchema),
  billingAddress: billingAddressSchema,
  invoices: z.array(invoiceSchema),
});
