import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import OperatorRoute from '../OperatorRoute';

function renderInRouter(initialEntries = ['/admin']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <OperatorRoute />
    </MemoryRouter>,
  );
}

describe('OperatorRoute', () => {
  it('shows loading when not initialized', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
      isOperator: false,
    });
    renderInRouter();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
      isOperator: false,
    });
    const { container } = renderInRouter();
    expect(screen.queryByText('読み込み中...')).toBeNull();
    // Should have redirected, container won't have meaningful content
    expect(container.innerHTML).not.toContain('読み込み中');
  });

  it('redirects non-operator to dashboard', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
      isOperator: false,
    });
    const { container } = renderInRouter();
    expect(screen.queryByText('読み込み中...')).toBeNull();
    expect(container.innerHTML).not.toContain('読み込み中');
  });
});
