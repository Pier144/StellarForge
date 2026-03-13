import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  it('calls onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalled();
  });
  it('supports variants: primary, secondary, ghost', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByText('P')).toBeInTheDocument();
    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByText('S')).toBeInTheDocument();
    rerender(<Button variant="ghost">G</Button>);
    expect(screen.getByText('G')).toBeInTheDocument();
  });
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByText('X')).toBeDisabled();
  });
});
