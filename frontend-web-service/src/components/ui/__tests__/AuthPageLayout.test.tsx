import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthPageLayout from '../AuthPageLayout/AuthPageLayout';

describe('AuthPageLayout', () => {
  it('renders title as h1', () => {
    render(<AuthPageLayout title="ログイン"><div>Form</div></AuthPageLayout>);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('ログイン');
  });

  it('renders subtitle when provided', () => {
    render(<AuthPageLayout title="T" subtitle="サブタイトル"><div /></AuthPageLayout>);
    expect(screen.getByText('サブタイトル')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<AuthPageLayout title="T"><div /></AuthPageLayout>);
    const ps = container.querySelectorAll('p');
    // subtitle用の<p>がない
    const subtitleP = Array.from(ps).find(p => p.className.includes('subtitle'));
    expect(subtitleP).toBeUndefined();
  });

  it('renders children', () => {
    render(<AuthPageLayout title="T"><span>Child content</span></AuthPageLayout>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies wide class when wide prop is true', () => {
    const { container } = render(<AuthPageLayout title="T" wide><div /></AuthPageLayout>);
    const html = container.innerHTML;
    expect(html).toContain('wide');
  });
});
