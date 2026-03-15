import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockUseAuth = vi.fn();
const mockNavigate = vi.fn();

// Mock Navigate to avoid React Router v7 jsdom hang
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Navigate: (props: { to: string }) => {
      mockNavigate(props.to);
      return null;
    },
  };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../features/accounts/components/TermsAcceptanceModal', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="terms-modal">Terms Modal</div> : null,
}));

import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

function renderInRouter(initialEntries = ['/dashboard']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProtectedRoute />
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

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
    renderInRouter();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
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
