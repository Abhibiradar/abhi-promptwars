import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIChat from './AIChat';

vi.mock('lucide-react', () => ({
  CloudRain: () => <div data-testid="icon" />,
  CheckSquare: () => <div data-testid="icon" />,
  Send: () => <div data-testid="icon" />,
  Loader2: () => <div data-testid="icon" />,
  Info: () => <div data-testid="icon" />
}));

describe('AIChat Component', () => {
  it('renders initial state with empty chat', () => {
    render(<AIChat language="English" setLanguage={() => {}} chatHistory={[]} loadingAI={false} prompt="" setPrompt={() => {}} handleSendMessage={() => {}} />);
    expect(screen.getByText(/Enter a city to generate/i)).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('renders chat history correctly', () => {
    const mockHistory = [
      { role: 'user', text: 'Hello' },
      { role: 'assistant', text: 'Hi there' }
    ];
    render(<AIChat language="English" setLanguage={() => {}} chatHistory={mockHistory} loadingAI={false} prompt="" setPrompt={() => {}} handleSendMessage={() => {}} />);
    expect(screen.getByText('Hello')).toBeDefined();
    expect(screen.getByText('Hi there')).toBeDefined();
  });

  it('triggers send message on button click', () => {
    const mockSend = vi.fn();
    render(<AIChat language="English" setLanguage={() => {}} chatHistory={[]} loadingAI={false} prompt="Test" setPrompt={() => {}} handleSendMessage={mockSend} />);
    fireEvent.click(screen.getByRole('button', { name: /Send message to AI/i }));
    expect(mockSend).toHaveBeenCalled();
  });
});
