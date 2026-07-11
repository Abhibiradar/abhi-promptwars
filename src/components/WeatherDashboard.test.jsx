import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WeatherDashboard from './WeatherDashboard';

vi.mock('lucide-react', () => ({
  Compass: () => <div data-testid="icon" />,
  Wind: () => <div data-testid="icon" />,
  AlertTriangle: () => <div data-testid="icon" />,
  Loader2: () => <div data-testid="icon" />,
  MapPin: () => <div data-testid="icon" />,
}));

describe('WeatherDashboard Component', () => {
  it('renders input correctly', () => {
    render(<WeatherDashboard city="" setCity={() => {}} fetchWeather={() => {}} loadingWeather={false} weatherData={null} />);
    expect(screen.getByLabelText('City Name')).toBeDefined();
    expect(screen.getByRole('button', { name: /Fetch Weather/i })).toBeDefined();
  });

  it('renders weather data when provided', () => {
    const mockData = {
      main: { temp: 25 },
      weather: [{ description: 'clear sky', id: 800 }],
      wind: { speed: 5 }
    };
    render(<WeatherDashboard city="Pune" setCity={() => {}} fetchWeather={() => {}} loadingWeather={false} weatherData={mockData} />);
    expect(screen.getByText('25°C')).toBeDefined();
    expect(screen.getByText('clear sky')).toBeDefined();
  });
});
