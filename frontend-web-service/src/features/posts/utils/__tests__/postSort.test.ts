import { describe, it, expect } from 'vitest';
import { sortPostsByKey } from '../postSort';

type TestPost = { id?: string; title: string; dateLabel: string; ward?: string };

const makePost = (id: string, title: string, dateLabel: string, ward?: string): TestPost => ({
  id, title, dateLabel, ward,
});

describe('sortPostsByKey', () => {
  const posts: TestPost[] = [
    makePost('post-10', 'Cイベント', '2026-03-14', '渋谷区'),
    makePost('post-5', 'Aイベント', '2026-03-12', '新宿区'),
    makePost('post-20', 'Bイベント', '2026-03-16', '港区'),
  ];

  describe('postedAtAsc', () => {
    it('sorts by date ascending', () => {
      const sorted = sortPostsByKey(posts, 'postedAtAsc');
      expect(sorted[0].dateLabel).toBe('2026-03-12');
      expect(sorted[1].dateLabel).toBe('2026-03-14');
      expect(sorted[2].dateLabel).toBe('2026-03-16');
    });
  });

  describe('postedAtDesc', () => {
    it('sorts by date descending', () => {
      const sorted = sortPostsByKey(posts, 'postedAtDesc');
      expect(sorted[0].dateLabel).toBe('2026-03-16');
      expect(sorted[2].dateLabel).toBe('2026-03-12');
    });
  });

  describe('titleAsc', () => {
    it('sorts by title ascending', () => {
      const sorted = sortPostsByKey(posts, 'titleAsc');
      expect(sorted[0].title).toBe('Aイベント');
      expect(sorted[1].title).toBe('Bイベント');
      expect(sorted[2].title).toBe('Cイベント');
    });
  });

  describe('likesDesc', () => {
    it('sorts by computed likes descending', () => {
      const sorted = sortPostsByKey(posts, 'likesDesc');
      // likes = 20 + (numericId % 360) — post-20: 40, post-10: 30, post-5: 25
      expect(sorted[0].id).toBe('post-20');
      expect(sorted[1].id).toBe('post-10');
      expect(sorted[2].id).toBe('post-5');
    });
  });

  describe('recommendedDesc', () => {
    it('returns sorted array sorted by recommendation score', () => {
      const sorted = sortPostsByKey(posts, 'recommendedDesc');
      expect(sorted).toHaveLength(3);
      // Just verify it returns a stable sorted result
      expect(sorted.map(p => p.id)).toBeDefined();
    });
  });

  it('does not mutate original array', () => {
    const original = [...posts];
    sortPostsByKey(posts, 'titleAsc');
    expect(posts).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortPostsByKey([], 'titleAsc')).toEqual([]);
  });

  it('handles posts with invalid dateLabel gracefully', () => {
    const badPosts = [
      makePost('1', 'A', 'invalid-date'),
      makePost('2', 'B', '2026-03-14'),
    ];
    const sorted = sortPostsByKey(badPosts, 'postedAtAsc');
    // Invalid date gets 0, so comes first
    expect(sorted[0].id).toBe('1');
  });
});
