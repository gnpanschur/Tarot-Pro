import React, { createContext, useState, useEffect } from 'react';

export const TarotContext = createContext();

export const TarotProvider = ({ children }) => {
  // Settings State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tarot_apiKey') || '');
  const [cardBackIndex, setCardBackIndex] = useState(() => parseInt(localStorage.getItem('tarot_cardBack')) || 1);
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);
  
  // Journal State
  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem('tarot_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Reading State
  const [currentSpread, setCurrentSpread] = useState(null); // type of spread
  const [currentCards, setCurrentCards] = useState([]); // drawn cards
  const [question, setQuestion] = useState('');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('tarot_apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('tarot_cardBack', cardBackIndex);
  }, [cardBackIndex]);

  useEffect(() => {
    localStorage.setItem('tarot_journal', JSON.stringify(journal));
  }, [journal]);

  const saveToJournal = (reading) => {
    setJournal(prev => [{ id: Date.now(), date: new Date().toISOString(), ...reading }, ...prev]);
  };

  const getCardBackImage = () => {
    return `/Tarot_webp/back0${cardBackIndex}.webp`;
  };

  return (
    <TarotContext.Provider value={{
      apiKey, setApiKey,
      cardBackIndex, setCardBackIndex, getCardBackImage,
      journal, saveToJournal,
      currentSpread, setCurrentSpread,
      currentCards, setCurrentCards,
      question, setQuestion,
      isLexiconOpen, setIsLexiconOpen
    }}>
      {children}
    </TarotContext.Provider>
  );
};
