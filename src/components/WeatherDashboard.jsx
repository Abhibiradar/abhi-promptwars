import { memo } from 'react';
import { Wind, AlertTriangle, Compass, Loader2 } from 'lucide-react';

/**
 * WeatherDashboard Component - Displays real-time weather metrics
 * Wrapped in React.memo for efficiency
 */
const WeatherDashboard = memo(({ city, setCity, fetchWeather, loadingWeather, weatherData }) => {
  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '2rem' }} aria-labelledby="weather-title">
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 id="weather-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Compass size={24} aria-hidden="true" /> Live Weather
        </h2>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
        <label htmlFor="city-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>City Name</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            id="city-input"
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            aria-required="true"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button onClick={fetchWeather} aria-label="Fetch Weather" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold' }}>
            {loadingWeather ? <Loader2 className="spin" size={20} aria-hidden="true" /> : 'Fetch'}
          </button>
        </div>
      </div>

      {weatherData && (
        <article style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }} aria-label="Weather Results">
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }} aria-label={`Temperature: ${Math.round(weatherData.main.temp)} degrees Celsius`}>
            {Math.round(weatherData.main.temp)}°C
          </div>
          <p style={{ fontSize: '1.2rem', textTransform: 'capitalize', color: 'var(--primary-color)', marginBottom: '1rem' }} aria-label={`Condition: ${weatherData.weather[0].description}`}>
            {weatherData.weather[0].description}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }} aria-label={`Wind Speed: ${weatherData.wind.speed} meters per second`}>
              <Wind size={18} aria-hidden="true" /> Wind Speed: {weatherData.wind.speed} m/s
            </div>
            {weatherData.weather[0].id < 600 && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)', marginTop: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                <AlertTriangle size={18} aria-hidden="true" /> Severe Weather Warning Active
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  );
});

WeatherDashboard.displayName = 'WeatherDashboard';
export default WeatherDashboard;
