import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CloudRain, Wind, AlertTriangle, CheckSquare, Compass, Send, Loader2, Lock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  
  // AI Assistant State
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login validation
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin / admin123');
    }
  };

  const fetchWeather = async () => {
    if (!city) return;
    setLoadingWeather(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
        
        // Auto-generate a preparedness plan based on current weather when fetched
        generatePreparednessPlan(data, city, language);
      } else {
        alert("Could not fetch weather. Check city name or wait for API key to activate.");
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingWeather(false);
  };

  const generatePreparednessPlan = async (weather, location, lang) => {
    setLoadingAI(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const contextPrompt = `
        You are a Monsoon Preparedness Expert. 
        The user is in ${location}. 
        Current weather: ${weather.weather[0].description}, Temp: ${weather.main.temp}°C, Wind: ${weather.wind.speed}m/s.
        Generate a concise, personalized emergency checklist, safety recommendations, and travel advisory for this specific weather condition. 
        Format your response in Markdown. Respond in ${lang}.
      `;
      
      const result = await model.generateContent(contextPrompt);
      let responseText = "";
      try {
        responseText = result.response.text();
      } catch (e) {
        if (result.response.candidates?.[0]?.content?.parts) {
          responseText = result.response.candidates[0].content.parts
            .filter(p => p.text)
            .map(p => p.text)
            .join('\n');
        } else {
          responseText = "Error parsing response.";
        }
      }
      
      setChatHistory([{ role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error(error);
      setChatHistory([{ role: 'assistant', text: "Error generating plan. Please ensure your Gemini API key is valid." }]);
    }
    setLoadingAI(false);
  };

  const handleSendMessage = async () => {
    if (!prompt) return;
    const userMessage = prompt;
    setPrompt('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoadingAI(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const context = weatherData 
        ? `Location: ${city}, Weather: ${weatherData.weather[0].description}. ` 
        : '';
        
      const result = await model.generateContent(`
        Context: ${context}
        User Language: ${language}
        You are a helpful monsoon preparedness assistant. Answer the user's question directly and concisely in Markdown.
        User: ${userMessage}
      `);
      
      let responseText = "";
      try {
        responseText = result.response.text();
      } catch (e) {
        if (result.response.candidates?.[0]?.content?.parts) {
          responseText = result.response.candidates[0].content.parts
            .filter(p => p.text)
            .map(p => p.text)
            .join('\n');
        } else {
          responseText = "Error parsing response.";
        }
      }
      
      setChatHistory(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Error connecting to AI." }]);
    }
    setLoadingAI(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <CloudRain size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} />
            <h2 style={{ marginTop: '1rem' }}>MonsoonShield AI</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Username (admin)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Password (admin123)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            
            {loginError && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{loginError}</p>}
            
            <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
              Login
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <p>Demo Credentials:</p>
            <p>Username: <strong>admin</strong> | Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="flex-center" style={{ flexDirection: 'column', marginBottom: '3rem', position: 'relative' }}>
        <button 
          onClick={() => setIsAuthenticated(false)} 
          style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
        >
          Logout
        </button>
        <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CloudRain size={48} color="var(--primary-color)" />
          MonsoonShield AI
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>AI-Powered Weather Alerts & Emergency Preparedness</p>
      </header>

      <div className="grid-dashboard">
        
        {/* Weather Dashboard Side */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={24} /> Live Weather
          </h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Enter city name..." 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <button onClick={fetchWeather} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold' }}>
              {loadingWeather ? <Loader2 className="spin" size={20} /> : 'Fetch'}
            </button>
          </div>

          {weatherData && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {Math.round(weatherData.main.temp)}°C
              </div>
              <p style={{ fontSize: '1.2rem', textTransform: 'capitalize', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                {weatherData.weather[0].description}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Wind size={18} /> Wind Speed: {weatherData.wind.speed} m/s
                </div>
                {weatherData.weather[0].id < 600 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)', marginTop: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                    <AlertTriangle size={18} /> Severe Weather Warning Active
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Side */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', animationDelay: '0.1s', height: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={24} color="var(--success-color)" /> AI Preparedness Guide
            </h2>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border-color)' }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatHistory.length === 0 ? (
              <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', textAlign: 'center', flexDirection: 'column' }}>
                <CloudRain size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>Enter a city to generate a personalized preparedness plan, or ask a question below.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  padding: '1rem',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown className="markdown-body">{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              ))
            )}
            {loadingAI && (
              <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--primary-color)' }}>
                <Loader2 className="spin" size={24} /> Generating insights...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Ask about evacuation routes, supplies, or safety..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <button onClick={handleSendMessage} style={{ padding: '0 1.5rem', borderRadius: '8px', background: 'var(--success-color)', color: 'white' }}>
              <Send size={20} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
