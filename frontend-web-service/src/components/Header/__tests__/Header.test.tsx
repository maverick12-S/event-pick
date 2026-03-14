import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockUseAuth = vi.fn();
const mockUseCompanyTicket = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../../features/home/hooks/useCompanyTicket', () => ({
  useCompanyTicket: (...args: unknown[]) => mockUseCompanyTicket(...args),
}));

vi.mock('../../Logo', () => ({
  default: ({ className }: { className?: string }) => <div data-testid="logo" className={className}>Logo</div>,
}));

import Header from '../Header';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
  });

  it('renders header element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).not.toBeNull();
  });

  it('renders Logo', () => {
    render(<Header />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('shows date panel in public view', () => {
    render(<Header />);
    // Date is in format YYYY.MM.DD
    const dateRegex = /\d{4}\.\d{2}\.\d{2}/;
    const texts = screen.getAllByText(dateRegex);
    expect(texts.length).toBeGreaterThanOrEqual(1);
  });

  it('shows user menu in authenticated view', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'テストユーザー', username: 'test' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
    render(<Header isAuthenticatedView />);
    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
  });

  it('uses default name when user has no displayName', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: '', username: '' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
    render(<Header isAuthenticatedView />);
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
  });

  it('shows ticket info when available', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'User' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({
      data: { daily_remaining: 5, monthly_remaining: 20 },
    });
    render(<Header isAuthenticatedView />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('opens user menu on click', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'ユーザー' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
    render(<Header isAuthenticatedView />);
    const userButton = screen.getByText('ユーザー').closest('button')!;
    fireEvent.click(userButton);
    expect(screen.getByText('アカウント情報の変更')).toBeInTheDocument();
    expect(screen.getByText('通知設定')).toBeInTheDocument();
    expect(screen.getByText('ログアウト')).toBeInTheDocument();
  });

  it('navigates to settings on menu item click', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'ユーザー' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
    render(<Header isAuthenticatedView />);
    fireEvent.click(screen.getByText('ユーザー').closest('button')!);
    fireEvent.click(screen.getByText('アカウント情報の変更'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings/account');
  });

  it('calls logout and navigates to /login on logout click', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'ユーザー' },
      logout: mockLogout,
    });
    mockUseCompanyTicket.mockReturnValue({ data: null });
    render(<Header isAuthenticatedView />);
    fireEvent.click(screen.getByText('ユーザー').closest('button')!);
    fireEvent.click(screen.getByText('ログアウト'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
