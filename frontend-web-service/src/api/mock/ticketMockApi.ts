import type { CompanyTicket } from '../../types/entities';
import { ticketDb } from '../db/tickets.db';

const ticketMockApi = {
  getCurrent: (): Promise<CompanyTicket> =>
    new Promise((resolve) => setTimeout(() => resolve({ ...ticketDb }), 180)),
};

export default ticketMockApi;
