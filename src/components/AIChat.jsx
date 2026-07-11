import { memo } from 'react';
import { CloudRain, CheckSquare, Send, Loader2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

/**
 * AIChat Component - Handles the interactive GenAI messaging interface
 * Wrapped in React.memo for efficiency
 */
const AIChat = memo(({ language, setLanguage, chatHistory, loadingAI, prompt, setPrompt, handleSendMessage }) => {
  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', animationDelay: '0.1s', height: '600px' }} aria-labelledby="ai-title">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 id="ai-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <CheckSquare size={24} color="var(--success-color)" aria-hidden="true" /> AI Preparedness Guide
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="language-select" className="visually-hidden" style={{ display: 'none' }}>Select Language</label>
          <select 
            id="language-select"
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
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-live="polite">
        {chatHistory.length === 0 ? (
          <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)', textAlign: 'center', flexDirection: 'column' }}>
            <CloudRain size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} aria-hidden="true" />
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
                <div className="markdown-body">
                  <ReactMarkdown>{DOMPurify.sanitize(String(msg.text || ""))}</ReactMarkdown>
                </div>
              ) : (
                DOMPurify.sanitize(String(msg.text || ""))
              )}
            </div>
          ))
        )}
        {loadingAI && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 className="spin" size={24} aria-hidden="true" /> Generating insights...
          </div>
        )}
      </div>

      {/* Problem Statement Alignment: Quick Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }} aria-label="Emergency Quick Actions">
        <button 
          onClick={() => { setPrompt("What is the flood safety protocol?"); handleSendMessage(); }}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Info size={14} /> Flood Safety
        </button>
        <button 
          onClick={() => { setPrompt("Find nearest emergency shelters and contacts."); handleSendMessage(); }}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Info size={14} /> Shelters & Contacts
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem' }}>
        <label htmlFor="prompt-input" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ask AI</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            id="prompt-input"
            type="text" 
            placeholder="Ask about evacuation routes, supplies, or safety..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button onClick={handleSendMessage} aria-label="Send message to AI" style={{ padding: '0 1.5rem', borderRadius: '8px', background: 'var(--success-color)', color: 'white' }}>
            <Send size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
});

AIChat.displayName = 'AIChat';
export default AIChat;
