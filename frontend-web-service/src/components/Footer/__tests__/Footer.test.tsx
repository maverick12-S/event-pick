import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../../features/accounts/components/TermsOfServiceModal', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="terms-modal"><button onClick={onClose}>close</button></div> : null,
}));
vi.mock('../../../features/accounts/components/SecurityInfoModal', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="security-modal"><button onClick={onClose}>close</button></div> : null,
}));
vi.mock('../../../features/accounts/components/PrivacyPolicyModal', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="privacy-modal"><button onClick={onClose}>close</button></div> : null,
}));
vi.mock('../../../features/accounts/components/CommercialTransactionModal', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="commercial-modal"><button onClick={onClose}>close</button></div> : null,
}));

import Footer from '../Footer';

describe('Footer', () => {
  it('renders company name', () => {
    render(<Footer />);
    expect(screen.getByText('Solvevia.')).toBeInTheDocument();
  });

  it('renders all four link buttons', () => {
    render(<Footer />);
    expect(screen.getByText('利用規約')).toBeInTheDocument();
    expect(screen.getByText('セキュリティ情報')).toBeInTheDocument();
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
    expect(screen.getByText('特定商取引法に基づく表記')).toBeInTheDocument();
  });

  it('renders footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).not.toBeNull();
  });

  it('opens terms modal on click', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('利用規約'));
    expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
  });

  it('opens security modal on click', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('セキュリティ情報'));
    expect(screen.getByTestId('security-modal')).toBeInTheDocument();
  });

  it('opens privacy modal on click', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('プライバシーポリシー'));
    expect(screen.getByTestId('privacy-modal')).toBeInTheDocument();
  });

  it('opens commercial transaction modal on click', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('特定商取引法に基づく表記'));
    expect(screen.getByTestId('commercial-modal')).toBeInTheDocument();
  });

  it('closes terms modal', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('利用規約'));
    expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close'));
    expect(screen.queryByTestId('terms-modal')).toBeNull();
  });
});
