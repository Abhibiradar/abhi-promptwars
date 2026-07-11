import { useState, useCallback, memo } from 'react';
import { CloudRain, Lock, User } from 'lucide-react';
import DOMPurify from 'dompurify';

/**
 * Login Component - Handles user authentication gateway
 * Wrapped in React.memo for efficiency
 */
const Login = memo(({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  /**
   * Sanitizes input to prevent basic injection
   * @param {string} input - raw input
   * @returns {string} - sanitized input
   */
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  /**
   * Handles the form submission securely
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const cleanUser = sanitizeInput(username);
    const cleanPass = sanitizeInput(password);

    if (cleanUser === 'admin' && cleanPass === 'admin123') {
      onLogin(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin / admin123');
    }
  }, [username, password, onLogin]);

  return (
    <main className="container flex-center" style={{ minHeight: '100vh' }} aria-label="Login Main Content">
      <section className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }} aria-labelledby="login-title">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CloudRain size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} aria-hidden="true" />
          <h2 id="login-title" style={{ marginTop: '1rem' }}>MonsoonShield AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue</p>
        </header>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Login Form">
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="username-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
              <input 
                id="username-input"
                type="text" 
                placeholder="admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="password-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true" />
              <input 
                id="password-input"
                type="password" 
                placeholder="admin123" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
          </div>
          
          <div aria-live="assertive">
            {loginError && <p role="alert" style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{loginError}</p>}
          </div>
          
          <button type="submit" aria-label="Submit login" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
            Login
          </button>
        </form>
        
        <footer style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Demo Credentials:</p>
          <p>Username: <strong>admin</strong> | Password: <strong>admin123</strong></p>
        </footer>
      </section>
    </main>
  );
});

Login.displayName = 'Login';
export default Login;
