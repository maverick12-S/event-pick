import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, LinkButton, LinkGroup } from '../Button/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('fires onClick', () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(clicked).toBe(true);
  });

  it('applies sm size class', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('Sm');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom">Test</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('custom');
  });
});

describe('LinkButton', () => {
  it('renders children', () => {
    render(<LinkButton>Link</LinkButton>);
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('fires onClick', () => {
    let clicked = false;
    render(<LinkButton onClick={() => { clicked = true; }}>Link</LinkButton>);
    fireEvent.click(screen.getByText('Link'));
    expect(clicked).toBe(true);
  });

  it('is a button element', () => {
    render(<LinkButton>Link</LinkButton>);
    expect(screen.getByText('Link').tagName).toBe('BUTTON');
  });
});

describe('LinkGroup', () => {
  it('renders children', () => {
    render(<LinkGroup><span>Child</span></LinkGroup>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LinkGroup className="custom"><span>X</span></LinkGroup>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
