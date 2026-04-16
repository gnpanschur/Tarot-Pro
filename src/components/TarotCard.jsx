import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { TarotContext } from '../context/TarotContext';
import { Info } from 'lucide-react';
import { audio } from '../services/audioService';

const TarotCard = ({ cardContext, index, onReveal, onInfoClick }) => {
  const { getCardBackImage } = useContext(TarotContext);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback if not mounted
  if (!cardContext) return null;

  const isRevealed = cardContext.isRevealed;
  const isReversed = cardContext.isReversed;

  return (
    <div style={{ position: 'relative', width: 'var(--card-width)', height: 'var(--card-height)', margin: '0 auto', perspective: '1000px' }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transformStyle: 'preserve-3d',
          cursor: isRevealed ? 'default' : 'pointer'
        }}
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 180 : 0,
          scale: (isHovered && !isRevealed) ? 1.05 : 1
        }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        onClick={() => {
          if (!isRevealed) {
            audio.playFlipSound();
            onReveal(index);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Back of Card */}
        <div style={{
          width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: isHovered ? '0 0 20px var(--accent-gold-glow)' : '0 10px 20px rgba(0,0,0,0.5)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <img src={getCardBackImage()} alt="Card Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Front of Card */}
        <div style={{
          width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
          border: '2px solid var(--accent-gold)'
        }}>
          <img 
            src={cardContext.imagePath} 
            alt={cardContext.name} 
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              transform: isReversed ? 'rotate(180deg)' : 'none',
              filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.8))'
            }} 
          />
          
          {/* Info Button on Hover (when revealed) */}
          {isRevealed && (
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              animate={{ opacity: 0.8 }}
              onClick={(e) => { e.stopPropagation(); onInfoClick(cardContext); }}
              style={{
                position: 'absolute',
                top: '10px', right: '10px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '50%', padding: '0.5rem',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                cursor: 'pointer'
              }}
            >
              <Info size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Name Label Underneath */}
      {isRevealed && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{ 
            position: 'absolute', 
            bottom: '-45px', 
            width: '100%', 
            textAlign: 'center', 
            fontFamily: 'var(--font-heading)', 
            color: 'var(--accent-gold)', 
            fontSize: '1rem',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {cardContext.name} 
          {isReversed && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Umgekehrt)</div>}
        </motion.div>
      )}
    </div>
  );
};

export default TarotCard;
