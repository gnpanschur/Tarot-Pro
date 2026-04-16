import { useContext } from 'react';
import { TarotContext } from '../context/TarotContext';
import { tarotDeck } from '../data/tarotData';
import { audio } from '../services/audioService';

export const useTarot = () => {
  const { currentCards, setCurrentCards } = useContext(TarotContext);

  const shuffleDeck = () => {
    let deck = [...tarotDeck];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const drawCardsRandomly = (count) => {
    audio.playShuffleSound();
    const deck = shuffleDeck();
    const drawn = deck.slice(0, count).map(card => ({
      ...card,
      isReversed: Math.random() > 0.5, // 50% chance of reversal
      isRevealed: false
    }));
    setCurrentCards(drawn);
  };

  const revealCard = (index) => {
    setCurrentCards(prev => {
      const newCards = [...prev];
      if (newCards[index]) newCards[index].isRevealed = true;
      return newCards;
    });
  };

  // For manual selection
  const setManualCards = (selectedCards) => {
    setCurrentCards(selectedCards.map(card => ({
      ...card,
      isRevealed: true // manually selected cards are already revealed
    })));
  };

  const revealAllCards = () => {
    setCurrentCards(prev => prev.map(card => ({ ...card, isRevealed: true })));
  };

  return {
    shuffleDeck,
    drawCardsRandomly,
    revealCard,
    revealAllCards,
    setManualCards
  };
};
