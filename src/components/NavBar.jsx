import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Book, Settings, Key, Library, Smile, Frown } from 'lucide-react';
import { TarotContext } from '../context/TarotContext';
import { audio } from '../services/audioService';

const NavBar = () => {
  const { apiKey, setApiKey, setIsLexiconOpen, safetyMode, setSafetyMode } = useContext(TarotContext);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempSafetyMode, setTempSafetyMode] = useState(safetyMode);

  const saveSettings = () => {
    setApiKey(tempKey);
    setSafetyMode(tempSafetyMode);
    setShowSettings(false);
  };

  const openSettings = () => {
    setTempKey(apiKey);
    setTempSafetyMode(safetyMode);
    setShowSettings(true);
  };

  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }} className="glass-panel">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', minWidth: 'fit-content' }}>
            <Sparkles color="var(--accent-gold)" /> <span className="nav-label">Mystic Tarot</span>
          </Link>
          
          <div style={{ display: 'flex', gap: 'calc(0.5rem + 1vw)', alignItems: 'center' }}>
            <button onClick={() => setIsLexiconOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-gold)' }}>
              <Library size={20} /> <span className="nav-label">Lexikon</span>
            </button>
            <Link to="/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Book size={20} /> <span className="nav-label">Journal</span>
            </Link>
            <button onClick={openSettings} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-gold)' }}>
              <Settings size={20} /> <span className="nav-label">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h2>Einen API-Key konfigurieren</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Hinterlege deinen OpenAI API Key für tiefergehende KI-Interpretationen. Der Key wird lokal in deinem Browser gespeichert.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--card-border)' }}>
              <Key size={20} color="var(--text-secondary)" />
              <input 
                type="password" 
                value={tempKey} 
                onChange={(e) => setTempKey(e.target.value)} 
                placeholder="sk-..." 
                style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', marginTop: '1rem' }}>
              <button 
                onClick={() => setTempSafetyMode(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%', 
                  border: tempSafetyMode ? '1px solid var(--accent-gold)' : '1px solid var(--card-border)',
                  background: tempSafetyMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0,0,0,0.3)',
                  color: tempSafetyMode ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                <Smile size={32} />
              </button>
              
              <button 
                onClick={() => setTempSafetyMode(false)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%', 
                  border: !tempSafetyMode ? '1px solid #ff4444' : '1px solid var(--card-border)',
                  background: !tempSafetyMode ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0,0,0,0.3)',
                  color: !tempSafetyMode ? '#ff4444' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                <Frown size={32} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setShowSettings(false)} style={{ color: 'var(--text-secondary)' }}>Abbrechen</button>
              <button className="btn-mystic" onClick={saveSettings}>Speichern</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
