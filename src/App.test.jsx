import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the lucide-react icons to prevent rendering issues in tests
vi.mock('lucide-react', () => ({
  CloudRain: () => <div data-testid="icon-cloud-rain" />,
  Lock: () => <div data-testid="icon-lock" />,
  User: () => <div data-testid="icon-user" />,
  Wind: () => <div data-testid="icon-wind" />,
  AlertTriangle: () => <div data-testid="icon-alert" />,
  Compass: () => <div data-testid="icon-compass" />,
  Send: () => <div data-testid="icon-send" />,
  Loader2: () => <div data-testid="icon-loader" />,
  CheckSquare: () => <div data-testid="icon-check" />
}));

describe('App Component', () => {
  it('renders the login screen initially', () => {
    render(<App />);
    expect(screen.getByText('MonsoonShield AI')).toBeDefined();
    expect(screen.getByText('Sign in to continue')).toBeDefined();
    expect(screen.getByRole('button', { name: /Login/i })).toBeDefined();
  });

  it('shows error on invalid login', async () => {
    render(<App />);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    // Attempt login without typing credentials
    fireEvent.click(loginButton);
    
    expect(screen.getByText(/Invalid credentials/i)).toBeDefined();
  });
});
