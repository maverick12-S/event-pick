import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MuiAuthLayout from '../MuiAuthLayout/MuiAuthLayout';

describe('MuiAuthLayout', () => {
  it('renders title as h1', () => {
    render(<MuiAuthLayout title="企業ログイン"><div>Card</div></MuiAuthLayout>);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('企業ログイン');
  });

  it('renders subtitle when provided', () => {
    render(<MuiAuthLayout title="T" subtitle="説明テキスト"><div /></MuiAuthLayout>);
    expect(screen.getByText('説明テキスト')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<MuiAuthLayout title="T"><div /></MuiAuthLayout>);
    expect(screen.queryByText('説明テキスト')).toBeNull();
  });

  it('renders children', () => {
    render(<MuiAuthLayout title="T"><span>Form content</span></MuiAuthLayout>);
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renders section element', () => {
    const { container } = render(<MuiAuthLayout title="T"><div /></MuiAuthLayout>);
    expect(container.querySelector('section')).not.toBeNull();
  });
});
