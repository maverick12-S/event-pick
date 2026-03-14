import { describe, it, expect } from 'vitest';
import { usePostManagement, postManagementApi } from '../usePostManagement';

describe('usePostManagement', () => {
  it('returns the mock API object', () => {
    const api = usePostManagement();
    expect(api).toBeDefined();
    expect(typeof api.listPostDrafts).toBe('function');
    expect(typeof api.listScheduledPosts).toBe('function');
  });

  it('postManagementApi is the same object', () => {
    const hook = usePostManagement();
    expect(hook).toBe(postManagementApi);
  });

  it('has expected API methods', () => {
    const api = usePostManagement();
    expect(typeof api.upsertPostDraft).toBe('function');
    expect(typeof api.deletePostDraft).toBe('function');
    expect(typeof api.getCurrentLocationId).toBe('function');
  });
});
