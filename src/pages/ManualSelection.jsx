import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TarotContext } from '../context/TarotContext';
import { tarotDeck } from '../data/tarotData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Search } from 'lucide-react';

const spreadNames = {
  '1-card': 'Tageskarte / Fokus', '3-cards': 'Verlauf der Dinge', 'simple-cross': 'Einfaches Kreuz',
  'love': 'Liebes-Samen', 'decision': 'Entscheidung (2 Wege)', 'career': 'Beruf & Karriere',
  'yes-no-3': 'Ja / Nein (Präzise)', 'celtic-cross': 'Das Keltische Kreuz', 'year': 'Jahreslegung',
  'shadow': 'Schatten & Blockaden', 'spiritual': 'Spiritueller Weg', 'relationship-deep': 'Beziehung Tiefgehend',
  'problem-solution': 'Problem & Lösung', 'daily-energy': 'Tagesenergie'
};

const ManualSelection = () => {
  const { currentSpread, setCurrentCards } = useContext(TarotContext);
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pendingCard, setPendingCard] = useState(null); // card awaiting aufrecht/umgekehrt decision

  const countMap = {
    '1-card': 1, '3-cards': 3, 'simple-cross': 4, 'love': 7,
    'decision': 7, 'career': 5, 'yes-no-3': 3, 'celtic-cross': 10,
    'year': 12, 'shadow': 5, 'spiritual': 7, 'relationship-deep': 7,
    'problem-solution': 3, 'daily-energy': 3
  };
  const neededCount = countMap[currentSpread] || 1;

  const filters = ['All', 'Major Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles'];

  const filteredDeck = tarotDeck.filter(card => {
    const matchesFilter = filter === 'All' ? true : filter === 'Major Arcana' ? card.arcana === 'Major Arcana' : card.suit === filter;
    const matchesSearch = search.trim() === '' ? true : card.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (card) => {
    const isAlreadySelected = selectedCards.some(sc => sc.id === card.id);
    if (isAlreadySelected || selectedCards.length >= neededCount) return;
    setPendingCard(card);
  };

  const confirmCard = (isReversed) => {
    if (!pendingCard) return;
    setSelectedCards(prev => [...prev, { ...pendingCard, isReversed, isRevealed: true }]);
    setPendingCard(null);
  };

  const removeCard = (cardId) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId));
  };

  const handleFinish = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    if (selectedCards.length === neededCount) {
      setCurrentCards(selectedCards);
      navigate('/reading');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Manuelle Kartenauswahl</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Legetechnik: <strong style={{ color: 'white' }}>{spreadNames[currentSpread] || currentSpread}</strong>
        </p>
      </div>

      {/* Selection Progress Bar */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Ausgewählt: <strong style={{ color: 'var(--accent-gold)' }}>{selectedCards.length} / {neededCount}</strong></span>
          {selectedCards.length === neededCount && (
            <button className="btn-mystic" onClick={handleFinish} style={{ padding: '0.5rem 2rem' }}>
              <Check size={18} /> Zur Legung →
            </button>
          )}
        </div>

        {/* Selected cards mini row */}
        {selectedCards.length > 0 ? (
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {selectedCards.map((c, i) => (
              <div key={c.id} style={{ flexShrink: 0, textAlign: 'center', position: 'relative' }}>
                <img
                  src={c.imagePath}
                  alt={c.name}
                  style={{
                    width: '60px', borderRadius: '4px',
                    transform: c.isReversed ? 'rotate(180deg)' : 'none',
                    border: '1px solid var(--accent-gold)',
                    display: 'block'
                  }}
                />
                <button
                  onClick={() => removeCard(c.id)}
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: 'rgba(180,0,0,0.9)', border: 'none',
                    borderRadius: '50%', width: '18px', height: '18px',
                    color: 'white', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '10px'
                  }}
                >✕</button>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                  {i + 1}
                </span>
              </div>
            ))}
            {/* Empty placeholder slots */}
            {Array.from({ length: neededCount - selectedCards.length }).map((_, i) => (
              <div key={`empty-${i}`} style={{
                flexShrink: 0, width: '60px', height: '100px',
                borderRadius: '4px', border: '1px dashed rgba(204,153,51,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(204,153,51,0.3)', fontSize: '1.5rem'
              }}>?</div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '0.5rem' }}>
            Tippe auf eine Karte unten, um sie auszuwählen.
          </p>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Über das Gitter suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 3rem',
              background: 'rgba(0,0,0,0.5)', border: '1px solid var(--card-border)',
              borderRadius: '12px', color: 'white', fontFamily: 'var(--font-body)',
              fontSize: '1rem', outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dropdown Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontFamily: 'var(--font-heading)', textAlign: 'left', marginLeft: '0.5rem' }}>
            Schnellauswahl aus der Liste:
          </label>
          <select 
            onChange={(e) => {
              const card = tarotDeck.find(c => c.name === e.target.value);
              if (card) handleCardClick(card);
              e.target.value = ""; // reset for next use
            }}
            style={{
              width: '100%', padding: '1rem',
              background: 'rgba(204, 153, 51, 0.1)', border: '2px solid var(--accent-gold)',
              borderRadius: '12px', color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem', outline: 'none', cursor: 'pointer',
              boxShadow: '0 0 15px rgba(204, 153, 51, 0.2)'
            }}
          >
            <option value="" style={{ background: '#000' }}>-- Karte direkt wählen --</option>
            {tarotDeck.map(card => {
              const isSelected = selectedCards.some(sc => sc.id === card.id);
              return (
                <option key={card.id + '_select'} value={card.name} disabled={isSelected} style={{ background: '#000' }}>
                  {card.name} {isSelected ? '(bereits gewählt)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                border: `1px solid ${filter === f ? 'var(--accent-gold)' : 'var(--card-border)'}`,
                background: filter === f ? 'rgba(204,153,51,0.2)' : 'transparent',
                color: filter === f ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)', fontSize: '0.9rem'
              }}
            >
              {f === 'Wands' ? 'Stäbe' : f === 'Cups' ? 'Kelche' : f === 'Swords' ? 'Schwerter' : f === 'Pentacles' ? 'Münzen' : f === 'Major Arcana' ? 'Gr. Arkana' : 'Alle'}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(var(--card-width), 1fr))', gap: '1.5rem' }}>
        {filteredDeck.map(card => {
          const isSelected = selectedCards.some(sc => sc.id === card.id);
          const isFull = selectedCards.length >= neededCount;
          const isDisabled = isSelected || isFull;
          return (
            <motion.div
              key={card.id}
              whileHover={!isDisabled ? { scale: 1.05, y: -4 } : {}}
              onClick={() => handleCardClick(card)}
              style={{
                cursor: isDisabled ? 'default' : 'pointer',
                opacity: isDisabled ? 0.35 : 1,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  borderRadius: '8px', background: 'rgba(0,180,0,0.3)',
                  border: '2px solid #00cc44', zIndex: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={32} color="#00cc44" />
                </div>
              )}
              <img
                src={card.imagePath}
                alt={card.name}
                style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'block' }}
              />
              <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: isSelected ? '#00cc44' : 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>
                {card.name}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Card Modal: Aufrecht oder Umgekehrt? */}
      <AnimatePresence>
        {pendingCard && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(8px)', zIndex: 3000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-panel"
              style={{ padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}
            >
              <img
                src={pendingCard.imagePath}
                alt={pendingCard.name}
                style={{ width: '140px', borderRadius: '8px', marginBottom: '1.5rem' }}
              />
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>{pendingCard.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Wie liegt diese Karte?</p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn-mystic"
                  onClick={() => confirmCard(false)}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  ↑ Aufrecht
                </button>
                <button
                  className="btn-mystic"
                  onClick={() => confirmCard(true)}
                  style={{ flex: 1, minWidth: '120px', background: 'rgba(180,80,80,0.3)' }}
                >
                  ↓ Umgekehrt
                </button>
              </div>

              <button
                onClick={() => setPendingCard(null)}
                style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '1.5rem auto 0' }}
              >
                <X size={16} /> Zurück
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ManualSelection;
