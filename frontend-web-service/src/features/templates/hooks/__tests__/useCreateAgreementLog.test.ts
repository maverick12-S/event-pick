import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMutation } from '@tanstack/react-query';

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn((opts: { mutationFn: (req: unknown) => Promise<unknown> }) => ({
    mutateAsync: opts.mutationFn,
    mutate: opts.mutationFn,
  })),
}));

import { useCreateAgreementLog } from '../useCreateAgreementLog';

const STORAGE_KEY = 'eventpick_agreement_logs';

describe('useCreateAgreementLog', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns a mutation object', () => {
    const result = useCreateAgreementLog();
    expect(result).toBeDefined();
    expect(result.mutateAsync).toBeDefined();
  });

  it('saves agreement log to localStorage', async () => {
    const result = useCreateAgreementLog();
    const req = {
      templateId: 'tpl-001',
      userId: 'user-001',
      agreedAt: '2026-03-14T00:00:00Z',
    };
    const response = await result.mutateAsync(req);
    expect(response).toEqual({ created: true });

    const logs = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual(req);
  });

  it('appends to existing logs', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ templateId: 'existing' }]));
    const result = useCreateAgreementLog();
    await result.mutateAsync({ templateId: 'new', userId: 'u2', agreedAt: '2026-01-01' });

    const logs = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(logs).toHaveLength(2);
    expect(logs[1].templateId).toBe('new');
  });

  it('calls useMutation with correct config', () => {
    useCreateAgreementLog();
    expect(useMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: expect.any(Function),
      }),
    );
  });
});
