import { describe, it, expect } from 'vitest';
import { useAccountIdGenerator } from '../useAccountIdGenerator';

describe('useAccountIdGenerator', () => {
  it('returns a function', () => {
    const generateId = useAccountIdGenerator();
    expect(typeof generateId).toBe('function');
  });

  it('generates ID with correct format', () => {
    const generateId = useAccountIdGenerator();
    const id = generateId();
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    // format: LOC-YYYY-NNNNN
    expect(id).toMatch(/^LOC-\d{4}-\d{5}$/);
  });

  it('generates IDs with current year', () => {
    const generateId = useAccountIdGenerator();
    const id = generateId();
    const year = new Date().getFullYear().toString();
    expect(id).toContain(year);
  });
});
