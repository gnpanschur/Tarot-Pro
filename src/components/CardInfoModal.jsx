import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CardInfoModal = ({ card, onClose }) => {
  if (!card) return null;

  // Sometimes 'card' from lexicon won't have 'isReversed' explicitly set if just browsing.
  // We default to false for Lexicon browsing, but respect if it's passed from Reading.
  const isReversed = card.isReversed || false;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
          className="glass-panel card-modal-content mobile-fullscreen-modal"
          style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()} /* prevent closing when clicking inside */
        >
          <div style={{ flexShrink: 0 }}>
            <img 
              src={card.imagePath} 
              alt={card.name} 
              className="card-modal-image"
              style={{ transform: isReversed ? 'rotate(180deg)' : 'none' }} 
            />
          </div>
          <div style={{ flex: 1, color: 'var(--text-primary)' }}>
            <h2 className="card-modal-title">{card.name} {isReversed && '(Umgekehrt)'}</h2>
            <p style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              {card.arcana} {card.suit && `| ${card.suit}`}
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Grundbedeutung ({isReversed ? 'Umgekehrt' : 'Aufrecht'}):</h4>
              <p>{isReversed ? card.reversedMeaning : card.uprightMeaning}</p>
            </div>
            
            {/* If viewed in Lexicon, show BOTH upright and reversed for educational purposes! */}
            {!card.hasOwnProperty('isReversed') && (
               <div style={{ marginBottom: '1.5rem' }}>
                 <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bedeutung Umgekehrt:</h4>
                 <p>{card.reversedMeaning}</p>
               </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Symbolik:</h4>
              <p>{card.symbolism}</p>
            </div>
            
            <button className="btn-mystic" onClick={onClose} style={{ marginTop: 'auto' }}>Zurück</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardInfoModal;
