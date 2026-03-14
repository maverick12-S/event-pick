import { describe, it, expect, vi } from 'vitest';

vi.mock('../../components/SuspenseWeather/SuspenseLoading', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="suspense">{children}</div>,
}));

vi.mock('../../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="boundary">{children}</div>,
}));

vi.mock('../../components/ErrorBoundary/errorReporter', () => ({
  reportError: vi.fn(),
}));

import { lazyLoad } from '../lazyLoad';

describe('lazyLoad', () => {
  it('returns a ReactElement', () => {
    const element = lazyLoad(() => Promise.resolve({ default: () => <div>Hello</div> }));
    expect(element).toBeDefined();
    expect(element.type).toBeDefined();
  });

  it('wraps in ErrorBoundary', () => {
    const element = lazyLoad(() => Promise.resolve({ default: () => <div /> }));
    // The outer element should be ErrorBoundary
    expect(element.props).toHaveProperty('name', 'LazyLoadBoundary');
    expect(element.props).toHaveProperty('fallbackKind', 'chunk');
  });
});
