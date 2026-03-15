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

import { MemoryRouter } from 'react-router-dom';
import OperatorRoute from '../OperatorRoute';

function renderInRouter(initialEntries = ['/admin']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <OperatorRoute />
    </MemoryRouter>,
  );
}

describe('OperatorRoute', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows loading when not initialized', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      isOperator: false,
    });
    renderInRouter();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isOperator: false,
    });
    renderInRouter();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('redirects non-operator to /dashboard', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      isOperator: false,
    });
    renderInRouter();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
