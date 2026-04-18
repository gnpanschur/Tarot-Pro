import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TarotContext } from '../context/TarotContext';
import { useTarot } from '../hooks/useTarot';
import TarotCard from '../components/TarotCard';
import { motion } from 'framer-motion';
import { interpretReading } from '../services/llmService';
import CardInfoModal from '../components/CardInfoModal';

const Reading = () => {
  const { currentSpread, currentCards, question, saveToJournal, safetyMode } = useContext(TarotContext);
  const { drawCardsRandomly, revealCard, revealAllCards } = useTarot();
  const navigate = useNavigate();
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentSpread) {
      navigate('/');
      return;
    }
    
    if (currentCards.length === 0) {
      const countMap = {
        '1-card': 1, '3-cards': 3, 'simple-cross': 4, 'love': 7,
        'decision': 7, 'career': 5, 'yes-no-3': 3, 'celtic-cross': 10,
        'year': 12, 'shadow': 5, 'spiritual': 7, 'relationship-deep': 7,
        'problem-solution': 3, 'daily-energy': 3
      };
      drawCardsRandomly(countMap[currentSpread] || 1);
    }
  }, []);

  const handleInfoClick = (cardData) => {
    setSelectedCardInfo(cardData);
  };

  const getPositionLabel = (index) => {
    const labels = {
      '3-cards': ['Vergangenheit', 'Gegenwart', 'Zukunft'],
      'simple-cross': ['Thema', 'Einfluss', 'Bewusst', 'Ergebnis'],
      'love': ['Fragesteller', 'Fragesteller', 'Partner', 'Partner', 'Basis', 'Problem', 'Ergebnis'],
      'decision': ['Situation', 'Weg A - 1', 'Weg A - 2', 'Ergebnis A', 'Weg B - 1', 'Weg B - 2', 'Ergebnis B'],
      'career': ['Beruf. Lage', 'Talente', 'Hindernis', 'Chance', 'Entwicklung'],
      'yes-no-3': ['Energie', 'Einflüsse', 'Tendenz'],
      'shadow': ['Problem', 'Ursprung', 'Blinder Fleck', 'Hilfe', 'Entwicklung'],
      'spiritual': ['Stand', 'Stärke', 'Herausforderung', 'Lernaufgabe', 'Hilfe', 'Schritt', 'Weg'],
      'relationship-deep': ['Fragesteller', 'Partner', 'Verbindung', 'Problem', 'Was verbindet', 'Entwicklung', 'Rat'],
      'problem-solution': ['Problem', 'Ursache', 'Lösung'],
      'daily-energy': ['Morgen', 'Nachmittag', 'Abend'],
      'celtic-cross': ['Situation', 'Hindernis / Kreuzt', 'Bewusstes Ziel', 'Unbewusst', 'Vergangenheit', 'Zukunft', 'Du selbst', 'Umfeld', 'Hoffnung/Angst', 'Ergebnis'],
      'year': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    };
    if (labels[currentSpread]) return labels[currentSpread][index];
    return `Karte ${index + 1}`;
  };

  const renderCardWithLabel = (index, customStyle = {}, hideLabel = false) => {
    if (!currentCards[index]) return null;
    return (
      <div key={currentCards[index].numericId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', ...customStyle }}>
        {!hideLabel && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.8rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            {getPositionLabel(index)}
          </div>
        )}
        <TarotCard cardContext={currentCards[index]} index={index} onReveal={revealCard} onInfoClick={handleInfoClick} showName={!hideLabel} />
      </div>
    );
  };

  const renderLayout = () => {
    // 1. Flex Row Types (1, 3, or 5 cards horizontally)
    if (['1-card', '3-cards', 'yes-no-3', 'problem-solution', 'daily-energy', 'shadow'].includes(currentSpread)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', rowGap: '6rem', columnGap: '3rem', flexWrap: 'wrap', marginTop: '4rem' }}>
          {currentCards.map((_, i) => renderCardWithLabel(i))}
        </div>
      );
    }

    // 2. Love / Relationship Deep (7 cards in columns)
    if (['love', 'relationship-deep', 'spiritual'].includes(currentSpread)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '4rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {renderCardWithLabel(0)} {renderCardWithLabel(1)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', justifyContent: 'center', marginTop: '4rem' }}>
            {renderCardWithLabel(4)} {renderCardWithLabel(5)} {renderCardWithLabel(6)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {renderCardWithLabel(2)} {renderCardWithLabel(3)}
          </div>
        </div>
      );
    }

    // 3. Career (5 cards - Cross/Star Layout)
    if (currentSpread === 'career') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '6rem', columnGap: '2rem', marginTop: '4rem', placeItems: 'center' }}>
          <div /> {renderCardWithLabel(3)} <div />
          {renderCardWithLabel(1)} {renderCardWithLabel(0)} {renderCardWithLabel(2)}
          <div /> {renderCardWithLabel(4)} <div />
        </div>
      );
    }

    // 4. Simple Cross (4 cards)
    if (currentSpread === 'simple-cross') {
      return (
        <div style={{ position: 'relative', height: 'calc(var(--card-height) * 2.5)', width: '100%', maxWidth: '800px', margin: '4rem auto 0 auto' }}>
          {renderCardWithLabel(0, { position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', zIndex: 1 })}
          {renderCardWithLabel(1, { position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 2 })}
          {renderCardWithLabel(2, { position: 'absolute', top: '10%', left: '70%', transform: 'translate(-50%, 0)' })}
          {renderCardWithLabel(3, { position: 'absolute', bottom: '10%', left: '70%', transform: 'translate(-50%, 0)' })}
        </div>
      );
    }

    // 4. Decision (Y-Shape, 7 cards)
    if (currentSpread === 'decision') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6rem', marginTop: '4rem' }}>
          {/* Situation */}
          {renderCardWithLabel(0)}
          
          {/* Paths diverging */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6rem', width: '100%', flexWrap: 'wrap' }}>
            {/* Path A */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              {renderCardWithLabel(1)} 
              {renderCardWithLabel(2)} 
              {renderCardWithLabel(3)}
            </div>
            {/* Path B */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              {renderCardWithLabel(4)} 
              {renderCardWithLabel(5)} 
              {renderCardWithLabel(6)}
            </div>
          </div>
        </div>
      );
    }

    // 5. Celtic Cross (10 Cards)
    // Layout:
    //   Kreuz-Teil (links):  Karten 0-5 (0=Situation, 1=Kreuzt/Hindernis quergelegt, 2=oben, 3=unten, 4=links, 5=rechts)
    //   Stab-Teil (rechts):  Karten 6,7,8,9 von unten nach oben
    if (currentSpread === 'celtic-cross') {
      return (
        <div style={{ position: 'relative', height: 'calc(var(--card-height) * 4.2)', width: '100%', maxWidth: '1000px', margin: '4rem auto 0 auto', overflowX: 'visible' }}>

          {/* KREUZ — Mitte */}
          {/* Karte 0: Situation (Mitte) */}
          {renderCardWithLabel(0, { position: 'absolute', top: '33%', left: '27%', transform: 'translate(-50%, -50%)', zIndex: 1 }, true)}
          {/* Karte 1: Kreuzt (quer gelegt über Karte 0) */}
          {renderCardWithLabel(1, { position: 'absolute', top: '33%', left: '27%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 2 }, true)}

          {/* Karte 2: Bewusstes Ziel (oben) */}
          {renderCardWithLabel(2, { position: 'absolute', top: '3%', left: '27%', transform: 'translate(-50%, 0)' }, true)}
          {/* Karte 3: Unbewusstes Fundament (unten) */}
          {renderCardWithLabel(3, { position: 'absolute', top: '63%', left: '27%', transform: 'translate(-50%, 0)' }, true)}
          {/* Karte 4: Vergangenes (links) */}
          {renderCardWithLabel(4, { position: 'absolute', top: '33%', left: '3%', transform: 'translate(0, -50%)' }, true)}
          {/* Karte 5: Zukunft (rechts vom Kreuz) */}
          {renderCardWithLabel(5, { position: 'absolute', top: '33%', left: '51%', transform: 'translate(0, -50%)' }, true)}

          {/* STAB — rechts, von UNTEN nach OBEN: 9=oben, 8, 7, 6=unten */}
          <div style={{ position: 'absolute', right: '2%', top: '2%', width: 'calc(var(--card-width) * 1.1)', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {renderCardWithLabel(9, {}, true)}
            {renderCardWithLabel(8, {}, true)}
            {renderCardWithLabel(7, {}, true)}
            {renderCardWithLabel(6, {}, true)}
          </div>
        </div>
      );
    }

    // 6. Year Spread (12 Cards - Grid)
    if (currentSpread === 'year') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', rowGap: '6rem', columnGap: '2rem', marginTop: '4rem', placeItems: 'center' }}>
           {currentCards.map((_, i) => renderCardWithLabel(i))}
        </div>
      );
    }
  };

  const renderCelticCrossTable = () => {
    if (currentSpread !== 'celtic-cross' || currentCards.length === 0) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginTop: '12rem', padding: '2rem', maxWidth: '800px', margin: '12rem auto 0 auto', background: 'transparent', border: 'none' }}
      >
        <h3 style={{ textAlign: 'center', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
          Übersicht der Positionen
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>Position</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>Gezogene Karte</th>
              </tr>
            </thead>
            <tbody>
              {currentCards.map((c, i) => (
                <tr key={`table-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{getPositionLabel(i)}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>
                    {c.isRevealed ? (
                      <>
                        {c.name} <span style={{ fontSize: '0.8rem', opacity: 0.6, fontStyle: 'italic' }}>({c.isReversed ? 'Umgekehrt' : 'Aufrecht'})</span>
                      </>
                    ) : (
                      <span style={{ fontStyle: 'italic', opacity: 0.3 }}>Verdeckt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };


  const isAllRevealed = currentCards.length > 0 && currentCards.every(c => c.isRevealed);

  const handleInterpret = async () => {
    setIsInterpreting(true);
    setInterpretation('');
    setError('');
    
    try {
      const apiKey = localStorage.getItem('tarot_apiKey');
      const text = await interpretReading(apiKey, question, currentSpread, currentCards, safetyMode);
      setInterpretation(text);
      
      // Auto-save to Journal
      saveToJournal({
        question,
        spread: currentSpread,
        cards: currentCards,
        interpretation: text
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsInterpreting(false);
    }
  };

  if (!currentSpread || currentCards.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '10rem', width: '100%', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>Dein Orakel Spricht</h2>
        {question && <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Frage: "{question}"</p>}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Klicke auf die Karten, um sie aufzudecken.</p>

      {/* Reveal All Button */}
      {currentCards.length > 0 && !isAllRevealed && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            className="btn-mystic"
            onClick={revealAllCards}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem', background: 'rgba(204,153,51,0.1)', letterSpacing: '1px' }}
          >
            Alle Karten aufdecken
          </button>
        </div>
      )}

      {renderLayout()}

      {renderCelticCrossTable()}

      {isAllRevealed && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginTop: '6rem' }}>
          <button className="btn-mystic" onClick={handleInterpret} disabled={isInterpreting} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
            {isInterpreting ? 'Die Geister beraten sich...' : 'Legung Interpretieren'}
          </button>
          
          {error && <p style={{ color: '#ff4444', marginTop: '1rem' }}>{error}</p>}
        </motion.div>
      )}

      {/* API Interpretation Result */}
      {interpretation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ marginTop: '4rem', padding: '3rem', maxWidth: '800px', margin: '4rem auto 0 auto', lineHeight: '1.8' }}>
           <h3 style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>Deine Deutung</h3>
           <div style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br/>') }} />
        </motion.div>
      )}

      {/* Info Modal */}
      <CardInfoModal card={selectedCardInfo} onClose={() => setSelectedCardInfo(null)} />
    </motion.div>
  );
};

export default Reading;
