import { useState, useCallback, memo, useEffect } from 'react';
import { CloudRain, User } from 'lucide-react';
import DOMPurify from 'dompurify';

/**
 * Onboarding Component - Handles real-world persistent user setup
 * Replaces the hardcoded "admin" login with local storage persistence.
 */
const Login = memo(({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');

  // Check if they are already saved in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('monsoon_username');
    if (savedUser) {
      onLogin(savedUser);
    }
  }, [onLogin]);

  /**
   * Sanitizes input to prevent basic injection
   */
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  /**
   * Handles the form submission securely and saves to localStorage
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const cleanUser = sanitizeInput(username);

    if (cleanUser.length >= 2) {
      localStorage.setItem('monsoon_username', cleanUser);
      onLogin(cleanUser);
      setLoginError('');
    } else {
      setLoginError('Please enter a valid name (at least 2 characters).');
    }
  }, [username, onLogin]);

  return (
    <main className="container flex-center" style={{ minHeight: '100vh' }} aria-label="Welcome Setup">
      <section className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }} aria-labelledby="login-title">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CloudRain size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} aria-hidden="true" />
          <h2 id="login-title" style={{ marginTop: '1rem' }}>MonsoonShield AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome! Let's get your profile set up.</p>
        </header>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Setup Form">
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="username-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Your Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
              <input 
                id="username-input"
                type="text" 
                placeholder="e.g. Jane Doe" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          </div>
          
          <div aria-live="assertive">
            {loginError && <p role="alert" style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{loginError}</p>}
          </div>
          
          <button type="submit" aria-label="Continue setup" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
            Get Started
          </button>
        </form>
      </section>
    </main>
  );
});

Login.displayName = 'Login';
export default Login;
