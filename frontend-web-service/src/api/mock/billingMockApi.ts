import {
  getBillingData,
  getBillingAddress,
  updateBillingAddress,
} from '../db/billing.db';
import type { BillingData, BillingAddress } from '../../types/models/billing';

const billingMockApi = {
  getBillingData: (): Promise<BillingData> =>
    new Promise((resolve) => setTimeout(() => resolve(getBillingData()), 120)),

  getBillingAddress: (): Promise<BillingAddress> =>
    new Promise((resolve) => setTimeout(() => resolve(getBillingAddress()), 100)),

  updateBillingAddress: (patch: Partial<BillingAddress>): Promise<BillingAddress> =>
    new Promise((resolve) => setTimeout(() => resolve(updateBillingAddress(patch)), 150)),
};

export default billingMockApi;
