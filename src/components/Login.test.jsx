import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';

vi.mock('lucide-react', () => ({
  CloudRain: () => <div data-testid="icon" />,
  User: () => <div data-testid="icon" />,
}));

describe('Onboarding (Login) Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(<Login onLogin={() => {}} />);
    expect(screen.getByText('MonsoonShield AI')).toBeDefined();
    expect(screen.getByLabelText(/Your Full Name/i)).toBeDefined();
  });

  it('handles input correctly', () => {
    render(<Login onLogin={() => {}} />);
    const userIn = screen.getByLabelText(/Your Full Name/i);
    fireEvent.change(userIn, { target: { value: 'Jane' } });
    expect(userIn.value).toBe('Jane');
  });

  it('submits successfully and saves to localStorage', () => {
    const mockLogin = vi.fn();
    render(<Login onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText(/Your Full Name/i), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue setup/i }));
    
    expect(mockLogin).toHaveBeenCalledWith('Jane');
    expect(localStorage.getItem('monsoon_username')).toBe('Jane');
  });
});
