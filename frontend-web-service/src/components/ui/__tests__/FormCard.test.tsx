import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormCard from '../FormCard/FormCard';

describe('FormCard', () => {
  it('renders children', () => {
    render(<FormCard><p>Hello</p></FormCard>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies wide class when wide prop is true', () => {
    const { container } = render(<FormCard wide><p>Wide</p></FormCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('wide');
  });

  it('does not apply wide class by default', () => {
    const { container } = render(<FormCard><p>Normal</p></FormCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('wide');
  });

  it('applies custom className', () => {
    const { container } = render(<FormCard className="custom"><p>X</p></FormCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom');
  });
});
