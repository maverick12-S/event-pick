import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../features/accounts/components/TermsAcceptanceModal', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="terms-modal">Terms Modal</div> : null,
}));

import ProtectedRoute from '../ProtectedRoute';

function renderInRouter(initialEntries = ['/dashboard']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProtectedRoute />
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('shows loading when not initialized', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      termsAccepted: false,
      acceptTerms: vi.fn(),
      logout: vi.fn(),
    });
    renderInRouter();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      termsAccepted: false,
      acceptTerms: vi.fn(),
      logout: vi.fn(),
    });
    // Navigate redirects, so nothing visible from the protected route
    const { container } = renderInRouter();
    expect(container.querySelector('[data-testid="terms-modal"]')).toBeNull();
    expect(screen.queryByText('読み込み中...')).toBeNull();
  });

  it('shows terms modal when authenticated but terms not accepted', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      termsAccepted: false,
      acceptTerms: vi.fn(),
      logout: vi.fn(),
    });
    renderInRouter();
    expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
  });
});
