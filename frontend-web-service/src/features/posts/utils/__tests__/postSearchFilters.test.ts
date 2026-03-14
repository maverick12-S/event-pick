import { describe, it, expect } from 'vitest';
import { defaultPostSearchFilters, toSelectedValues, detectTimeSlot } from '../postSearchFilters';
import type { PostSearchFilters } from '../postSearchFilters';

describe('postSearchFilters', () => {
  describe('defaultPostSearchFilters', () => {
    it('has empty defaults', () => {
      expect(defaultPostSearchFilters).toEqual({
        title: '', categories: [], prefectures: [], cities: [], timeSlots: [],
      } satisfies PostSearchFilters);
    });
  });

  describe('toSelectedValues', () => {
    it('returns array of strings from array input', () => {
      expect(toSelectedValues(['a', 'b'])).toEqual(['a', 'b']);
    });
    it('converts non-string array items to strings', () => {
      expect(toSelectedValues([1, 2])).toEqual(['1', '2']);
    });
    it('splits comma-separated string', () => {
      expect(toSelectedValues('a,b,c')).toEqual(['a', 'b', 'c']);
    });
    it('trims values from comma-separated string', () => {
      expect(toSelectedValues('a , b , c ')).toEqual(['a', 'b', 'c']);
    });
    it('returns empty array for empty string', () => {
      expect(toSelectedValues('')).toEqual([]);
    });
    it('returns empty array for null/undefined', () => {
      expect(toSelectedValues(null)).toEqual([]);
      expect(toSelectedValues(undefined)).toEqual([]);
    });
    it('returns empty array for non-string/non-array', () => {
      expect(toSelectedValues(42)).toEqual([]);
    });
    it('filters out empty strings from split', () => {
      expect(toSelectedValues('a,,b')).toEqual(['a', 'b']);
    });
  });

  describe('detectTimeSlot', () => {
    it('returns 朝 for morning hours (< 12)', () => {
      expect(detectTimeSlot('08:00')).toBe('朝');
      expect(detectTimeSlot('11:30')).toBe('朝');
    });
    it('returns 昼 for afternoon (12-15)', () => {
      expect(detectTimeSlot('12:00')).toBe('昼');
      expect(detectTimeSlot('15:30')).toBe('昼');
    });
    it('returns 夕方 for evening (16-18)', () => {
      expect(detectTimeSlot('16:00')).toBe('夕方');
      expect(detectTimeSlot('18:30')).toBe('夕方');
    });
    it('returns 夜 for night (>= 19)', () => {
      expect(detectTimeSlot('19:00')).toBe('夜');
      expect(detectTimeSlot('23:00')).toBe('夜');
    });
    it('returns empty for invalid input', () => {
      expect(detectTimeSlot('bad')).toBe('');
    });
    it('returns 朝 for 00:00', () => {
      expect(detectTimeSlot('00:00')).toBe('朝');
    });
  });
});
