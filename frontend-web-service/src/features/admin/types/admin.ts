// =============================================
//  Admin Feature Types
//  運営管理画面で使用する型定義
// =============================================

/** 管理対象ユーザー */
export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  realm: string;
  role: 'admin' | 'operator' | 'user';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLoginAt: string | null;
}

/** オペレーター */
export interface AdminOperator {
  id: string;
  username: string;
  displayName: string;
  email: string;
  permissionLevel: 'root' | 'super' | 'standard';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLoginAt: string | null;
}

/** 認証ログ */
export interface AuthLog {
  id: string;
  userId: string;
  username: string;
  authMethod: 'cookie' | 'token';
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'timeout';
  errorMessage?: string;
  createdAt: string;
}

/** ダッシュボード統計 */
export interface AdminStats {
  corporateCount: number;
  corporateCountDelta: number;
  locationAccountCount: number;
  locationAccountCountDelta: number;
  consumerCount: number;
  consumerCountDelta: number;
  lightPlanCount: number;
  lightPlanCountDelta: number;
  standardPlanCount: number;
  standardPlanCountDelta: number;
  premiumPlanCount: number;
  premiumPlanCountDelta: number;
  adFreeCount: number;
  adFreeCountDelta: number;
}

/** 期間別トレンドデータポイント */
export interface TrendDataPoint {
  label: string;
  corporateCount: number;
  locationAccountCount: number;
  consumerCount: number;
  lightPlanCount: number;
  standardPlanCount: number;
  premiumPlanCount: number;
  adFreeCount: number;
}

/** トレンド期間 */
export type TrendPeriod = '1y' | '6m' | '3m' | '1m' | '1w' | 'daily';

/** 一般消費者アカウント */
export interface ConsumerAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'delete_scheduled';
  createdAt: string;
  lastLoginAt: string | null;
  deleteScheduledAt?: string | null;
}

/** 拠点アカウント */
export interface LocationAccount {
  id: string;
  corporateName: string;
  locationName: string;
  managerName: string;
  email: string;
  phone: string;
  realm: string;
  status: 'active' | 'suspended' | 'delete_scheduled';
  createdAt: string;
  lastLoginAt: string | null;
  deleteScheduledAt?: string | null;
}

/** 消費者一覧レスポンス */
export interface ConsumersResponse {
  items: ConsumerAccount[];
  total: number;
  page: number;
  perPage: number;
}

/** 拠点アカウント一覧レスポンス */
export interface LocationAccountsResponse {
  items: LocationAccount[];
  total: number;
  page: number;
  perPage: number;
}

/** ユーザー一覧レスポンス */
export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  perPage: number;
}

/** 認証ログ一覧レスポンス */
export interface AuthLogsResponse {
  items: AuthLog[];
  total: number;
  page: number;
  perPage: number;
}

/** ユーザーステータス更新リクエスト */
export interface UpdateUserStatusRequest {
  status: 'active' | 'suspended';
}
