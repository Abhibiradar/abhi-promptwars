import { memo, useState } from 'react';
import { Wind, AlertTriangle, Compass, Loader2, MapPin } from 'lucide-react';

/**
 * WeatherDashboard Component - Displays real-time weather metrics
 * Wrapped in React.memo for efficiency
 */
const WeatherDashboard = memo(({ city, setCity, fetchWeather, loadingWeather, weatherData }) => {
  const [locating, setLocating] = useState(false);

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
        if (res.ok) {
          const data = await res.json();
          setCity(data.name); // Automatically fill in the input box
          // We can't easily call fetchWeather from App.jsx directly passing coordinates since it only takes city string,
          // but setting the city will let them click Fetch or we can trigger it. 
          // Let's just alert the user to click fetch, or wait, we can just update the city state!
          alert(`Detected location: ${data.name}. Click Fetch to confirm.`);
        }
      } catch (err) {
        console.error(err);
        alert('Could not detect city from coordinates.');
      }
      setLocating(false);
    }, () => {
      alert('Unable to retrieve your location. Check permissions.');
      setLocating(false);
    });
  };

  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '2rem' }} aria-labelledby="weather-title">
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 id="weather-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Compass size={24} aria-hidden="true" /> Live Weather
        </h2>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
        <label htmlFor="city-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>City Name</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch', width: '100%' }}>
          <button 
            onClick={handleAutoLocate} 
            disabled={locating}
            aria-label="Auto-detect location" 
            title="Auto-detect location"
            style={{ flexShrink: 0, padding: '0 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {locating ? <Loader2 className="spin" size={20} /> : <MapPin size={20} />}
          </button>
          <input 
            id="city-input"
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            aria-required="true"
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white', minWidth: '0' }}
          />
          <button onClick={fetchWeather} aria-label="Fetch Weather" style={{ flexShrink: 0, padding: '0 1.5rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
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
