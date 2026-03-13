import type { AccountStatus, ContractPlan } from '../../../types/models/account';

export interface AccountEditFormState {
  baseName: string;
  address: string;
  email: string;
  password: string;
  plan: ContractPlan;
  couponCode: string;
  paymentInfo: string;
  status: AccountStatus;
}
