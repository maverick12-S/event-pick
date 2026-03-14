/*
  Centralized API endpoint definitions.
  - All routes are prefixed with API_PREFIX ("/api/v1").
  - For routes with path params, functions are provided to build the path.
  - Keep keys stable so `services.ts` and other callers can import.
*/

const API_PREFIX = '/api/v1';

const endpoints = {
  // Auth
  authLogin: `${API_PREFIX}/auth/login`,
  authLogout: `${API_PREFIX}/auth/logout`,
  authRefresh: `${API_PREFIX}/auth/refresh`,
  authRevoke: `${API_PREFIX}/auth/revoke`,
  authSignup: `${API_PREFIX}/auth/signup`,
  authMfaVerify: `${API_PREFIX}/auth/mfa/verify`,
  authPasswordReset: `${API_PREFIX}/auth/password-reset`,
  authPasswordChange: `${API_PREFIX}/auth/password-change`,

  // Companies / accounts
  companiesMe: `${API_PREFIX}/companies/me`,
  companiesMeUpdate: `${API_PREFIX}/companies/me`,
  companiesMeNotifications: `${API_PREFIX}/companies/me/notifications`,

  companyAccounts: `${API_PREFIX}/company-accounts`,
  companyAccount: (accountId: string | number) => `${API_PREFIX}/company-accounts/${accountId}`,
  // compatibility aliases for existing services
  companies: `${API_PREFIX}/companies`,
  company: (companyId: string | number) => `${API_PREFIX}/companies/${companyId}`,
  companyStatus: (companyId: string | number) => `${API_PREFIX}/companies/${companyId}/status`,
  companyReview: (companyId: string | number) => `${API_PREFIX}/companies/${companyId}/review`,

  // Corporations (validate)
  corporationsValidate: `${API_PREFIX}/corporations/validate`,

  // Drafts / companies
  companyDrafts: `${API_PREFIX}/companies/drafts`,

  // Events
  events: `${API_PREFIX}/events`,
  eventsToday: `${API_PREFIX}/events/today`,
  eventsTomorrow: `${API_PREFIX}/events/tomorrow`,
  eventsSearch: `${API_PREFIX}/events/search`,
  eventsScheduled: `${API_PREFIX}/events/scheduled`,
  eventsDrafts: `${API_PREFIX}/events/drafts`,
  event: (eventId: string | number) => `${API_PREFIX}/events/${eventId}`,
  eventPublish: (eventId: string | number) => `${API_PREFIX}/events/${eventId}/publish`,
  eventHide: (eventId: string | number) => `${API_PREFIX}/events/${eventId}/hide`,
  eventScheduleDelete: (eventId: string | number) => `${API_PREFIX}/events/${eventId}/schedule`,
  eventMedia: (eventId: string | number) => `${API_PREFIX}/events/${eventId}/media`,
  eventMediaDelete: (eventId: string | number, mediaId: string | number) => `${API_PREFIX}/events/${eventId}/media/${mediaId}`,
  eventsPreview: `${API_PREFIX}/events/preview`,

  // Users
  users: `${API_PREFIX}/users`,
  user: (userId: string | number) => `${API_PREFIX}/users/${userId}`,
  userSuspend: (userId: string | number) => `${API_PREFIX}/users/${userId}/suspend`,

  // Maps
  mapsGoogle: `${API_PREFIX}/maps/google`,

  // Uploads
  uploadsPresignedUrl: `${API_PREFIX}/uploads/presigned-url`,

  // Reports
  reportsSummary: `${API_PREFIX}/reports/summary`,
  reportsSearch: `${API_PREFIX}/reports/search`,
  reportByAccount: (accountId: string | number) => `${API_PREFIX}/reports/${accountId}`,
  reportByAccountEvent: (accountId: string | number, eventId: string | number) => `${API_PREFIX}/reports/${accountId}/${eventId}`,

  // Billing
  billingRoot: `${API_PREFIX}/billing`,
  billingCheckoutSession: `${API_PREFIX}/billing/checkout-session`,
  billingPlanChange: `${API_PREFIX}/billing/plan/change`,
  billingCancel: `${API_PREFIX}/billing/cancel`,
  billingAddress: `${API_PREFIX}/billing/address`,
  billingCouponApply: `${API_PREFIX}/billing/coupon/apply`,

  // Audit, inquiries, tickets, notifications, execution history
  auditLogs: `${API_PREFIX}/audit-logs`,
  executionHistory: `${API_PREFIX}/execution-history`,
  inquiries: `${API_PREFIX}/inquiries`,
  inquiriesReply: (inquiryId: string | number) => `${API_PREFIX}/admin/inquiries/${inquiryId}/reply`,
  notifications: `${API_PREFIX}/notifications`,
  notificationRead: (notificationId: string | number) => `${API_PREFIX}/notifications/${notificationId}/read`,
  notificationReadAll: `${API_PREFIX}/notifications/read-all`,
  tickets: `${API_PREFIX}/tickets`,

  // Webhooks
  webhooksStripe: `${API_PREFIX}/webhooks/stripe`,

  // Admin namespace
  admin: {
    companies: `${API_PREFIX}/admin/companies`,
    company: (companyId: string | number) => `${API_PREFIX}/admin/companies/${companyId}`,
    companyStatus: (companyId: string | number) => `${API_PREFIX}/admin/companies/${companyId}/status`,
    companyReview: (companyId: string | number) => `${API_PREFIX}/admin/companies/${companyId}/review`,

    events: `${API_PREFIX}/admin/events`,
    eventDelete: (eventId: string | number) => `${API_PREFIX}/admin/events/${eventId}`,
    eventHide: (eventId: string | number) => `${API_PREFIX}/admin/events/${eventId}/hide`,

    users: `${API_PREFIX}/admin/users`,
    user: (userId: string | number) => `${API_PREFIX}/admin/users/${userId}`,
    userSuspend: (userId: string | number) => `${API_PREFIX}/admin/users/${userId}/suspend`,
    userDelete: (userId: string | number) => `${API_PREFIX}/admin/users/${userId}`,

    reportsOverview: `${API_PREFIX}/admin/reports/overview`,

    coupons: `${API_PREFIX}/admin/coupons`,
    coupon: (couponId: string | number) => `${API_PREFIX}/admin/coupons/${couponId}`,

    inquiries: `${API_PREFIX}/admin/inquiries`,
    inquiry: (inquiryId: string | number) => `${API_PREFIX}/admin/inquiries/${inquiryId}`,
    inquiryReply: (inquiryId: string | number) => `${API_PREFIX}/admin/inquiries/${inquiryId}/reply`,
    inquiryClose: (inquiryId: string | number) => `${API_PREFIX}/admin/inquiries/${inquiryId}/close`,

    categories: `${API_PREFIX}/admin/categories`,
    category: (id: string | number) => `${API_PREFIX}/admin/categories/${id}`,

    plans: `${API_PREFIX}/admin/plans`,
    plan: (id: string | number) => `${API_PREFIX}/admin/plans/${id}`,
  },

  // Admin - reviews
  adminReviews: `${API_PREFIX}/admin/reviews`,
  adminReview: (reviewId: string | number) => `${API_PREFIX}/admin/reviews/${reviewId}`,
  adminReviewApprove: (reviewId: string | number) => `${API_PREFIX}/admin/reviews/${reviewId}/approve`,
  adminReviewReject: (reviewId: string | number) => `${API_PREFIX}/admin/reviews/${reviewId}/reject`,

  // Admin - settings
  adminSettings: `${API_PREFIX}/admin/settings`,

  // Admin - auth logs / activity logs
  adminAuthLogs: `${API_PREFIX}/admin/auth-logs`,
  adminActivityLogs: `${API_PREFIX}/admin/activity-logs`,

  // Admin - consumers
  adminConsumers: `${API_PREFIX}/admin/consumers`,
  adminConsumer: (userId: string | number) => `${API_PREFIX}/admin/consumers/${userId}`,
  adminConsumerSuspend: (userId: string | number) => `${API_PREFIX}/admin/consumers/${userId}/suspend`,
  adminConsumerDeleteSchedule: (userId: string | number) => `${API_PREFIX}/admin/consumers/${userId}/delete-schedule`,

  // Admin - location accounts
  adminLocationAccounts: `${API_PREFIX}/admin/location-accounts`,
  adminLocationAccount: (companyId: string | number) => `${API_PREFIX}/admin/location-accounts/${companyId}`,
  adminLocationAccountSuspend: (companyId: string | number) => `${API_PREFIX}/admin/location-accounts/${companyId}/suspend`,
  adminLocationAccountDeleteSchedule: (companyId: string | number) => `${API_PREFIX}/admin/location-accounts/${companyId}/delete-schedule`,

  // Agreement logs
  agreementLogs: `${API_PREFIX}/agreement-logs`,

  // Master data
  master: {
    prefectures: `${API_PREFIX}/master/prefectures`,
    cities: `${API_PREFIX}/master/cities`,
    regions: `${API_PREFIX}/admin/master/regions`,
    region: (id: string | number) => `${API_PREFIX}/admin/master/regions/${id}`,
  },
};

export default endpoints;
export { API_PREFIX };
