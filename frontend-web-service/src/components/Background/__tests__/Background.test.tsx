import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Background from '../Background';

describe('Background', () => {
  it('renders children', () => {
    const { getByText } = render(<Background><span>Content</span></Background>);
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Background />);
    expect(container.firstChild).not.toBeNull();
  });

  it('sets data-motion="off" when disableMotion is true', () => {
    const { container } = render(<Background disableMotion><span /></Background>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute('data-motion')).toBe('off');
  });

  it('sets data-motion="on" by default', () => {
    const { container } = render(<Background><span /></Background>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute('data-motion')).toBe('on');
  });

  it('renders overlay div', () => {
    const { container } = render(<Background isAuthenticated><span /></Background>);
    // overlay div exists
    const overlays = container.querySelectorAll('div');
    expect(overlays.length).toBeGreaterThanOrEqual(2);
  });
});
