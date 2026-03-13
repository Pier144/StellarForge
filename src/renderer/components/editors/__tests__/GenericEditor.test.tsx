import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericEditor } from '../GenericEditor';
import { traitSchema } from '@shared/schemas/traitSchema';

describe('GenericEditor', () => {
  it('renders fields from schema', () => {
    render(<GenericEditor schema={traitSchema} item={{}} onChange={vi.fn()} />);
    expect(screen.getByText(/Trait ID/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cost/i).length).toBeGreaterThan(0);
  });

  it('groups fields by group property', () => {
    render(<GenericEditor schema={traitSchema} item={{}} onChange={vi.fn()} />);
    expect(screen.getByText(/general/i)).toBeInTheDocument();
  });

  it('calls onChange when a field is modified', () => {
    const onChange = vi.fn();
    render(<GenericEditor schema={traitSchema} item={{ key: 'test' }} onChange={onChange} />);
    const input = screen.getByDisplayValue('test');
    fireEvent.change(input, { target: { value: 'new_key' } });
    expect(onChange).toHaveBeenCalled();
  });
});
