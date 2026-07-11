import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center" style={{ minHeight: '100vh', color: 'var(--text-color)', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <AlertTriangle size={48} color="var(--danger-color)" style={{ margin: '0 auto 1rem' }} />
            <h2>Something went wrong.</h2>
            <p style={{ color: 'var(--text-muted)' }}>We are working on fixing it. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white' }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
