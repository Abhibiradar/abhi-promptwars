import React, { useState, useCallback, Suspense, lazy } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CloudRain, Loader2 } from 'lucide-react';
import './App.css';

// Modular Components
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded for Efficiency
const WeatherDashboard = lazy(() => import('./components/WeatherDashboard'));
const AIChat = lazy(() => import('./components/AIChat'));

// Initialize Gemini API safely
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  // Auth State
  const [userName, setUserName] = useState('');

  // Weather State
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  
  // AI Assistant State
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [language, setLanguage] = useState('English');

  /**
   * Generates a context-aware preparedness plan based on the live weather.
   * Memoized using useCallback.
   */
  const generatePreparednessPlan = useCallback(async (weather, location, lang) => {
    setLoadingAI(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const contextPrompt = `
        You are a Monsoon Preparedness Expert. 
        The user's name is ${userName}. Greet them personally.
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
  }, []);

  /**
   * Fetches the weather data from OpenWeatherMap API securely
   * Memoized using useCallback.
   */
  const fetchWeather = useCallback(async () => {
    // Basic validation
    const cleanCity = city.trim();
    if (!cleanCity || cleanCity.length > 100) return;
    
    setLoadingWeather(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
        // Auto-trigger AI context plan
        generatePreparednessPlan(data, cleanCity, language);
      } else {
        alert("Could not fetch weather. Check city name or wait for API key to activate.");
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingWeather(false);
  }, [city, language, generatePreparednessPlan]);

  /**
   * Handles interactive AI chat messaging
   * Memoized using useCallback.
   */
  const handleSendMessage = useCallback(async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || cleanPrompt.length > 500) return;
    
    const userMessage = cleanPrompt;
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
  }, [prompt, city, weatherData, language]);

  if (!userName) {
    return (
      <ErrorBoundary>
        <Login onLogin={setUserName} />
      </ErrorBoundary>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('monsoon_username');
    setUserName('');
  };

  return (
    <ErrorBoundary>
      <main className="container" aria-label="Main Application Dashboard">
        <header className="flex-center" style={{ flexDirection: 'column', marginBottom: '3rem', position: 'relative' }} role="banner">
          <button 
            onClick={handleLogout} 
            aria-label="Logout of application"
            style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
          >
            Switch User
          </button>
          <h1 className="animate-fade-in" style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CloudRain size={48} color="var(--primary-color)" aria-hidden="true" />
            MonsoonShield AI
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>AI-Powered Weather Alerts & Emergency Preparedness</p>
        </header>

        <Suspense fallback={
          <div className="flex-center" style={{ width: '100%', height: '50vh', color: 'var(--primary-color)' }}>
            <Loader2 className="spin" size={48} aria-hidden="true" />
          </div>
        }>
          <div className="grid-dashboard">
            <WeatherDashboard 
              city={city}
              setCity={setCity}
              fetchWeather={fetchWeather}
              loadingWeather={loadingWeather}
              weatherData={weatherData}
            />
            
            <AIChat 
              language={language}
              setLanguage={setLanguage}
              chatHistory={chatHistory}
              loadingAI={loadingAI}
              prompt={prompt}
              setPrompt={setPrompt}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}

export default App;
