/**
 * types/models — ドメインモデル型定義の集約エクスポート
 *
 * 全 feature / api 層がここから型を import する。
 * api/db に型を定義せず、ここを唯一の型ソースとする。
 */

// ── アカウント ──
export type { AccountStatus, ContractPlan, BaseAccountItem } from './account';
export type { AccountsSortKey, GetAccountsParams } from './accountQuery';

// ── 投稿 ──
export type { PostsTabKey, PostEventDbItem } from './post';
export type { PostDraftPayload, PostDraftItem } from './postDraft';
export type { PostCondition, ScheduledPostItem } from './scheduledPost';
export type { PostListSortKey } from './postSort';

// ── レポート ──
export type { ReportSortKey, ReportListItem } from './report';
export type {
  ReportMetricKey,
  DemographicRow,
  DemographicAccountBlock,
  ReportDetailItem,
} from './reportDetail';
export type { ReportAggregateSummary } from './reportSummary';

// ── 請求 ──
export type {
  SubscriptionStatus,
  BillingSubscription,
  PaymentMethod,
  BillingAddress,
  BillingCompany,
  BillingData,
  InvoiceStatus,
  Invoice,
} from './billing';

// ── 実行履歴 ──
export type { ExecutionHistoryCategory, ExecutionHistoryItem } from './executionHistory';

// ── 認証 (既存 types/auth.ts の re-export) ──
export type { LoginRequest, LoginResponse, AuthUser } from '../auth';
