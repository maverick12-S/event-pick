import { describe, it, expect } from 'vitest';
import { ticketDb } from '../../db/tickets.db';
import ticketMockApi from '../ticketMockApi';

describe('ticketDb', () => {
  it('has required fields with correct types', () => {
    expect(ticketDb.ticket_id).toBeTruthy();
    expect(ticketDb.company_id).toBeTruthy();
    expect(typeof ticketDb.daily_granted).toBe('number');
    expect(typeof ticketDb.daily_used).toBe('number');
    expect(typeof ticketDb.daily_remaining).toBe('number');
    expect(typeof ticketDb.monthly_granted).toBe('number');
    expect(typeof ticketDb.monthly_used).toBe('number');
    expect(typeof ticketDb.monthly_remaining).toBe('number');
  });

  it('daily_remaining = daily_granted - daily_used', () => {
    expect(ticketDb.daily_remaining).toBe(ticketDb.daily_granted - ticketDb.daily_used);
  });

  it('monthly_remaining = monthly_granted - monthly_used', () => {
    expect(ticketDb.monthly_remaining).toBe(ticketDb.monthly_granted - ticketDb.monthly_used);
  });
});

describe('ticketMockApi', () => {
  it('getCurrent returns ticket data', async () => {
    const ticket = await ticketMockApi.getCurrent();
    expect(ticket.ticket_id).toBe(ticketDb.ticket_id);
    expect(ticket.daily_remaining).toBe(ticketDb.daily_remaining);
    expect(ticket.monthly_remaining).toBe(ticketDb.monthly_remaining);
  });

  it('getCurrent returns a copy (not reference)', async () => {
    const ticket = await ticketMockApi.getCurrent();
    expect(ticket).not.toBe(ticketDb);
    expect(ticket).toEqual(ticketDb);
  });
});
