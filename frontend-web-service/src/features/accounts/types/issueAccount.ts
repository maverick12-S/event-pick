import type { ContractPlan } from '../../../api/db/accounts.screen';

export type IssueAccountFormState = {
  baseName: string;
  displayName: string;
  address: string;
  initialPassword: string;
  plan: ContractPlan;
  couponCode: string;
};

export type PlanGuideDetail = {
  monthly: string;
  outline: string;
  featureList: string[];
};

export type PlanGuideVisual = {
  accentColor: string;
  borderColor: string;
  glowColor: string;
  cardGradient: string;
};
