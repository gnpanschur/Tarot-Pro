import React, { useState, useContext } from 'react';
import { tarotDeck } from '../data/tarotData';
import { motion } from 'framer-motion';
import CardInfoModal from '../components/CardInfoModal';
import { TarotContext } from '../context/TarotContext';
import { X } from 'lucide-react';

const Lexicon = () => {
  const { setIsLexiconOpen } = useContext(TarotContext);
  const [filter, setFilter] = useState('All');
  const [selectedCard, setSelectedCard] = useState(null);

  // Derive categories
  const filters = ['All', 'Major Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles'];

  const filteredDeck = tarotDeck.filter(card => {
    if (filter === 'All') return true;
    if (filter === 'Major Arcana') return card.arcana === 'Major Arcana';
    return card.suit === filter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(10, 4, 19, 0.98)', zIndex: 2000,
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Fixed Header */}
      <div className="lexicon-header" style={{
        padding: '0.8rem 1rem', borderBottom: '1px solid rgba(204,153,51,0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(0,0,0,0.5)', zIndex: 2010
      }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', margin: 0, fontFamily: 'var(--font-heading)' }}>Lexikon</h2>
        <button 
          onClick={() => setIsLexiconOpen(false)}
          className="btn-mystic"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
        >
          <X size={18} /> Schließen
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="lexicon-content" style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem 5rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: 'calc(1.5rem + 2vw)', marginBottom: '1rem', textShadow: '0 0 20px var(--accent-gold-glow)' }}>Das Buch der Schatten</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
        Tiefgreifendes Wissen über alle 78 Tarotkarten.
      </p>

      {/* Direct Select */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <select 
          onChange={(e) => {
            const card = tarotDeck.find(c => c.name === e.target.value);
            if (card) setSelectedCard(card);
          }}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            width: '100%',
            maxWidth: '100%',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">-- Gezielt nach einer Karte suchen --</option>
          {tarotDeck.map(card => (
            <option key={card.id + '_select'} value={card.name}>{card.name}</option>
          ))}
        </select>
      </div>

      {/* Filter Menu */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.5rem', 
              borderRadius: '20px',
              border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'var(--card-border)'}`,
              background: filter === f ? 'rgba(204, 153, 51, 0.2)' : 'transparent',
              color: filter === f ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {f === 'Wands' ? 'Stäbe' : f === 'Cups' ? 'Kelche' : f === 'Swords' ? 'Schwerter' : f === 'Pentacles' ? 'Münzen' : f === 'Major Arcana' ? 'Große Arkana' : 'Alle'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
        {filteredDeck.map(card => (
          <motion.div 
            key={card.numericId}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setSelectedCard(card)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <img 
              src={card.imagePath} 
              alt={card.name} 
              style={{ width: '100%', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.4)', border: '1px solid var(--card-border)' }} 
            />
            <p style={{ marginTop: '0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)' }}>{card.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Card Modal */}
      {selectedCard && <CardInfoModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
        </div>
      </div>
    </motion.div>
  );
};

export default Lexicon;
