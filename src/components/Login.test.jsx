import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

vi.mock('lucide-react', () => ({
  CloudRain: () => <div data-testid="icon" />,
  Lock: () => <div data-testid="icon" />,
  User: () => <div data-testid="icon" />,
}));

describe('Login Component', () => {
  it('renders correctly', () => {
    render(<Login onLogin={() => {}} />);
    expect(screen.getByText('MonsoonShield AI')).toBeDefined();
    expect(screen.getByLabelText('Username')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
  });

  it('handles input correctly', () => {
    render(<Login onLogin={() => {}} />);
    const userIn = screen.getByPlaceholderText('admin');
    fireEvent.change(userIn, { target: { value: 'admin' } });
    expect(userIn.value).toBe('admin');
  });

  it('submits successfully with correct credentials', () => {
    const mockLogin = vi.fn();
    render(<Login onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('admin123'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(mockLogin).toHaveBeenCalledWith(true);
  });
});
