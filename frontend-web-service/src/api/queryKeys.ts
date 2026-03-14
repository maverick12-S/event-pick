export const queryKeys = {
  // Auth
  auth: ['auth'] as const,

  // Companies
  companies: ['companies'] as const,
  company: (companyId: string) => ['company', companyId] as const,

  // Events
  events: ['events'] as const,
  event: (eventId: string) => ['event', eventId] as const,

  // Users
  users: ['users'] as const,
  user: (userId: string) => ['user', userId] as const,

  // Reports
  reports: ['reports'] as const,
  reportSummary: (params: Record<string, unknown>) => ['reports', 'summary', params] as const,

  // Notifications
  notifications: ['notifications'] as const,

  // Billing / Tickets
  billing: ['billing'] as const,
  tickets: ['tickets'] as const,

  // Admin
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    consumers: ['admin', 'consumers'] as const,
    locationAccounts: ['admin', 'locationAccounts'] as const,
    users: ['admin', 'users'] as const,
    coupons: ['admin', 'coupons'] as const,
    categories: ['admin', 'categories'] as const,
    inquiries: ['admin', 'inquiries'] as const,
    reviews: ['admin', 'reviews'] as const,
    authLogs: ['admin', 'authLogs'] as const,
    activityLogs: ['admin', 'activityLogs'] as const,
    settings: ['admin', 'settings'] as const,
  },

  // Posts / Drafts / Schedules
  posts: ['posts'] as const,
  postDrafts: ['posts', 'drafts'] as const,
  postScheduled: ['posts', 'scheduled'] as const,

  // Settings
  settings: ['settings'] as const,

  // Plans
  plans: ['plans'] as const,
} as const;

export default queryKeys;
