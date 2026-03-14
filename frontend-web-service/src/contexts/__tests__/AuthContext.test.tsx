import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock dependencies
vi.mock('../../features/login/api/authApi', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    }),
  },
}));

vi.mock('../../api/tokenService', () => ({
  tokenService: {
    getAccessToken: vi.fn().mockReturnValue(null),
    setAccessToken: vi.fn(),
    getRefreshToken: vi.fn().mockReturnValue(null),
    setRefreshToken: vi.fn(),
    isUsingCookies: vi.fn().mockReturnValue(false),
    clear: vi.fn(),
  },
}));

vi.mock('../../features/login/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    data: undefined,
    isFetching: false,
  }),
}));

const TERMS_STORAGE_KEY = 'eventpick_terms_accepted';
const TERMS_VERSION = '2026-03-14';

function AuthConsumer() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="operator">{String(auth.isOperator)}</span>
      <span data-testid="initialized">{String(auth.isInitialized)}</span>
      <span data-testid="terms">{String(auth.termsAccepted)}</span>
      <span data-testid="error">{auth.error ?? ''}</span>
      <button data-testid="accept" onClick={auth.acceptTerms}>accept</button>
      <button data-testid="logout" onClick={auth.logout}>logout</button>
      <button data-testid="clear-error" onClick={auth.clearAuthError}>clear</button>
    </div>
  );
}

function renderWithProvider() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides initial unauthenticated state', () => {
    renderWithProvider();
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('initialized').textContent).toBe('true');
  });

  it('provides termsAccepted=false by default', () => {
    renderWithProvider();
    expect(screen.getByTestId('terms').textContent).toBe('false');
  });

  it('reads terms acceptance from localStorage', () => {
    localStorage.setItem(TERMS_STORAGE_KEY, TERMS_VERSION);
    renderWithProvider();
    expect(screen.getByTestId('terms').textContent).toBe('true');
  });

  it('accepts terms', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByTestId('accept').click();
    });
    expect(screen.getByTestId('terms').textContent).toBe('true');
    expect(localStorage.getItem(TERMS_STORAGE_KEY)).toBe(TERMS_VERSION);
  });

  it('logout clears tokens', async () => {
    const { tokenService } = await import('../../api/tokenService');
    renderWithProvider();
    await act(async () => {
      screen.getByTestId('logout').click();
    });
    expect(tokenService.clear).toHaveBeenCalled();
  });

  it('provides isOperator=false by default', () => {
    renderWithProvider();
    expect(screen.getByTestId('operator').textContent).toBe('false');
  });
});

describe('useAuth outside provider', () => {
  it('returns fallback value without crashing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Standalone() {
      const auth = useAuth();
      return <span data-testid="v">{String(auth.isAuthenticated)}</span>;
    }
    render(<Standalone />);
    expect(screen.getByTestId('v').textContent).toBe('false');
    spy.mockRestore();
  });
});
