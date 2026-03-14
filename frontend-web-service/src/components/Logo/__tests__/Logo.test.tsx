import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

import Logo from '../../Logo/Logo';

describe('Logo', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders logo image', () => {
    render(<Logo />);
    const img = screen.getByAltText('Logo');
    expect(img).toBeInTheDocument();
  });

  it('renders "Event Pick" text', () => {
    render(<Logo />);
    expect(screen.getByText('Event Pick')).toBeInTheDocument();
  });

  it('navigates to /home on click', () => {
    render(<Logo />);
    fireEvent.click(screen.getByText('Event Pick'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('applies custom className', () => {
    const { container } = render(<Logo className="custom" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom');
  });
});
