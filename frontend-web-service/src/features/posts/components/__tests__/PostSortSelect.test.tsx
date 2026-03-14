import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostSortSelect, { POST_SORT_OPTIONS } from '../PostSortSelect';

describe('POST_SORT_OPTIONS', () => {
  it('has 5 sort options', () => {
    expect(POST_SORT_OPTIONS).toHaveLength(5);
  });

  it('has postedAtDesc option', () => {
    expect(POST_SORT_OPTIONS.find(o => o.value === 'postedAtDesc')).toBeDefined();
  });

  it('has likesDesc option', () => {
    expect(POST_SORT_OPTIONS.find(o => o.value === 'likesDesc')).toBeDefined();
  });

  it('has recommendedDesc option', () => {
    expect(POST_SORT_OPTIONS.find(o => o.value === 'recommendedDesc')).toBeDefined();
  });

  it('all options have label and value', () => {
    POST_SORT_OPTIONS.forEach(opt => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    });
  });
});

describe('PostSortSelect', () => {
  it('renders without crashing', () => {
    const onChange = vi.fn();
    render(<PostSortSelect value="postedAtDesc" onChange={onChange} />);
    // MUI Select renders a button with the current value text
    expect(screen.getByText('投稿日が新しい順')).toBeInTheDocument();
  });

  it('renders with custom value', () => {
    render(<PostSortSelect value="likesDesc" onChange={vi.fn()} />);
    expect(screen.getByText('いいね数が多い順')).toBeInTheDocument();
  });
});
