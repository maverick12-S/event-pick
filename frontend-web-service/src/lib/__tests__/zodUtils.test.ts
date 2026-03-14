import { describe, it, expect } from 'vitest';
import { z, parse, safeParse, flattenErrors } from '../zodUtils';

describe('zodUtils', () => {
  const testSchema = z.object({ name: z.string().min(1), age: z.number().int().min(0) });

  describe('parse', () => {
    it('returns data for valid input', () => {
      expect(parse(testSchema, { name: 'Taro', age: 25 })).toEqual({ name: 'Taro', age: 25 });
    });
    it('throws for invalid input', () => {
      expect(() => parse(testSchema, { name: '', age: -1 })).toThrow();
    });
  });

  describe('safeParse', () => {
    it('returns success for valid input', () => {
      const result = safeParse(testSchema, { name: 'Taro', age: 25 });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toEqual({ name: 'Taro', age: 25 });
    });
    it('returns error for invalid input', () => {
      const result = safeParse(testSchema, { name: '', age: 'bad' });
      expect(result.success).toBe(false);
    });
  });

  describe('flattenErrors', () => {
    it('flattens nested errors into key-message map', () => {
      const result = safeParse(testSchema, { name: '', age: 'bad' });
      if (!result.success) {
        const flat = flattenErrors(result.error);
        expect(flat).toHaveProperty('name');
        expect(flat).toHaveProperty('age');
        expect(typeof flat.name).toBe('string');
      }
    });
    it('uses dot notation for nested paths', () => {
      const nested = z.object({ user: z.object({ email: z.string().email() }) });
      const result = safeParse(nested, { user: { email: 'bad' } });
      if (!result.success) {
        const flat = flattenErrors(result.error);
        expect(flat).toHaveProperty('user.email');
      }
    });
    it('keeps first error per path', () => {
      const multi = z.object({ x: z.string().min(2).max(5) });
      const result = safeParse(multi, { x: '' });
      if (!result.success) {
        const flat = flattenErrors(result.error);
        expect(Object.keys(flat).filter(k => k === 'x')).toHaveLength(1);
      }
    });
  });

  describe('z re-export', () => {
    it('z is the Zod namespace', () => {
      expect(z.string).toBeDefined();
      expect(z.object).toBeDefined();
    });
  });
});
