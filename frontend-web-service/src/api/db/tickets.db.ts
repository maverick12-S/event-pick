// ─── チケット DB（モック） ─────────────────────────────
// 将来 API に差し替える際は型定義をそのまま流用し、
// 取得関数を fetch / axios 呼び出しに置き換えるだけで移行可能にしている。
// エンドポイント: GET /api/v1/tickets (endpoints.tickets)

export type { CompanyTicket } from '../../types/entities';

import type { CompanyTicket } from '../../types/entities';

// ===================== モックデータ =====================

export const ticketDb: CompanyTicket = {
  ticket_id: '01JQXYZ0000000000000000001',
  company_id: '01JQXYZ0000000000000000010',
  daily_granted: 10,
  daily_used: 3,
  daily_remaining: 7,
  daily_reset_at: new Date().toISOString().slice(0, 10),
  monthly_granted: 10,
  monthly_used: 4,
  monthly_remaining: 6,
  monthly_target: new Date().toISOString().slice(0, 7).replace('-', ''),
};
