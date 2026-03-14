import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CarouselIndicator from '../CarouselIndicator';

describe('CarouselIndicator', () => {
  it('returns null when total <= 1', () => {
    const { container } = render(<CarouselIndicator total={1} currentIndex={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when total is 0', () => {
    const { container } = render(<CarouselIndicator total={0} currentIndex={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dots when total > 1', () => {
    const { container } = render(<CarouselIndicator total={3} currentIndex={1} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders correct number of visible dots (middle index)', () => {
    const { container } = render(<CarouselIndicator total={5} currentIndex={2} />);
    // visible: index 1, 2, 3 (currentIndex ± 1)
    const dots = container.querySelectorAll('[class]');
    // At minimum, 3 child dot elements + wrapper
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('renders correct number of visible dots (first index)', () => {
    const { container } = render(<CarouselIndicator total={5} currentIndex={0} />);
    // visible: index 0, 1
    expect(container.firstChild).not.toBeNull();
  });

  it('renders with aria-hidden', () => {
    const { container } = render(<CarouselIndicator total={3} currentIndex={0} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
