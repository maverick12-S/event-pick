import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormField, { fieldStyles } from '../FormField/FormField';

describe('FormField', () => {
  it('renders children', () => {
    render(<FormField><input data-testid="input" /></FormField>);
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<FormField label="ユーザー名"><input /></FormField>);
    expect(screen.getByText('ユーザー名')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const { container } = render(<FormField><input /></FormField>);
    expect(container.querySelector('label')).toBeNull();
  });

  it('renders error message with role="alert"', () => {
    render(<FormField error="必須項目です"><input /></FormField>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('必須項目です');
  });

  it('does not render error when null', () => {
    render(<FormField error={null}><input /></FormField>);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<FormField className="custom"><input /></FormField>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom');
  });

  it('exports fieldStyles object', () => {
    expect(fieldStyles).toBeDefined();
    expect(typeof fieldStyles).toBe('object');
  });
});
