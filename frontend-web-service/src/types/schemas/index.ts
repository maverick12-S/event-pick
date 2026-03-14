/**
 * types/schemas — Zod スキーマ定義の集約エクスポート
 *
 * 各モデルに対応する Zod スキーマをここから import する。
 * スキーマから推論される型 (z.infer) は types/models/ の手書き型と一致する。
 * 将来的に types/models/ を z.infer<typeof schema> に統一可能。
 */

// ─── アカウント ──
export {
  accountStatusSchema,
  contractPlanSchema,
  baseAccountItemSchema,
  accountIssueRequestSchema,
  accountIssueResponseSchema,
  accountUpdateRequestSchema,
  accountDeleteRequestSchema,
  accountCancelDeletionRequestSchema,
  accountListParamsSchema,
  accountDetailResponseSchema,
} from './account.schema';

// ─── 認証 ──
export {
  loginRequestSchema,
  loginResponseSchema,
  authUserSchema,
  signupRequestSchema,
  signupResponseSchema,
  passwordResetRequestSchema,
  passwordResetResponseSchema,
  passwordChangeRequestSchema,
  passwordChangeResponseSchema,
  mfaVerifyRequestSchema,
  mfaVerifyResponseSchema,
} from './auth.schema';

// ─── 請求 (UI モデル) ──
export {
  billingSubscriptionSchema,
  billingAddressSchema,
  billingDataSchema,
  invoiceSchema,
} from './billing.schema';

// ─── 投稿管理 ──
export {
  postCreateRequestSchema,
  postCreateResponseSchema,
  postSearchParamsSchema,
  postDetailEditRequestSchema,
  scheduledPostUpdateRequestSchema,
  scheduledPostListParamsSchema,
} from './post.schema';

// ─── プラン ──
export {
  planSelectRequestSchema,
  planSelectResponseSchema,
  couponApplyRequestSchema,
  couponApplyResponseSchema,
} from './plan.schema';

// ─── 設定 ──
export {
  settingsAccountUpdateRequestSchema,
  billingAddressUpdateRequestSchema,
  notificationSettingItemSchema,
  notificationSettingsPayloadSchema,
  contactInquiryRequestSchema,
  contactInquiryResponseSchema,
  executionHistoryListParamsSchema,
} from './settings.schema';

// ─── 管理者 ──
export {
  adminCouponCreateRequestSchema,
  adminCouponCreateResponseSchema,
  adminCategoryCreateRequestSchema,
  adminCategoryDeleteRequestSchema,
  adminInquiryReplyRequestSchema,
  adminInquiryCloseRequestSchema,
  adminReviewApproveRequestSchema,
  adminReviewRejectRequestSchema,
  adminConsumerSuspendRequestSchema,
  adminConsumerDeleteScheduleRequestSchema,
  adminLocationAccountSuspendRequestSchema,
  adminLocationAccountDeleteScheduleRequestSchema,
  adminSettingsUpdateRequestSchema,
  adminUsersParamsSchema,
  adminAuthLogsParamsSchema,
  adminActivityLogsParamsSchema,
} from './admin.schema';

// ─── レポート ──
export {
  reportListParamsSchema,
  reportDetailParamsSchema,
  reportSummaryParamsSchema,
} from './report.schema';
