import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Book, Settings, Key, Music, Music2, Library } from 'lucide-react';
import { TarotContext } from '../context/TarotContext';
import { audio } from '../services/audioService';

const NavBar = () => {
  const { apiKey, setApiKey, setIsLexiconOpen } = useContext(TarotContext);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isPlaying, setIsPlaying] = useState(false);

  const saveSettings = () => {
    setApiKey(tempKey);
    setShowSettings(false);
  };

  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '2rem' }} className="glass-panel">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            <Sparkles color="var(--accent-gold)" /> Mystic Tarot
          </Link>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button onClick={() => {
              const state = audio.toggleAmbience();
              setIsPlaying(state);
            }} style={{ color: isPlaying ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
              {isPlaying ? <Music size={20} /> : <Music2 size={20} />}
            </button>
            <button onClick={() => setIsLexiconOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
              <Library size={20} /> Lexikon
            </button>
            <Link to="/journal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Book size={20} /> Journal
            </Link>
            <button onClick={() => setShowSettings(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', hover: 'var(--accent-gold-glow)' }}>
              <Settings size={20} /> Settings
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
