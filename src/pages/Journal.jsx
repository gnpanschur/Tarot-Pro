import React, { useContext, useState } from 'react';
import { TarotContext } from '../context/TarotContext';
import { motion, AnimatePresence } from 'framer-motion';

const Journal = () => {
  const { journal } = useContext(TarotContext);
  const [expandedId, setExpandedId] = useState(null);

  // --- Statistics Calculation ---
  const calculateStats = () => {
    if (!journal || journal.length === 0) return null;

    const cardFreq = {};
    const arcanaCount = { 'Major Arcana': 0, 'Minor Arcana': 0 };
    const suitCount = { 'Wands': 0, 'Cups': 0, 'Swords': 0, 'Pentacles': 0 };

    let totalCards = 0;

    journal.forEach(entry => {
      if (entry.cards) {
        entry.cards.forEach(card => {
          totalCards++;
          
          // Frequencies
          cardFreq[card.name] = (cardFreq[card.name] || 0) + 1;
          
          // Arcana
          if (card.arcana === 'Major Arcana') arcanaCount['Major Arcana']++;
          else arcanaCount['Minor Arcana']++;

          // Suits
          if (card.suit) {
             suitCount[card.suit] = (suitCount[card.suit] || 0) + 1;
          }
        });
      }
    });

    // Sort frequencies to find top 3
    const topCards = Object.entries(cardFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { totalCards, topCards, arcanaCount, suitCount };
  };

  const stats = calculateStats();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem', textShadow: '0 0 20px var(--accent-gold-glow)' }}>Dein Orakel-Journal</h1>

      {/* Statistics Section */}
      {stats && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div style={{ flex: '1 1 250px' }}>
            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Am häufigsten gezogen</h3>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)' }}>
              {stats.topCards.map(([name, count], i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'white' }}>{name}</span> - {count}x
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: '1 1 250px' }}>
            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Arkana Dominanz</h3>
            <div style={{ color: 'var(--text-secondary)' }}>
               <p>Große Arkana: <span style={{ color: 'white' }}>{Math.round((stats.arcanaCount['Major Arcana'] / stats.totalCards) * 100)}%</span></p>
               <p>Kleine Arkana: <span style={{ color: 'white' }}>{Math.round((stats.arcanaCount['Minor Arcana'] / stats.totalCards) * 100)}%</span></p>
            </div>
          </div>

        </div>
      )}

      {/* History List */}
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Vergangene Legungen</h2>
        
        {(!journal || journal.length === 0) ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Du hast noch keine Legungen gespeichert. Lass dir zuerst die Karten legen und sie interpretieren!</p>
        ) : (
          journal.map((entry) => (
            <div key={entry.id} className="glass-panel" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
              <div 
                style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div>
                  <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {entry.question ? `Frage: "${entry.question}"` : 'Allgemeine Legung ohne Frage'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(entry.date).toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' })} | Layout: {entry.spread}
                  </p>
                </div>
                <div style={{ color: 'var(--accent-gold)' }}>
                  {expandedId === entry.id ? 'Einklappen ▲' : 'Ausklappen ▼'}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === entry.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    style={{ borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)' }}
                  >
                    <div style={{ padding: '1.5rem' }}>
                      
                      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {entry.cards && entry.cards.map((c, i) => (
                           <div key={i} style={{ flexShrink: 0, width: '120px', textAlign: 'center' }}>
                             <img src={c.imagePath} alt={c.name} style={{ width: '100%', borderRadius: '4px', transform: c.isReversed ? 'rotate(180deg)' : 'none' }} />
                             <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                               {c.name} {c.isReversed ? '(U)' : ''}
                             </p>
                           </div>
                        ))}
                      </div>

                      <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Interpretation & Resümee</h4>
                      <div dangerouslySetInnerHTML={{ __html: entry.interpretation.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} style={{ color: 'var(--text-primary)', lineHeight: '1.6' }} />

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

    </motion.div>
  );
};

export default Journal;
